import React, { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Button, Collapse, Box} from '@mui/material';
//import { UserContext } from './UserContext'; // Import a context that holds user info
//import { fetchUserFavorites } from '../api'; // Import a function to fetch user data

const UserPage = () => {
  const { user, token } = useContext(); // Use context to get user and token
  const [favorites, setFavorites] = useState({ teams: [], players: [] });

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        const data = await fetch(user.id, token);
        setFavorites(data);
      }
    };
    loadFavorites();
  }, [user, token]);

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div>
      <h1>{user.name}'s Favorite Teams and Players</h1>
      <h2>Teams</h2>
      {favorites.teams.map(team => <div key={team.id}>{team.name}</div>)}
      <h2>Players</h2>
      {favorites.players.map(player => <div key={player.id}>{player.name}</div>)}
    </div>
  );
};

export default UserPage;
