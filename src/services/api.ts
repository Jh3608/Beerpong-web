import axios from 'axios';

const API_BASE_URL = 'https://beerpongapp-rtshsyxf.manus.space/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface Player {
  id: string;
  name: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  result?: {
    team1Score: number;
    team2Score: number;
  };
  completed: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  shareCode: string;
  teams: Team[];
  matches: Match[];
  status: 'planning' | 'in_progress' | 'completed';
}

export const apiService = {
  async joinTournament(shareCode: string, playerName: string): Promise<{ tournament: Tournament; playerId: string }> {
    const response = await api.post('/tournaments/join', {
      shareCode,
      playerName,
    });
    return response.data;
  },

  async getTournament(tournamentId: string): Promise<Tournament> {
    const response = await api.get(`/tournaments/${tournamentId}`);
    return response.data;
  },

  async selectTeam(tournamentId: string, playerId: string, teamId: string): Promise<void> {
    await api.post(`/tournaments/${tournamentId}/select-team`, {
      playerId,
      teamId,
    });
  },

  async getPlayerStats(tournamentId: string, playerId: string): Promise<any> {
    const response = await api.get(`/tournaments/${tournamentId}/player-stats/${playerId}`);
    return response.data;
  },

  async getPlayerMatchHistory(tournamentId: string, playerId: string): Promise<Match[]> {
    const response = await api.get(`/tournaments/${tournamentId}/player-matches/${playerId}`);
    return response.data;
  },

  async registerPushToken(tournamentId: string, playerId: string, token: string): Promise<void> {
    await api.post(`/tournaments/${tournamentId}/register-push-token`, {
      playerId,
      token,
    });
  },
};

export default api;
