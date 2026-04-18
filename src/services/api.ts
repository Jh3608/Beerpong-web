import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://beerpongapp-rtshsyxf.manus.space/api';
// For local development, set REACT_APP_API_BASE_URL=http://localhost:3000/api

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
    const response = await api.get(`/tournaments/download?shareCode=${encodeURIComponent(shareCode)}`);
    return { tournament: response.data.tournament, playerId: `player_${Date.now()}` };
  },

  async getTournament(shareCode: string): Promise<Tournament> {
    const response = await api.get(`/tournaments/download?shareCode=${encodeURIComponent(shareCode)}`);
    return response.data.tournament;
  },

  async selectTeam(shareCode: string, playerId: string, teamId: string): Promise<void> {
    // Team selection is handled locally in the app
    // No backend call needed
  },

  async getPlayerStats(shareCode: string, playerId: string): Promise<any> {
    // Player stats are calculated from tournament data
    // No separate backend call needed
    return {};
  },

  async getPlayerMatchHistory(shareCode: string, playerId: string): Promise<Match[]> {
    // Match history is part of tournament data
    // No separate backend call needed
    return [];
  },

  async registerPushToken(shareCode: string, playerId: string, token: string): Promise<void> {
    // Push token registration is optional
    // No backend call needed for now
  },
};

export default api;
