import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiService, Match, Tournament } from '../services/api';
import { usePolling } from '../hooks/usePolling';

export default function Matches() {
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const location = useLocation();
  const state = location.state as { playerId: string; tournament: Tournament } | null;

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const playerId = state?.playerId;

  const fetchMatches = async () => {
    if (!tournamentId || !playerId) return;
    try {
      const data = await apiService.getPlayerMatchHistory(tournamentId, playerId);
      setMatches(data);
    } catch (error) {
      console.error('[Matches] Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [tournamentId, playerId]);

  // Poll for updates every 5 seconds
  usePolling(fetchMatches, 5000, !!tournamentId && !!playerId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Spiele werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-3 py-2 bg-primary text-secondary rounded-lg hover:opacity-90 transition-all"
          >
            ← Zurück
          </button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Meine Spiele</h1>
          <p className="text-muted">{matches.length} Spiele</p>
        </div>

        {/* Matches List */}
        {matches.length === 0 ? (
          <div className="bg-surface rounded-lg p-6 border border-border text-center">
            <p className="text-muted">Noch keine Spiele gespielt</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-surface rounded-lg p-4 border border-border hover:border-primary transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">Team {match.team1Id.substring(0, 4)}</div>
                    <div className="text-sm text-muted">vs</div>
                  </div>
                  
                  {match.completed && match.result ? (
                    <div className="text-center px-4">
                      <div className="text-2xl font-bold text-primary">
                        {match.result.team1Score} : {match.result.team2Score}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center px-4">
                      <div className="text-sm text-muted">Läuft...</div>
                    </div>
                  )}

                  <div className="flex-1 text-right">
                    <div className="font-semibold text-foreground">Team {match.team2Id.substring(0, 4)}</div>
                    <div className="text-sm text-muted">vs</div>
                  </div>
                </div>

                <div className="text-xs text-muted text-center">
                  {match.completed ? 'Abgeschlossen' : 'Im Gange'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
