import React from "react";
import {
  useTheme,
} from "@mui/material";
const BigButton = (props) => {
  const theme = useTheme();

  const buttonStyle = {
    width: '70%', // Adjust the width as a percentage for responsiveness
    maxWidth: '300px', // Set a maximum width for larger screens
    fontWeight: 'bold',
    fontSize: '1.2em',
    padding: '10px',
    backgroundColor: theme.palette.primary,
    color: theme.palette.augmentColor[400],
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '0 auto' // Center the button horizontally
  };

  return (
    <button style={buttonStyle} onClick={props.oc}>{props.name}</button>
  );
};

export default BigButton;
