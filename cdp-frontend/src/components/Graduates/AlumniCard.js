// src/components/Graduates/AlumniCard.js
import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const AlumniCard = ({ name, title, image, classOf, onClick }) => {
  return (
    <Card 
      sx={{
        maxWidth: 345, 
        borderRadius: 3, 
        boxShadow: 2, 
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        backgroundColor: '#C1E4FB',
        cursor: 'pointer',
      }}
      onClick={onClick} // Handle card click to navigate to profile
    >
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={name}
      />
      <CardContent sx={{ backgroundColor: '#C1E4FB' }}>
        <Typography variant="h6" component="div" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Class of {classOf}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <IconButton sx={{ float: 'right' }}>
          <ArrowForwardIosIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default AlumniCard;
