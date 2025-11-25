import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  return (
		<AppBar
			position="static"
			elevation={0}
			sx={{ backgroundColor: "rgb(9, 124, 53)", color: 'white'}}
		>
			<Toolbar>
				<Typography variant="h4" sx={{ flexGrow: 1 }}>
					<RouterLink to="../" style={{color: 'white', fontFamily: "Bebas Neue"}}>AMPLIFY</RouterLink>
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
