import React, {useState, useEffect} from "react";
import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import PlatformPreviewFrame from "./PlatformPreviewFrame";

export default function SinglePreview({
  variant,
  campaignImage,
  onChangeMessage,
  onPost,
}) {
  const isManual = variant.type === "manual";

  const [campaignUrl, setCampaignUrl] = useState("");
  useEffect(() => {
    if (!variant?.message) return;

    // Regex to match URLs (handles http, https, and www)
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
    const match = variant.message.match(urlRegex);

    if (match) {
      setCampaignUrl(match[0]);
    } else {
      setCampaignUrl(""); // optional: clear if no URL found
    }
  }, [variant?.message]);

  const buildShareUrl = () => {
    const encoded = encodeURIComponent(variant.message);
    switch (variant.key) {
      case "whatsapp":
        return `https://wa.me/?text=${encoded}`;
      case "x":
        return `https://x.com/intent/tweet?text=${encoded}`;
      case "bluesky":
        return `https://bsky.app/intent/compose?text=${encoded}`;
      default:
        return null;
    }
  };

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        return true;
      } catch {
        return false;
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

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

  const handlePost = async () => {
    let url = "";

    if (
      variant.key == "x" ||
      variant.key == "bluesky" ||
      variant.key == "whatsapp"
    ) {
      url = buildShareUrl();
    }

    if (!isManual && !variant.useImage) {
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      onPost && onPost({ copied: false, downloaded: false, variant, url });
      return;
    }

    const copied = await copyText(variant.message);
    let downloaded = false;
    if (campaignImage || variant.useImage)
      downloaded = await triggerDownload(campaignImage);
    onPost && onPost({ copied, downloaded, variant, url });
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 0.5 }}
      >
        Edit the message for this platform
      </Typography>

      <PlatformPreviewFrame
        variant={variant}
        campaignUrl={campaignUrl}
        campaignImage={campaignImage}
      />

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
        <Button
          variant="contained"
          startIcon={<ShareIcon />}
          onClick={handlePost}
          sx={{ textTransform: "none" }}
        >
          Post
        </Button>
      </Stack>
    </Box>
  );
}
