import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useUser } from './UserContext';
import { Paper, Typography } from '@mui/material';

const UserDashboard = () => {
  const { user, password} = useContext(UserContext);
  const [userData, setUserData] = useState({ 
    user_id: [],
    favoriteTeams: [], 
    favoritePlayers: {}, 
    teamAttributes: [], 
    playerAttributes: {} 
  });
  const { login } = useUser();
  console.log(user);
  console.log(password);
  useEffect(() => {
    const fetchUserData = async () => {
      // Replace with your actual API endpoint
      const response = await fetch(`http://127.0.0.1:8000/userdata/${parseInt(user)}`, {
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUserData(data); // Assuming the API returns data in the format expected by `userData`
      } else {
        console.error('Failed to fetch user data');
      }
    };
   
    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <Paper style={{ padding: 20, margin: 20 }}>
    <Typography variant="h4">User Dashboard</Typography>

     {/* Display user id */}
     <Typography variant="h6">User ID</Typography>
    <div>{userData.user_id}</div>
    
    {/* Display favorite team */}
    <Typography variant="h6">Favorite Team</Typography>
    <div>{userData.favorite_team}</div>

    {/* Display favorite team's attributes */}
    <Typography variant="h6">Favorite Team's Attributes</Typography>
    {userData.favorite_team_attributes && Object.entries(userData.favorite_team_attributes).map(([key, value]) => (
        <div key={key}>{key}: {value}</div>
    ))}
    
    {/* Display favorite player */}
    <Typography variant="h6">Favorite Player</Typography>
    <div>{userData.favorite_player}</div>

    {/* Display favorite player's attributes */}
    <Typography variant="h6">Favorite Player's Attributes</Typography>
    {userData.favorite_player_attributes && Object.entries(userData.favorite_player_attributes).map(([key, value]) => (
        <div key={key}>{key}: {value}</div>
    ))}
</Paper>
  );
};

export default UserDashboard;
