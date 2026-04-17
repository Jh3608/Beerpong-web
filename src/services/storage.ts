export const storageService = {
  setTournamentData(tournamentId: string, playerId: string, data: any) {
    localStorage.setItem(`tournament_${tournamentId}`, JSON.stringify({
      playerId,
      ...data,
      timestamp: Date.now(),
    }));
  },

  getTournamentData(tournamentId: string) {
    const data = localStorage.getItem(`tournament_${tournamentId}`);
    return data ? JSON.parse(data) : null;
  },

  clearTournamentData(tournamentId: string) {
    localStorage.removeItem(`tournament_${tournamentId}`);
  },

  setPlayerName(name: string) {
    localStorage.setItem('player_name', name);
  },

  getPlayerName() {
    return localStorage.getItem('player_name') || '';
  },

  setShareCode(code: string) {
    localStorage.setItem('last_share_code', code);
  },

  getShareCode() {
    return localStorage.getItem('last_share_code') || '';
  },
};
