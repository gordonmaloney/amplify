// =============================
// File: src/Campaign.jsx
// =============================
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Link,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { campaign as initialCampaign } from "./DummyData";
import Previews from "./Previews";
import Interstitial from "./Interstitial";

export default function Campaign() {
  const [campaign, setCampaign] = useState(initialCampaign);
  const [snack, setSnack] = useState({ open: false, message: "" });
  const [helpOpen, setHelpOpen] = useState(false);
  const [lastPlatform, setLastPlatform] = useState(null);
  const [url, setUrl] = useState('')

  const hasImage = Boolean(campaign.image);

  async function triggerDownload(url, filename = "amplify-image.jpg") {
    try {
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      return true;
    } catch {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return false;
    }
  }

  const onUpdateVariant = (idx, newVariant) => {
    setCampaign((prev) => {
      const variants = [...prev.variants];
      variants[idx] = newVariant;
      return { ...prev, variants };
    });
  };

  // Receives results from SinglePreview.handlePost
  const handlePostResult = ({ copied, downloaded, variant, url }) => {
    setLastPlatform(variant);
    const manual = variant.type === "manual" || variant.useImage;
    if (manual) setHelpOpen(true);
    setSnack({
      open: true,
      message: `${variant.label}: ${
        manual ? (copied ? "text copied" : "copy failed") : "share opened"
      } · ${
        manual
          ? hasImage
            ? downloaded
              ? "image downloaded"
              : "image download attempted"
            : "no image"
          : ""
      }`.trim(),
    });
    setUrl(url)
  };

  console.log(url)

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", my: 4, p: 2 }}>
      <Card variant="outlined">
        <CardHeader title={campaign.title} subheader={campaign.description} />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Share this on your channels to boost reach.
            </Typography>

            <Divider flexItem />

            <Previews
              variants={campaign.variants}
              onUpdateVariant={onUpdateVariant}
              onPost={handlePostResult}
              campaignImage={campaign.image}
            />
          </Stack>
        </CardContent>
      </Card>

      <Interstitial
        variant={lastPlatform || ""}
        open={helpOpen}
        url={url}
        onClose={() => setHelpOpen(false)}
        platformLabel={lastPlatform?.label}
        platformLink={lastPlatform?.link}
        hasImage={Boolean(campaign.image)}
        messageText={lastPlatform?.message}
        campaignImage={campaign.image}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack({ open: false, message: "" })}
          severity="info"
          variant="filled"
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
