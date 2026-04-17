import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiService, Tournament } from '../services/api';
import { usePolling } from '../hooks/usePolling';

interface PlayerStats {
  playerId: string;
  playerName: string;
  teamName: string;
  wins: number;
  losses: number;
  winRate: number;
  pointsFor: number;
  pointsAgainst: number;
}

export default function Stats() {
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const location = useLocation();
  const state = location.state as { playerId: string; tournament: Tournament } | null;

  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  const playerId = state?.playerId;

  const fetchStats = async () => {
    if (!tournamentId || !playerId) return;
    try {
      const data = await apiService.getPlayerStats(tournamentId, playerId);
      setStats(data);
    } catch (error) {
      console.error('[Stats] Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [tournamentId, playerId]);

  // Poll for updates every 5 seconds
  usePolling(fetchStats, 5000, !!tournamentId && !!playerId);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Statistiken werden geladen...</p>
      </div>
    );
  }

  const totalGames = stats.wins + stats.losses;

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Meine Statistiken</h1>
          <p className="text-muted">{stats.playerName} • {stats.teamName}</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Wins */}
          <div className="bg-surface rounded-lg p-6 border border-border text-center">
            <div className="text-4xl font-bold text-primary">{stats.wins}</div>
            <div className="text-sm text-muted mt-2">Siege</div>
          </div>

          {/* Losses */}
          <div className="bg-surface rounded-lg p-6 border border-border text-center">
            <div className="text-4xl font-bold text-foreground">{stats.losses}</div>
            <div className="text-sm text-muted mt-2">Niederlagen</div>
          </div>

          {/* Win Rate */}
          <div className="bg-surface rounded-lg p-6 border border-border text-center">
            <div className="text-4xl font-bold text-primary">{stats.winRate.toFixed(1)}%</div>
            <div className="text-sm text-muted mt-2">Gewinnquote</div>
          </div>

          {/* Total Games */}
          <div className="bg-surface rounded-lg p-6 border border-border text-center">
            <div className="text-4xl font-bold text-foreground">{totalGames}</div>
            <div className="text-sm text-muted mt-2">Spiele gesamt</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-surface rounded-lg p-6 border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Punkte</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted">Punkte erzielt:</span>
              <span className="text-lg font-semibold text-primary">{stats.pointsFor}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Punkte kassiert:</span>
              <span className="text-lg font-semibold text-foreground">{stats.pointsAgainst}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="text-muted">Punkt-Differenz:</span>
              <span className={`text-lg font-semibold ${stats.pointsFor - stats.pointsAgainst >= 0 ? 'text-primary' : 'text-foreground'}`}>
                {stats.pointsFor - stats.pointsAgainst >= 0 ? '+' : ''}{stats.pointsFor - stats.pointsAgainst}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
