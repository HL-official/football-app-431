import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useUser } from './UserContext';
import { Paper, Typography } from '@mui/material';

const UserDashboard = () => {
  const { user, token } = useContext(UserContext);
  const [userData, setUserData] = useState({ 
    favoriteTeams: [], 
    favoritePlayers: [], 
    teamAttributes: [], 
    playerAttributes: [] 
  });
  const { User, logout } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      // Replace with your actual API endpoint
      const response = await fetch('http://your-api-endpoint/userdata', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data); // Assuming the API returns data in the format expected by `userData`
      } else {
        console.error('Failed to fetch user data');
      }
    };

    if (user && token) {
      fetchUserData();
    }
  }, [user, token]);

  if (!User) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <Paper style={{ padding: 20, margin: 20 }}>
      <Typography variant="h4">User Dashboard</Typography>
      <Typography variant="h6">Favorite Teams</Typography>
      {/* List favorite teams */}
      {userData.favoriteTeams.map(team => (
        <div key={team.id}>{team.name}</div>
      ))}
      
      <Typography variant="h6">Favorite Players</Typography>
      {/* List favorite players */}
      {userData.favoritePlayers.map(player => (
        <div key={player.id}>{player.name}</div>
      ))}

      {/* Similarly, you can add sections for teamAttributes and playerAttributes */}
    </Paper>
  );
};

export default UserDashboard;
