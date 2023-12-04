import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField } from '@mui/material';

const CountrysPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countrys, setCountrys] = useState([]);
  const [originalCountrys, setOriginalCountrys] = useState([]); // New state to store the original list of countries

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/countries');
      const data = await response.json();
      setCountrys(data.countries); // Set the current countries state
      setOriginalCountrys(data.countries); // Store the original data
    };

    fetchData().catch(console.error);
  }, []);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (!searchTerm) {
      setCountrys(originalCountrys); // Reset to the full list when search is cleared
    } else {
      const filteredCountrys = originalCountrys.filter(country => 
        country[1].toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCountrys(filteredCountrys);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Country List
      </Typography>
      <TextField 
        label="Search Country" 
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
              <TableCell align="right">Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countrys.map((country) => (
              <TableRow key={country[0]}>
                <TableCell>{country[0]}</TableCell>
                <TableCell align="right">{country[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CountrysPage;
