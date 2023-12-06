import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Container } from '@mui/material';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [favTeam, setFavTeam  ] = useState('');
  const [favPlayer, setFavPlayer] = useState('');
  const [newUser, setNewUser] = useState({User_Id:'', Password:'', Favorite_Team_API_ID:'', Favorite_Player_API_ID:''});


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/users/');
      const data = await response.json();
      setUsername(data.users); 
      setPassword(data.users); 
      setFavTeam(data.users); 
      setFavPlayer(data.users); 

      };
    
    fetchData().catch(console.error);
  }, []);

  const handleSignUp = async (event) => {
    event.preventDefault();
    // Add your user creation logic here
    // Typically, this would involve making an API call to your backend server
    // console.log('User created:');
    try {
      
      const response = await fetch('http://127.0.0.1:8000/add_user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      if (response.ok) {
        // const result = await response.json();
        console.log('User created:');
        setNewUser({User_Id:'', Passwordassword:'', Favorite_Team_API_ID:'', Favorite_Player_API_ID:''});
        
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
        <form style={{ marginTop: 20 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            type="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, User_Id: e.target.value})}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, Password: e.target.value})}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Fav Team"
            type="Fav Team"
            value={newUser.favTeam}
            onChange={(e) => setNewUser({...newUser,Favorite_Team_API_ID: e.target.value})}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Fav Player"
            type="Fav Player"
            value={newUser.favPlayer}
            onChange={(e) => setNewUser({...newUser,Favorite_Player_API_ID: e.target.value})}
          />
          <Button
            onClick={handleSignUp}
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
