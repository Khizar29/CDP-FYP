import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const AlumniCard = ({ name, title, image, classOf, onClick }) => {
  return (
    <Card
      sx={{
        width: 345, // Ensure all cards have a fixed width
        height: 450, // Ensure all cards have a fixed height
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
        height="200" // Fixed height for all images
        image={image || 'https://via.placeholder.com/150'} // Use a placeholder image if none is provided
        alt={name}
        sx={{
          objectFit: 'cover', // Ensure the image covers the area evenly
        }}
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
