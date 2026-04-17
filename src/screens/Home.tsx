import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiService, Tournament } from '../services/api';
import { storageService } from '../services/storage';
import { usePolling } from '../hooks/usePolling';

export default function Home() {
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const location = useLocation();
  const state = location.state as { playerId: string; tournament: Tournament } | null;

  const [tournament, setTournament] = useState<Tournament | null>(state?.tournament || null);
  const [playerId] = useState(state?.playerId || '');
  const [loading, setLoading] = useState(!tournament);

  const fetchTournament = async () => {
    if (!tournamentId) return;
    try {
      const data = await apiService.getTournament(tournamentId);
      setTournament(data);
    } catch (error) {
      console.error('[Home] Error fetching tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tournament) {
      fetchTournament();
    }
  }, [tournamentId]);

  // Poll for updates every 5 seconds
  usePolling(fetchTournament, 5000, !!tournamentId);

  if (loading || !tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Turnier wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{tournament.name}</h1>
          <p className="text-muted">Code: {tournament.shareCode}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => navigate(`/tournament/${tournamentId}/stats`, { state: { playerId, tournament } })}
            className="px-4 py-3 bg-primary text-secondary font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            📊 Statistiken
          </button>
          <button
            onClick={() => navigate(`/tournament/${tournamentId}/matches`, { state: { playerId, tournament } })}
            className="px-4 py-3 bg-primary text-secondary font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            🎯 Meine Spiele
          </button>
          <button
            onClick={() => {
              storageService.clearTournamentData(tournamentId);
              navigate('/');
            }}
            className="px-4 py-3 bg-surface border border-border text-foreground rounded-lg hover:bg-opacity-80 transition-all"
          >
            🚪 Beenden
          </button>
        </div>

        {/* Tournament Info */}
        <div className="bg-surface rounded-lg p-6 mb-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Turnier-Info</h2>
          <div className="space-y-2 text-muted">
            <p>Status: <span className="text-primary font-semibold">{tournament.status.replace('_', ' ').toUpperCase()}</span></p>
            <p>Teams: <span className="text-primary font-semibold">{tournament.teams.length}</span></p>
            <p>Spiele: <span className="text-primary font-semibold">{tournament.matches.length}</span></p>
          </div>
        </div>

        {/* Teams */}
        <div className="bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Teams</h2>
          <div className="space-y-3">
            {tournament.teams.map((team) => (
              <div key={team.id} className="p-3 bg-background rounded-lg border border-border">
                <div className="font-semibold text-foreground">{team.name}</div>
                <div className="text-sm text-muted mt-1">
                  {team.players.map(p => p.name).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
