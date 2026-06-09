import React from "react";
import { AppBar, Button, IconButton, Toolbar, Tooltip } from "@mui/material";
import ExternalLinkIcon from "@mui/icons-material/OpenInNew";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Link as RouterLink } from "react-router-dom";

const Header = ({ mode, onToggleMode }) => {
  const nextMode = mode === "dark" ? "light" : "dark";

  return (
    <AppBar position="sticky" elevation={0} className="site-header">
      <Toolbar className="site-toolbar">
        <RouterLink className="brand-link" to="/">
          <span className="brand-word">
            <span className="brand-green">AMP</span>
            <span>LIFY</span>
          </span>
          <span className="brand-divider">|</span>
          <span className="brand-credit">
            by Tenant<span className="brand-green">Act</span>
          </span>
        </RouterLink>
        <span className="site-toolbar-spacer" />
        <Tooltip title={`Switch to ${nextMode} mode`}>
          <IconButton
            className="header-icon-action"
            onClick={onToggleMode}
            aria-label={`Switch to ${nextMode} mode`}
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
        <Button
          component="a"
          href="https://www.livingrent.org"
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          endIcon={<ExternalLinkIcon />}
          className="header-action living-rent-action"
        >
          <span className="header-action-label">Living Rent</span>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
