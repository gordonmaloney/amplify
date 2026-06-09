import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./Header";
import AdminPlaceholder from "./pages/AdminPlaceholder";
import CampaignPage from "./pages/CampaignPage";
import CreatePlaceholder from "./pages/CreatePlaceholder";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const THEME_STORAGE_KEY = "amplify.theme";

function getInitialMode() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) || "dark";
  } catch {
    return "dark";
  }
}

function createAmplifyTheme(mode) {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? "#317144" : "#4f9f68",
        dark: isLight ? "#285c37" : "#377349",
        contrastText: isLight ? "#fbfcfc" : "#0f130f",
      },
      secondary: {
        main: isLight ? "#151d17" : "#f4efe4",
      },
      background: {
        default: isLight ? "#e8edeb" : "#0f130f",
        paper: isLight
          ? "rgba(255, 255, 255, 0.68)"
          : "rgba(244, 239, 228, 0.045)",
      },
      text: {
        primary: isLight ? "#151d17" : "#f4efe4",
        secondary: isLight ? "rgba(21, 29, 23, 0.72)" : "rgba(244, 239, 228, 0.78)",
      },
      divider: isLight ? "rgba(21, 29, 23, 0.11)" : "rgba(244, 239, 228, 0.1)",
    },
    typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: {
      fontFamily: '"Bebas Neue", sans-serif',
      letterSpacing: "0.055em",
      textTransform: "uppercase",
      fontWeight: 400,
    },
    h2: {
      fontFamily: '"Bebas Neue", sans-serif',
      letterSpacing: "0.055em",
      textTransform: "uppercase",
      fontWeight: 400,
    },
    h3: {
      fontFamily: '"Bebas Neue", sans-serif',
      letterSpacing: "0.055em",
      textTransform: "uppercase",
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 500,
      letterSpacing: 0,
      textTransform: "none",
    },
    },
    shape: {
      borderRadius: 6,
    },
    components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: "none",
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Mono", monospace',
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        },
      },
    },
    },
  });
}

export default function App() {
  const [mode, setMode] = useState(getInitialMode);
  const theme = useMemo(() => createAmplifyTheme(mode), [mode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // The toggle still works for the current session if storage is unavailable.
    }
    document.documentElement.dataset.theme = mode;
    document.body.dataset.theme = mode;
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="app-container" data-theme={mode}>
          <Header
            mode={mode}
            onToggleMode={() =>
              setMode((currentMode) =>
                currentMode === "dark" ? "light" : "dark"
              )
            }
          />
          <Box className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/act/:campaignSlug" element={<CampaignPage />} />
              <Route path="/admin" element={<AdminPlaceholder />} />
              <Route path="/create" element={<CreatePlaceholder />} />
              <Route
                path="/campaign"
                element={<Navigate to="/act/tenant-win-rent-strike" replace />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
