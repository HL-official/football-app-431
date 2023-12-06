import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';

const MatchsData = [
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

const MatchsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [Matchs, setMatchs] = useState(MatchsData);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const filteredMatchs = MatchsData.filter(Match => 
      Match.Match_long_name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setMatchs(filteredMatchs);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Match List
      </Typography>
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
              <TableCell>ID</TableCell>
              <TableCell align="right">Match ID</TableCell>
              <TableCell align="right">Country ID</TableCell>
              <TableCell align="right">League ID</TableCell>
              <TableCell align="right">Season</TableCell>
              <TableCell align="right">Stage</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Match API ID</TableCell>
              <TableCell align="right">Home Team API ID</TableCell>
              <TableCell align="right">Away Team API ID</TableCell>
              <TableCell align="right">Home Team Goal</TableCell>
              <TableCell align="right">Away Team Goal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Matchs.map((Match) => (
              <TableRow key={Match.id}>
                <TableCell>{Match.id}</TableCell>
                <TableCell align="right">{Match.id}</TableCell>
                <TableCell align="right">{Match.country_id}</TableCell>
                <TableCell align="right">{Match.league_id}</TableCell>
                <TableCell align="right">{Match.season}</TableCell>
                <TableCell align="right">{Match.stage}</TableCell>
                <TableCell align="right">{Match.date}</TableCell>
                <TableCell align="right">{Match.match_api_id}</TableCell>
                <TableCell align="right">{Match.home_team_api_id}</TableCell>
                <TableCell align="right">{Match.away_team_api_id}</TableCell>
                <TableCell align="right">{Match.home_team_goal}</TableCell>
                <TableCell align="right">{Match.away_team_goal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MatchsPage;
