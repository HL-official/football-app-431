import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const PlayerAttributesPage = () => {
  const location = useLocation();
  const { attributes } = location.state || {};

  return (
    <div>
      {attributes && attributes.length > 0 ? (
        <Card>
          <CardContent>
            {attributes.map((attribute, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12}>
                  <Typography variant="h6">Attribute Set {index + 1}</Typography>
                </Grid>
                {Object.entries(attribute).map(([key, value], idx) => (
                  <Grid item xs={6} sm={4} key={idx}>
                    <Typography>
                      {key}: {value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Typography>No attributes found.</Typography>
      )}
    </div>
  );
};

export default PlayerAttributesPage;

