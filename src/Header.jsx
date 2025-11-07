import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <RouterLink to="../">Amplify</RouterLink>
        </Typography>

        <Button
          component={RouterLink}
          to="/campaign"
          sx={{ textTransform: "none" }}
        >
          Campaign
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
