import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Button, Collapse, Box} from '@mui/material';

const TeamsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState([]);
  const [originalTeams, setOriginalTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({ team_api_id: '', team_fifa_api_id: '', team_long_name: '', team_short_name: '' });
  const [allAttributes, setAllAttributes] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/teams/');
      const data = await response.json();
      setTeams(data.teams); 
      console.log(data.teams);
      setOriginalTeams(data.teams);

      const attributesResponse = await fetch('http://127.0.0.1:8000/team_attributes/');
      const attributesData = await attributesResponse.json();
      setAllAttributes(attributesData.team_attributes);
    };

    fetchData().catch(console.error);
  }, []);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (!searchTerm) {
      setTeams(originalTeams); // Reset to the full list when search is cleared
    } else {
      const filteredTeams = originalTeams.filter(Team => 
        Team[3].toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTeams(filteredTeams);
    }
  };

  const handleAddTeam = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/add_team/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      });
  
      if (response.ok) {
        const addedTeam = await response.json(); // Define and assign addedTeam here
        if (addedTeam && addedTeam.status === "Team added successfully") {
          // Refresh the teams list
          // const newTeamsList = [...teams, { ...newTeam, id: 'some_id' }]; 
          // setTeams(newTeamsList);
          // setOriginalTeams(newTeamsList);
          
          setNewTeam({ team_api_id: '', team_fifa_api_id: '', team_long_name: '', team_short_name: '' });
        }
      }
    } catch (error) {
      console.error('Failed to add team:', error);
    }
  };

  const getAttributesForTeam = (team_api_id) => {
    const filteredAttributes = allAttributes.filter(attrArray => {
    return attrArray[2] === team_api_id});
    return filteredAttributes;
  };
  
  const handleInfoClick = (teamId) => {
    const newRow = expandedRow === teamId ? null : teamId;
    setExpandedRow(newRow);
  };
  

  return (
    <div>
      <Typography variant="h4" gutterBottom>Team List</Typography>

      <div>
        <TextField label="Team API ID" value={newTeam.team_api_id} onChange={(e) => setNewTeam({ ...newTeam, team_api_id: e.target.value })} />
        <TextField label="Team FIFA API ID" value={newTeam.team_fifa_api_id} onChange={(e) => setNewTeam({ ...newTeam, team_fifa_api_id: e.target.value })} />
        <TextField label="Team Long Name" value={newTeam.team_long_name} onChange={(e) => setNewTeam({ ...newTeam, team_long_name: e.target.value })} />
        <TextField label="Team Short Name" value={newTeam.team_short_name} onChange={(e) => setNewTeam({ ...newTeam, team_short_name: e.target.value })} />
        <Button onClick={handleAddTeam}>Add Team</Button>
      </div>

      <TextField 
        label="Search Team" 
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
              <TableCell align="left">ID</TableCell>
              <TableCell align="right">Team API ID</TableCell>
              <TableCell align="right">Team FIFA API ID</TableCell>
              <TableCell align="right">Team Name</TableCell>
              <TableCell align="right">Short Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <>
              <TableRow key={team[0]}>
                <TableCell component="th" scope="row">{team[0]}</TableCell>
                <TableCell align="right">{team[1]}</TableCell>
                <TableCell align="right">{team[2]}</TableCell>
                <TableCell align="right">{team[3]}</TableCell>
                <TableCell align="right">{team[4]}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleInfoClick(team[1])}>Info</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={expandedRow === team[1]} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      {/* Rendering team attributes */}
                      {getAttributesForTeam(team[1]).map((attr, index) => (
                        <Typography key={index}>
                          Build Up Play Speed: {attr[3]}
                          buildUpPlayPassing: {attr[4]}
                          chanceCreationPassing: {attr[5]}
                          defencePressure:{attr[6]}
                          defenceAggression: {attr[7]}
                          defenceTeamWidth:{attr[8]}
                        </Typography>
                      ))}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </div>
  );
};

export default TeamsPage;
