import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Button } from '@mui/material';

const MatchesData = [
  { id: 1,
    country_id: 1,
    league_id: 1,
    season: "2023-24",
    stage: 2,
    date: "01-01-2023",
    match_api_id: 1,
    home_team_api_id: 3,
    away_team_api_id: 4,
    home_team_goal: 2,
    away_team_goal: 3
     },
];

const MatchesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState(MatchesData);
  const [originalMatches, setOriginalMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({ home_team: '', away_team: '', match_date: '', score: '' });


  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('http://127.0.0.1:8000/matches/');
        const data = await response.json();
        setMatches(data.matches);
        console.log(data.matches);
        setOriginalMatches(data.matches);
    };
    fetchData().catch(console.error);
  }, []);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (!searchTerm) {
      setMatches(originalMatches);
    } else {
      const filteredMatches = originalMatches.filter(match => 
        match.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.away_team.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMatches(filteredMatches);
    }
  };
  const handleAddMatch = async () => {
    // Functionality to add a new match
    // Similar to handleAddTeam in your TeamsPage component
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Match List</Typography>

      <div>
        {/* Form for adding a new match */}
        <TextField label="Home Team" value={newMatch.home_team_api_id} onChange={(e) => setNewMatch({ ...newMatch, home_team: e.target.value })} />
        <TextField label="Away Team" value={newMatch.away_team} onChange={(e) => setNewMatch({ ...newMatch, away_team: e.target.value })} />
        <TextField label="Match Date" value={newMatch.match_date} onChange={(e) => setNewMatch({ ...newMatch, match_date: e.target.value })} />
        <TextField label="Score" value={newMatch.score} onChange={(e) => setNewMatch({ ...newMatch, score: e.target.value })} />
        <Button onClick={handleAddMatch}>Add Match</Button>
      </div>

      <TextField 
        label="Search Match" 
        variant="outlined" 
        fullWidth 
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Match ID</TableCell>
              <TableCell align="right">Country ID</TableCell>
              <TableCell align="right">League ID</TableCell>
              <TableCell align="right">Season</TableCell>
              <TableCell align="right">Game Week</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Home Team API ID</TableCell>
              <TableCell align="right">Away Team API ID</TableCell>
              <TableCell align="right">Home Team Goals</TableCell>
              <TableCell align="right">Away Team Goals</TableCell>
              
              
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">{match[0]}</TableCell>
                <TableCell align="right">{match[1]}</TableCell>
                <TableCell align="right">{match[2]}</TableCell>
                <TableCell align="right">{match[3]}</TableCell>
                <TableCell align="right">{match[4]}</TableCell>
                <TableCell align="right">{match[5]}</TableCell>
                <TableCell align="right">{match[7]}</TableCell>
                <TableCell align="right">{match[8]}</TableCell>
                <TableCell align="right">{match[9]}</TableCell>
                <TableCell align="right">{match[10]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MatchesPage;
