import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';
import QRScanner from '../components/QRScanner';

export default function JoinTournament() {
  const navigate = useNavigate();
  const [shareCode, setShareCode] = useState(storageService.getShareCode());
  const [playerName, setPlayerName] = useState(storageService.getPlayerName());
  const [loading, setLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shareCode.trim() || !playerName.trim()) {
      notificationService.notify('Fehler', 'Bitte füllen Sie alle Felder aus', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.joinTournament(shareCode, playerName);
      
      storageService.setPlayerName(playerName);
      storageService.setShareCode(shareCode);
      storageService.setTournamentData(result.tournament.id, result.playerId, {
        tournamentName: result.tournament.name,
      });

      notificationService.notify('Erfolg', `Willkommen ${playerName}!`, 'success');
      navigate(`/tournament/${result.tournament.id}/select-team`, {
        state: { playerId: result.playerId, tournament: result.tournament }
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Turnier nicht gefunden';
      notificationService.notify('Fehler', message, 'error');
      console.error('[JoinTournament] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScanned = (code: string) => {
    setShareCode(code);
    setShowQRScanner(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">King Cup</h1>
          <p className="text-muted">Beer Pong Turnier</p>
        </div>

        {/* Form */}
        <form onSubmit={handleJoin} className="space-y-4">
          {/* Player Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dein Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="z.B. Max Mustermann"
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>

          {/* Share Code */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Turnier-Code
            </label>
            <input
              type="text"
              value={shareCode}
              onChange={(e) => setShareCode(e.target.value.toUpperCase())}
              placeholder="z.B. ABC123"
              maxLength={6}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary uppercase"
              disabled={loading}
            />
          </div>

          {/* QR Scanner Button */}
          <button
            type="button"
            onClick={() => setShowQRScanner(true)}
            className="w-full px-4 py-2 bg-surface border border-border text-foreground rounded-lg hover:bg-opacity-80 transition-all"
            disabled={loading}
          >
            📱 QR-Code scannen
          </button>

          {/* Join Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary text-secondary font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Wird verbunden...' : 'Turnier beitreten'}
          </button>
        </form>

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <QRScanner
            onScanned={handleQRScanned}
            onClose={() => setShowQRScanner(false)}
          />
        )}
      </div>
    </div>
  );
}
