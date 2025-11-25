// =============================
// File: src/Interstitial.jsx
// =============================
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
  Box,
  Stack,
} from "@mui/material";

export default function Interstitial({
  variant,
  open,
  onClose,
  platformLabel,
  platformLink,
  hasImage,
  messageText, // <- pass lastPlatform?.message
  campaignImage, // <- pass campaign.image
  url,
}) {
  async function copyAgain() {
    if (!messageText) return;
    try {
      await navigator.clipboard.writeText(messageText);
      // optional: hook into your snackbar instead of alert
      alert("Message copied again.");
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = messageText;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        alert("Message copied again.");
      } catch {
        alert("Could not copy automatically. Please copy manually.");
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  async function downloadAgain(filename = "amplify-image.jpg") {
    if (!campaignImage) return;
    try {
      const res = await fetch(campaignImage, { mode: "cors" });
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Last resort: open the image in a new tab
      const a = document.createElement("a");
      a.href = campaignImage;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        How to post on {platformLabel || "your platform"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          We’ve copied the message to your clipboard
          {hasImage ? " and downloaded the image" : ""}.
        </Typography>
        <ol style={{ marginTop: 0 }}>
          <li>Open the app or website using the button below.</li>

          {variant.type == "manual" && (
            <li>
              Start a new{" "}
              {variant.key == "instagram" ? "story or post" : "post"}.
            </li>
          )}

          <li>
            {variant.type == "manual" && "Paste the message you copied."}
            {variant.type == "direct" && "Your message will be pre-filled"}
          </li>
          {hasImage && <li>Attach the downloaded image, then publish.</li>}
          {platformLink && (
            <Button
              variant="contained"
              href={platformLink}
              target="_blank"
              rel="noopener"
            >
              Open {platformLabel}
            </Button>
          )}
          {!platformLink && variant.useImage && (
            <Button
              variant="contained"
              href={platformLink}
              target="_blank"
              rel="noopener"
            >
              Open {platformLabel}
            </Button>
          )}
        </ol>

        {/* Re-run actions */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Need to do it again?
          </Typography>
          <Stack direction="row" spacing={1}>
            {messageText && (
              <Button variant="outlined" size="small" onClick={copyAgain}>
                Copy text again
              </Button>
            )}
            {campaignImage && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => downloadAgain()}
              >
                Download image again
              </Button>
            )}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        {platformLink && (
          <Button href={platformLink} target="_blank" rel="noopener">
            Open {platformLabel}
          </Button>
        )}
        <Button onClick={onClose} autoFocus>
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
