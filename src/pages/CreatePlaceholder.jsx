import React from "react";
import { Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink } from "react-router-dom";

export default function CreatePlaceholder() {
  return (
    <Container maxWidth="md" className="page-shell">
      <Paper variant="outlined" className="empty-state">
        <Stack spacing={2}>
          <Chip label="Campaign builder" />
          <Typography variant="h1">Campaign creation will live here.</Typography>
          <Typography color="text.secondary">
            This flow will eventually let organisers configure platforms,
            suggested copy, images, links, recommended uses, and posting
            instructions for each campaign.
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
