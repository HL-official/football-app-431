import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import './App.css';
import HomePage from './homepage';
import PlayersPage from './PlayerPage';
import TeamsPage from './TeamsPage';
import CountrysPage from './CountryPage';
import LeaguesPage from './LeaguesPage';
import LogInPage from './LogInPage';
import MatchsPage from './MatchPage';
import PlayerAttributesPage from './PlayerAttributesPage'; 
import SignUpPage from './SignUpPage';

import { UserProvider } from './UserContext'; // Import UserProvider

//import UserDashboard from './UserDashboard'; // Import your user dashboard component

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
      <UserProvider>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FDBMS
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/players">Players</Button>
            <Button color="inherit" component={Link} to="/teams">Teams</Button>
            <Button color="inherit" component={Link} to="/match">Match</Button>
            <Button color="inherit" component={Link} to="/leagues">League</Button>
            <Button color="inherit" component={Link} to="/country">Country</Button>
            <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            <Button color="inherit" component={Link} to="/user">Log In</Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/country" element={<CountrysPage />} />
          <Route path="/leagues" element={<LeaguesPage />} />
          <Route path="/match" element={<MatchsPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/user" element={<LogInPage />} />
          <Route path="/player_attributes/:playerId" component={PlayerAttributesPage} />
        </Routes>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
