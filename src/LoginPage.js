import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Container } from '@mui/material';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [favTeam, setFavTeam  ] = useState('');
  const [favPlayer, setFavPlayer] = useState('');
  const [newUser, setNewUser] = useState({username:'', password:'', favTeam:'', favPlayer:''});


  const handleSignUp = async () => {
    // event.preventDefault();
    // Add your user creation logic here
    // Typically, this would involve making an API call to your backend server
    console.log('User created:');
    try {
      const response = await fetch('http://127.0.0.1:8000/add_user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({newUser}),
    
      });
      console.log('User created:');
      if (response.ok) {
        // const result = await response.json();
        console.log('User created:');
        setNewUser({username:'', password:'', favTeam:'', favPlayer:''});
        
        // Handle further actions upon successful user creation (like redirecting to a login page)
      
      } else {
        // Handle errors, such as displaying a message to the user
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle network errors or other unexpected errors
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ padding: 20, marginTop: 40 }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form onSubmit={handleSignUp} style={{ marginTop: 20 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Fav Team"
            type="Fav Team"
            value={favTeam}
            onChange={(e) => setFavTeam(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Fav Player"
            type="Fav Player"
            value={favPlayer}
            onChange={(e) => setFavPlayer(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 30 }}
          >
            Sign Up
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUpPage;
