import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Button } from '@mui/material';

const MatchesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [countries, setCountry] = useState([]);
  const [originalMatches, setOriginalMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({ country_id: '',league_id: '',season: '',stage: '', date: '',match_api_id:'', home_team_api_id: '', away_team_api_id: '', home_team_goal: '', away_team_goal: '' });

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('http://127.0.0.1:8000/matches/');
        const data = await response.json();
        setMatches(data.matches);
        setOriginalMatches(data.matches);
    };
    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('http://127.0.0.1:8000/leagues/');
        const data = await response.json();
        setLeagues(data.leagues);
    };
    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('http://127.0.0.1:8000/teams/');
        const data = await response.json();
        setTeams(data.teams);
    };
    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('http://127.0.0.1:8000/countries/');
        const data = await response.json();
        setCountry(data.countries);
    };
    fetchData().catch(console.error);
  }, []);

  function convertArrayOfArraysToObject(arrayOfArrays, k, v) {
    const resultObject = {};
  
    for (let i = 0; i < arrayOfArrays.length; i++) {
      if (arrayOfArrays[i].length >= 2) {
        const key = arrayOfArrays[i][k];
        const value = arrayOfArrays[i][v];
  
        resultObject[key] = value;
      } else {
        console.warn('Sub-array does not have enough elements:', arrayOfArrays[i]);
      }
    }
  
    return resultObject;
  }  

const LeaguesFromArrays = convertArrayOfArraysToObject(leagues,0,1);
const TeamsFromArrays = convertArrayOfArraysToObject(teams,1,3);
const CountriesFromArrays = convertArrayOfArraysToObject(countries,0,1);


  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (!searchTerm) {
      setMatches(originalMatches);
    } else {
      const filteredMatches = originalMatches.filter(Match => {
        const matchValue = TeamsFromArrays[Match[7]] || TeamsFromArrays[Match[8]]; // Assuming Match[7] is the correct element
        return matchValue && typeof matchValue === 'string' && matchValue.toLowerCase().includes(searchTerm);
      });
      setMatches(filteredMatches);
    }
  };

  const handleAddMatch = async () => {
    // Functionality to add a new match
    try {
      const response = await fetch('http://127.0.0.1:8000/add_match/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMatch),
      });
  
      if (response.ok) {
        const addedMatch = await response.json(); // Define and assign addedTeam here
        if (addedMatch && addedMatch.status === "Match added successfully") {
          // Refresh the match list
          // const newMatchesList = [...match, { ...newmatch, id: 'some_id' }]; 
          // setMatches(newMatchesList);
          // setOriginalMatches(newMatchesList);
          
          setNewMatch({ country_id: '',league_id: '',season: '',stage: '', match_date: '',match_api_id:'', home_team_api_id: '', away_team_api_id: '', home_team_goal: '', away_team_goal: '' });
        }
      }
    } catch (error) {
      console.error('Failed to add match:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Match List</Typography>

      <div>
        {/* Form for adding a new match */}
        <TextField label="Country ID" value={newMatch.country_id} onChange={(e) => setNewMatch({ ...newMatch, country_id: e.target.value })} />
        <TextField label="League ID" value={newMatch.league_id} onChange={(e) => setNewMatch({ ...newMatch, league_id: e.target.value })} />
        <TextField label="Season" value={newMatch.season} onChange={(e) => setNewMatch({ ...newMatch, season: e.target.value })} />
        <TextField label="Game Week" value={newMatch.stage} onChange={(e) => setNewMatch({ ...newMatch, stage: e.target.value })} />
        <TextField label="Match Date" value={newMatch.date} onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })} />
        <TextField label="Match API ID" value={newMatch.match_api_id} onChange={(e) => setNewMatch({ ...newMatch, match_api_id: e.target.value })} />
        <TextField label="Home Team" value={newMatch.home_team_api_id} onChange={(e) => setNewMatch({ ...newMatch, home_team_api_id: e.target.value })} />
        <TextField label="Away Team" value={newMatch.away_team_api_id_team_api_id} onChange={(e) => setNewMatch({ ...newMatch, away_team_api_id: e.target.value })} />
        <TextField label="Home Team Goals" value={newMatch.home_team_goal} onChange={(e) => setNewMatch({ ...newMatch, home_team_goal: e.target.value })} />
        <TextField label="Away Team Goals" value={newMatch.away_team_goal} onChange={(e) => setNewMatch({ ...newMatch, away_team_goal: e.target.value })} />
        <Button onClick={handleAddMatch}>Add Match</Button>
      </div>

      <TextField 
        label="Search Match based on Teams" 
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
              <TableCell align="right">Country</TableCell>
              <TableCell align="right">League</TableCell>
              <TableCell align="right">Season</TableCell>
              <TableCell align="right">Game Week</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Match API ID</TableCell>
              <TableCell align="right">Home Team</TableCell>
              <TableCell align="right">Away Team</TableCell>
              <TableCell align="right">Home Team Goals</TableCell>
              <TableCell align="right">Away Team Goals</TableCell>
              
              
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">{match[0]}</TableCell>
                <TableCell align="right">{CountriesFromArrays[match[1]]}</TableCell>
                <TableCell align="right">{LeaguesFromArrays[match[2]]}</TableCell>
                <TableCell align="right">{match[3]}</TableCell>
                <TableCell align="right">{match[4]}</TableCell>
                <TableCell align="right">{match[5]}</TableCell>
                <TableCell align="right">{match[6]}</TableCell>
                <TableCell align="right">{TeamsFromArrays[match[7]]||match[7]}</TableCell>
                <TableCell align="right">{TeamsFromArrays[match[8]]||match[8]}</TableCell>
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
