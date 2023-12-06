import React, { useState } from 'react';
import { useUser } from './UserContext';
import { TextField, Button, Typography, Paper, Container } from '@mui/material';

const LogInPage = () => {
  const [User_Id, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();
  

  const handleLogin = async (event) => {
    event.preventDefault();
    const success = await login(User_Id, password);
    if (success){
      // User is logged in successfully
      // Redirect to dashboard or another page as needed
      console.log("Login successful");
    } else {
      // Handle login failure
      console.error("Login failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ padding: 20, marginTop: 40 }}>
        <Typography component="h1" variant="h5">
          Sign Ins
        </Typography>
        <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="User ID"
            autoFocus
            value={setUserid.User_Id}
            onChange={(e) => setUserid(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={setPassword.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 30 }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LogInPage;