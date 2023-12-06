import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Button, Collapse, Box } from '@mui/material';


const PlayersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [originalPlayers, setOriginalPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState({ player_api_id: '', player_name: '', player_fifa_api_id: '', birthday: '', height: '', weight: '', attributes: {
    overall_rating: '', finishing: '', dribbling: '', passing: '', sprint_speed: '', strength: '', gk_diving: '', gk_reflexes: ''}});
  const [allAttributes, setAllAttributes] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingPlayerAttributes, setEditingPlayerAttributes] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'overall_rating', direction: 'ascending' });


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/players/');
      const data = await response.json();
      setPlayers(data.players); 
      setOriginalPlayers(data.players); 

      const attributesResponse = await fetch('http://127.0.0.1:8000/player_attributes/');
      //console.log(attributesResponse);
      const attributesData = await attributesResponse.json();
      //console.log("Fetched Attributes:", attributesData.player_attributes);
      setAllAttributes(attributesData.player_attributes); };
    
    fetchData().catch(console.error);
  }, []);
  
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
  
    // Perform sorting when the button is clicked
    const sortedPlayers = sortPlayers(originalPlayers, allAttributes, newSortConfig);
    setPlayers(sortedPlayers);
  };

  const sortPlayers = (originalPlayers, allAttributes, sortConfig) => {
    // Create a temporary array pairing players with their attributes
    const playersWithAttributes = originalPlayers.map(player => {
      return {
        player,
        attributes: allAttributes.find(attr => attr[2] === player[1]) || {}
      };
    });
    console.log("playersWithAttributes: ",playersWithAttributes);
  
    // Sort the temporary array based on the specified attribute in sortConfig
    playersWithAttributes.sort((a, b) => {
      console.log("a.attributes: ",a.attributes[3]);
      const aValue = a.attributes ? a.attributes[3] : 0;
      const bValue = b.attributes ? b.attributes[3] : 0;
  
      if (sortConfig.direction === 'ascending') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    return playersWithAttributes.map(item => item.player);
  };
  

  

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (!searchTerm) {
      setPlayers(originalPlayers); 
    } else {
      const filteredPlayers = originalPlayers.filter(player => 
        player[2].toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPlayers(filteredPlayers);
    }
  };

  const handleAddPlayer = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/add_player/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      });
      
      //console.log("newPlayer",newPlayer);

      const attributesResponse = await fetch(`http://127.0.0.1:8000/add_player_attributes/${newPlayer.player_api_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: newPlayer.id, ...newPlayer.attributes }),
      });
      if (response.ok && attributesResponse.ok) {
        setNewPlayer({ player_api_id: '', player_name: '', player_fifa_api_id: '', birthday: '', height: '', weight: '', attributes: {
          overall_rating: '', finishing: '', dribbling: '', passing: '', sprint_speed: '', strength: '', gk_diving: '', gk_reflexes: ''} });
      } else {
        // Handle failure to add attributes
        alert("Insufficient");
      }
    } catch (error) {
      console.error('Failed to add player:', error);
    }
  };

  
  const handleRemovePlayer = async (playerId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/remove_player/${playerId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const updatedPlayers = players.filter(player => player[0] !== playerId);
        setPlayers(updatedPlayers);
        setOriginalPlayers(updatedPlayers);
      }
    } catch (error) {
      console.error('Failed to remove player:', error);
    }
  };

  const getAttributesForPlayer = (player_api_id) => {
    const filteredAttributes = allAttributes.filter(attrArray => {

    return attrArray[2] === player_api_id});
    return filteredAttributes;
    
  };

  const handleEditClick = (playerArray,filteredAttributes) => {
    setEditingPlayerAttributes([...filteredAttributes]);
    setEditingPlayer([...playerArray]);
    setIsEditMode(true);
  };
  

  const handleUpdatePlayer = async () => {
    const playerUpdateData = {
      player_name: editingPlayer[2], // Name
      height: editingPlayer[5],      // Height
      weight: editingPlayer[6],      // Weight
      overall_rating: editingPlayerAttributes[3],
      finishing: editingPlayerAttributes[4],
      dribbling: editingPlayerAttributes[5],
      passing: editingPlayerAttributes[6],
      sprint_speed: editingPlayerAttributes[7],
      strength: editingPlayerAttributes[8],
      gk_diving: editingPlayerAttributes[9],
      gk_reflexes: editingPlayerAttributes[10],

    };
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/update_player/${editingPlayer[1]}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerUpdateData),
      });
  
      if (response.ok) {
        setIsEditMode(false);
        setEditingPlayer(null);
        setEditingPlayerAttributes({});
        // Reload players
      } else {
        // Handle non-OK response
      }
    } catch (error) {
      console.error('Failed to update player:', error);
    }
  };
  
  
  
  
  const handleInfoClick = (playerId) => {
    const newRow = expandedRow === playerId ? null : playerId;
    setExpandedRow(newRow);
  };
  
  if (isEditMode && editingPlayer) {
    return (
      <div>
        <Typography variant="h4" gutterBottom>Edit Player</Typography>
        
        <TextField
          label="Name"
          value={editingPlayer[2]} 
          onChange={(e) => {
            const updatedPlayer = [...editingPlayer];
            updatedPlayer[2] = e.target.value;
            setEditingPlayer(updatedPlayer);
          }}
        />
        <TextField
          label="Height"
          value={editingPlayer[5]}
          onChange={(e) => {
            const updatedPlayer = [...editingPlayer];
            updatedPlayer[5] = parseInt(e.target.value, 10);
            setEditingPlayer(updatedPlayer);
          }}
        />
        <TextField
          label="Weight"
          value={editingPlayer[6]}
          onChange={(e) => {
            const updatedPlayer = [...editingPlayer];
            updatedPlayer[6] = parseInt(e.target.value, 10);
            setEditingPlayer(updatedPlayer);
          }}
        />

        <TextField
            label="Overall Rating"
            value={editingPlayerAttributes[3]}
            onChange={(e) => {
              const updatedAttributes = [...editingPlayerAttributes];
              updatedAttributes[3] = parseInt(e.target.value, 10);
              setEditingPlayerAttributes(updatedAttributes);
            }}
        />
        <TextField
            label="finishing"
            value={editingPlayerAttributes[4]}
            onChange={(e) => {
              const updatedAttributes = [...editingPlayerAttributes];
              updatedAttributes[4] = parseInt(e.target.value, 10);
              setEditingPlayerAttributes(updatedAttributes);
            }}
        />
        <TextField
            label="dribbling"
            value={editingPlayerAttributes[5]}
            onChange={(e) => {
              const updatedAttributes = [...editingPlayerAttributes];
              updatedAttributes[5] = parseInt(e.target.value, 10);
              setEditingPlayerAttributes(updatedAttributes);
            }}
        />
        <TextField
            label="passing"
            value={editingPlayerAttributes[6]}
            onChange={(e) => {
              const updatedAttributes = [...editingPlayerAttributes];
              updatedAttributes[6] = parseInt(e.target.value, 10);
              setEditingPlayerAttributes(updatedAttributes);
            }}
        />
        <TextField
            label="sprint_speed"
            value={editingPlayerAttributes[7]}
            onChange={(e) => {
              const updatedAttributes = [...editingPlayerAttributes];
              updatedAttributes[7] = parseInt(e.target.value, 10);
              setEditingPlayerAttributes(updatedAttributes);
            }}
        />
        <TextField
            label="strength"
            value={editingPlayerAttributes[8]}
            onChange={(e) => {
              const updatedAttributes = [...editingPlayerAttributes];
              updatedAttributes[8] = parseInt(e.target.value, 10);
              setEditingPlayerAttributes(updatedAttributes);
            }}
        />
        <TextField
            label="gk_diving"
            value={editingPlayerAttributes[9]}
            onChange={(e) => {
              const updatedAttributes = [...editingPlayerAttributes];
              updatedAttributes[9] = parseInt(e.target.value, 10);
              setEditingPlayerAttributes(updatedAttributes);
            }}
        />
        <TextField
            label="gk_reflexes"
            value={editingPlayerAttributes[10]}
            onChange={(e) => {
              const updatedAttributes = [...editingPlayerAttributes];
              updatedAttributes[10] = parseInt(e.target.value, 10);
              setEditingPlayerAttributes(updatedAttributes);
            }}
        />
        <Button onClick={handleUpdatePlayer}>Update Player</Button>
      </div>
    );
}




  return (
    <div>
      <Typography variant="h4" gutterBottom> Player List </Typography>
      <div>
        <TextField label="API ID" value={newPlayer.player_api_id} onChange={(e) => setNewPlayer({ ...newPlayer, player_api_id: e.target.value })} />
        <TextField label="Name" value={newPlayer.player_name} onChange={(e) => setNewPlayer({ ...newPlayer, player_name: e.target.value })} />
        <TextField label="FIFA API ID" value={newPlayer.player_fifa_api_id} onChange={(e) => setNewPlayer({ ...newPlayer, player_fifa_api_id: e.target.value })} />
        <TextField label="Birthday" value={newPlayer.birthday} onChange={(e) => setNewPlayer({ ...newPlayer, birthday: e.target.value })} />
        <TextField label="Height" value={newPlayer.height} onChange={(e) => setNewPlayer({ ...newPlayer, height: e.target.value })} />
        <TextField label="Weight" value={newPlayer.weight} onChange={(e) => setNewPlayer({ ...newPlayer, weight: e.target.value })} />
        <TextField label="Overall Rating" value={newPlayer.attributes.overall_rating} onChange={(e) => setNewPlayer({ ...newPlayer, attributes: { ...newPlayer.attributes, overall_rating: e.target.value }})} />
        <TextField label="Finishing" value={newPlayer.attributes.finishing} onChange={(e) => setNewPlayer({ ...newPlayer, attributes: { ...newPlayer.attributes, finishing: e.target.value }})} />
        <TextField label="Dribbling" value={newPlayer.attributes.dribbling} onChange={(e) => setNewPlayer({ ...newPlayer, attributes: { ...newPlayer.attributes, dribbling: e.target.value }})} />
        <TextField label="Passing" value={newPlayer.attributes.passing} onChange={(e) => setNewPlayer({ ...newPlayer, attributes: { ...newPlayer.attributes, passing: e.target.value }})} />
        <TextField label="Sprint Speed" value={newPlayer.attributes.sprint_speed} onChange={(e) => setNewPlayer({ ...newPlayer, attributes: { ...newPlayer.attributes, sprint_speed: e.target.value }})} />
        <TextField label="Strength" value={newPlayer.attributes.strength} onChange={(e) => setNewPlayer({ ...newPlayer, attributes: { ...newPlayer.attributes, strength: e.target.value }})} />
        <TextField label="GK Diving" value={newPlayer.attributes.gk_diving} onChange={(e) => setNewPlayer({ ...newPlayer, attributes: { ...newPlayer.attributes, gk_diving: e.target.value }})} />
        <TextField label="GK Reflexes" value={newPlayer.attributes.gk_reflexes} onChange={(e) => setNewPlayer({ ...newPlayer, attributes: { ...newPlayer.attributes, gk_reflexes: e.target.value }})} />
        
        <Button onClick={handleAddPlayer}>Add Player</Button>
              
      </div>

      <TextField label="Search Player" variant="outlined" fullWidth margin="normal" value={searchTerm} onChange={handleSearchChange} />
      <Button onClick={() => requestSort('overall_rating')}>Sort by Rating</Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>        
              <TableCell>ID</TableCell>
              <TableCell align="right">API ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">FIFA API ID</TableCell>
              <TableCell align="right">Birthday</TableCell>
              <TableCell align="right">Height (cm)</TableCell>
              <TableCell align="right">Weight (kg)</TableCell>
              

            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => (
              
              <>
              <TableRow
               key={player[0]}
               sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                  {player[0]}
                </TableCell>
                <TableCell align="right">{player[1]}</TableCell>
                <TableCell align="right">{player[2]}</TableCell>
                <TableCell align="right">{player[3]}</TableCell>
                <TableCell align="right">{player[4]}</TableCell>
                <TableCell align="right">{player[5]}</TableCell>
                <TableCell align="right">{player[6]}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleRemovePlayer(player[0])}>Remove</Button>
                  <Button onClick={() => handleEditClick(player,getAttributesForPlayer(player[1]))}>Edit</Button>
                  <Button onClick={() => handleInfoClick(player[1])}>Info</Button>
                </TableCell>

                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                  <Collapse in={expandedRow !== null && expandedRow === player[1]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Player Attributes
                        </Typography>
                        {getAttributesForPlayer(expandedRow).map((attr, index) => (
                          <Typography key={index}>
                            Overall Rating: {attr[3]}
                            Finishing: {attr[4]}
                            Dribbling: {attr[5]}
                            Passing: {attr[6]}
                            Sprint Speed: {attr[7]}
                            Strength: {attr[8]}
                            GK Diving: {attr[9]}
                            GK Reflexes: {attr[10]}
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

export default PlayersPage;
