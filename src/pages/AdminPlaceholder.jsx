import React from "react";
import { Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink } from "react-router-dom";

export default function AdminPlaceholder() {
  return (
    <Container maxWidth="md" className="page-shell">
      <Paper variant="outlined" className="empty-state">
        <Stack spacing={2}>
          <Chip label="Organiser area" />
          <Typography variant="h1">Campaign management is coming later.</Typography>
          <Typography color="text.secondary">
            Organiser login, campaign management, draft review, image handling,
            and publishing tools will be added once the public campaign-sharing
            flow is solid.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            Back to Amplify
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
