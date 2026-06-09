import React from "react";
import { Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Container maxWidth="md" className="page-shell">
      <Paper variant="outlined" className="empty-state">
        <Stack spacing={2}>
          <Chip label="Page not found" />
          <Typography variant="h1">That page is not part of Amplify.</Typography>
          <Typography color="text.secondary">
            Return to the homepage to choose a campaign or organiser tool.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            Back to homepage
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
