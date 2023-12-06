import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';

import { Card, CardContent, Typography } from '@mui/material';

const PlayerCard = ({ player }) => {

  return (
    <Card sx={{ maxWidth: 345, background: '#ececec', margin: '20px' }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {player[2]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Birthday: {player[4]}<br/>
          Height: {player[5]} cm<br/>
          Weight: {player[6]} kg<br/>
          Overall Rating: {player[10]}<br/>
          Finishing: {player[11]}<br/>
          Dribbling: {player[12]}<br/>
          Passing: {player[13]}<br/>
          Sprint Speed: {player[14]}<br/>
          Strength: {player[15]}<br/>
          GK Diving: {player[16]}<br/>
          GK Reflexes: {player[17]}
        </Typography>
      </CardContent>
    </Card>
  );
};



const HomePage = () => {
  const [topPlayer, setTopPlayer] = useState(null);
  const [recentMatch, setRecentMatch] = useState(null);

  useEffect(() => {
    const fetchTopPlayer = async () => {
      const response = await fetch('http://127.0.0.1:8000/top_player/');
      const data = await response.json();
      setTopPlayer(data);
    };

    const fetchRecentMatch = async () => {
      const response = await fetch('http://127.0.0.1:8000/recent_match/');
      const data = await response.json();
      setRecentMatch(data);
    };


    fetchTopPlayer();
    fetchRecentMatch();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to the Football Database Management System
      </Typography>

      <div>
        <Typography variant="h6">Top Player</Typography>
        
      </div>

      {topPlayer && (
        <PlayerCard player={topPlayer.top_player} />
      )}
      

      {recentMatch && recentMatch.recent_match && (
        <div>
          <Typography variant="h6">Recent Match Details:</Typography>
          <Typography variant="body1">
            Match ID: {recentMatch.recent_match[0]}<br/>
            Season: {recentMatch.recent_match[3]}<br/>
            Date: {recentMatch.recent_match[5]}<br/>
            Home Team ID: {recentMatch.recent_match[6]}<br/>
            Away Team ID: {recentMatch.recent_match[7]}<br/>
            Home Team Goals: {recentMatch.recent_match[8]}<br/>
            Away Team Goals: {recentMatch.recent_match[9]}
          </Typography>
        </div>
)}

    </div>
  );
};

export default HomePage;
