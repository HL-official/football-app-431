import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';

const LeaguesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [originalLeagues, setOriginalLeagues] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/leagues/');
      const data = await response.json();
      setLeagues(data.leagues); 
      setOriginalLeagues(data.leagues); 
    };

    fetchData().catch(console.error);
  }, []);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (!searchTerm) {
      setLeagues(originalLeagues); 
    } else {
      const filteredLeagues = originalLeagues.filter(league => 
        league[1].toLowerCase().includes(searchTerm.toLowerCase())
      );
      setLeagues(filteredLeagues);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        League List
      </Typography>
      <TextField 
        label="Search League" 
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
              <TableCell align="right">League Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leagues.map((league) => (
              <TableRow key={league[0]}>
                <TableCell component="th" scope="row">
                  {league[0]}
                </TableCell>
                <TableCell align="right">{league[1]}</TableCell>
                <TableCell align="right">{league[2]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LeaguesPage;
