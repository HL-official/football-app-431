import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const HomePage = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to the Football Database Management System
      </Typography>
      
      <div>
        <Typography variant="h6">Recent Match Results</Typography>
        {/* Display recent match results here */}
      </div>

      <Button variant="contained" color="primary">
        View Teams
      </Button>
      <Button variant="contained" color="primary">
        View Players
      </Button>
      {/* Add more buttons or links as needed */}
    </div>
  );
};

export default HomePage;
