import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { notificationService } from './services/notifications';
import NotificationToast from './components/NotificationToast';
import JoinTournament from './screens/JoinTournament';
import SelectTeam from './screens/SelectTeam';
import Home from './screens/Home';
import Stats from './screens/Stats';
import Matches from './screens/Matches';

function App() {
  useEffect(() => {
    // Request notification permission
    notificationService.requestPermission();
  }, []);

  return (
    <Router>
      <NotificationToast />
      <Routes>
        <Route path="/" element={<JoinTournament />} />
        <Route path="/tournament/:tournamentId/select-team" element={<SelectTeam />} />
        <Route path="/tournament/:tournamentId/home" element={<Home />} />
        <Route path="/tournament/:tournamentId/stats" element={<Stats />} />
        <Route path="/tournament/:tournamentId/matches" element={<Matches />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
