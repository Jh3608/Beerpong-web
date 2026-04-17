import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiService, Tournament } from '../services/api';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';

export default function SelectTeam() {
  const navigate = useNavigate();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const location = useLocation();
  const state = location.state as { playerId: string; tournament: Tournament } | null;
  
  const [tournament, setTournament] = useState<Tournament | null>(state?.tournament || null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const playerId = state?.playerId;

  const handleSelectTeam = async () => {
    if (!selectedTeamId || !tournamentId || !playerId) {
      notificationService.notify('Fehler', 'Bitte wählen Sie ein Team', 'error');
      return;
    }

    setLoading(true);
    try {
      await apiService.selectTeam(tournamentId, playerId, selectedTeamId);
      
      storageService.setTournamentData(tournamentId, playerId, {
        selectedTeamId,
        tournamentName: tournament?.name,
      });

      const selectedTeam = tournament?.teams.find(t => t.id === selectedTeamId);
      notificationService.notify('Erfolg', `Team "${selectedTeam?.name}" ausgewählt!`, 'success');
      
      navigate(`/tournament/${tournamentId}/home`, {
        state: { playerId, tournament }
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Fehler beim Auswählen des Teams';
      notificationService.notify('Fehler', message, 'error');
      console.error('[SelectTeam] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Turnier wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-3 py-2 bg-primary text-secondary rounded-lg hover:opacity-90 transition-all"
          >
            ← Zurück
          </button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Team wählen</h1>
          <p className="text-muted">Wähle dein Team für "{tournament.name}"</p>
        </div>

        {/* Teams List */}
        <div className="space-y-3 mb-6">
          {tournament.teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedTeamId === team.id
                  ? 'border-primary bg-opacity-20 bg-primary'
                  : 'border-border bg-surface hover:border-primary'
              }`}
            >
              <div className="font-semibold text-foreground">{team.name}</div>
              <div className="text-sm text-muted mt-1">
                {team.players.length} Spieler
              </div>
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleSelectTeam}
          disabled={!selectedTeamId || loading}
          className="w-full px-4 py-3 bg-primary text-secondary font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Wird gespeichert...' : 'Team bestätigen'}
        </button>
      </div>
    </div>
  );
}
