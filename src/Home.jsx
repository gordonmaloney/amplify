import React from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 6, px: 2 }}>
      <Card variant="outlined">
        <CardHeader title="Amplify" subheader="from Living Rent" />
        <CardContent>

          <Typography paragraph>
            Billionares, oligarchs and tech-bros can buy our social networks,
            newspapers and TV stations. They can flood the internet with bots.
            They can manipulate algorithms and platform policies to push
            misinformation and advertising.
          </Typography>
          <Typography paragraph>
            But what they don't have - and can't take from us - are the real,
            natural relationships that ordinary people have with our friends,
            colleagues, neighbours, and family. And there is no amount of money,
            no suppressive algorithm, no AI-generated slop that can outweigh a
            real message from a trusted friend.
          </Typography>
          <Typography paragraph>
            That's what this tool is for: for organisers to make use the
            organic networks of members and supporters to amplify our messages -
            despite the best efforts of Musk and Zuckerberg.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
