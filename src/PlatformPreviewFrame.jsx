import React, { useRef, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Link as MuiLink,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

function EditableMessage({ value, onChange, sx }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value || "")) {
      ref.current.innerText = value || "";
    }
  }, [value]);

  const handleInput = (e) => {
    const text = e.currentTarget.innerText;
    onChange?.(text);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData(
      "text/plain"
    );
    document.execCommand("insertText", false, text);
  };

  return (
    <Box
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onPaste={handlePaste}
      sx={{ outline: "none", whiteSpace: "pre-wrap", ...sx }}
      role="textbox"
      aria-label="Edit message text"
    />
  );
}

export default function PlatformPreviewFrame({
  variant,
  campaignUrl,
  campaignImage,
  onMessageChange,
}) {
  const { key, message } = variant;

  const xDark = "#0f1419";
  const xSubtle = "#8b98a5";

  // WhatsApp – green sent bubble
  if (key === "whatsapp") {
    return (
      <Box sx={{ p: 2, bgcolor: "#e5ddd5", borderRadius: 2 }}>
        <Box sx={{ maxWidth: 520, ml: "auto" }}>
          <Box
            sx={{
              display: "inline-block",
              bgcolor: "#25D366",
              color: "#fff",
              px: 1.5,
              py: 1,
              borderRadius: 2,
              borderTopRightRadius: 0.5,
              boxShadow: 1,
              position: "relative",
            }}
          >
            <EditableMessage
              value={message}
              onChange={onMessageChange}
              sx={{ fontSize: 14, lineHeight: 1.35 }}
            />
            <Box
              sx={{
                position: "absolute",
                right: -6,
                top: 10,
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "6px solid #25D366",
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  }

  // X / Twitter – dark micro-post
  if (key === "x") {
    return (
      <Box
        sx={{
          border: "1px solid #253341",
          borderRadius: 2,
          p: 1.5,
          bgcolor: xDark,
          color: "#e6e6e6",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar sx={{ width: 36, height: 36, bgcolor: "#1D9BF0" }}>Y</Avatar>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 700, color: "#e6e6e6" }}>
                You
              </Typography>
              <Typography variant="caption" sx={{ color: xSubtle }}>
                @you · 1m
              </Typography>
            </Stack>
            <EditableMessage
              value={message}
              onChange={onMessageChange}
              sx={{ mt: 0.5 }}
            />
            {campaignImage && variant.useImage && (
              <Box
                component="img"
                src={campaignImage}
                alt=""
                sx={{ mt: 1, width: "100%", borderRadius: 2 }}
              />
            )}
          </Box>
        </Stack>
      </Box>
    );
  }

  // Facebook – improved native-like card
  if (key === "facebook") {
    return (
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            sx={{ px: 1.5, py: 1 }}
            spacing={1.5}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#1877F2" }}>
              Y
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, lineHeight: 1 }}>
                You
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Just now ·
                </Typography>
                <PublicIcon fontSize="inherit" color="disabled" />
              </Stack>
            </Box>
            <IconButton size="small">
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* Body */}
          <Box sx={{ px: 1.5 }}>
            <EditableMessage
              value={message}
              onChange={onMessageChange}
              sx={{ mt: 0.5 }}
            />
          </Box>

          {/* Media */}
          {campaignImage && variant.useImage && (
            <Box
              component="img"
              src={campaignImage}
              alt=""
              sx={{
                mt: 1,
                width: "100%",
                display: "block",
                maxHeight: 540,
                objectFit: "cover",
              }}
            />
          )}

          {/* Link preview */}
          {campaignUrl && (
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                m: 1.5,
                p: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {campaignUrl.replace(/^https?:\/\//, "")}
              </Typography>
              <Typography sx={{ mt: 0.5, fontWeight: 600 }}>
                Read more
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Actions row */}
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ px: 0.5, py: 0.5 }}
          >
            <IconButton size="small">
              <ThumbUpOffAltIcon />
            </IconButton>
            <IconButton size="small">
              <ChatBubbleOutlineRoundedIcon />
            </IconButton>
            <IconButton size="small">
              <ShareOutlinedIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Instagram – improved post mock
  if (key === "instagram") {
    return (
      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#000",
          color: "#fff",
        }}
      >
        {/* Top bar */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{ px: 1.5, py: 1 }}
          spacing={1.5}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#E1306C" }}>Y</Avatar>
          <Typography sx={{ fontWeight: 700 }}>You</Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton size="small" sx={{ color: "#fff" }}>
            <MoreHorizIcon />
          </IconButton>
        </Stack>

        {/* Media area (square-ish) */}
        {campaignImage && variant.useImage ? (
          <Box
            component="img"
            src={campaignImage}
            alt=""
            sx={{
              width: "100%",
              maxHeight: 640,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <Box sx={{ width: "100%", pt: "100%", bgcolor: "#111" }} />
        )}

        {/* Action bar */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{ px: 1, py: 0.5 }}
          spacing={1}
        >
          <IconButton size="small" sx={{ color: "#fff" }}>
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: "#fff" }}>
            <ModeCommentOutlinedIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: "#fff" }}>
            <SendOutlinedIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <IconButton size="small" sx={{ color: "#fff" }}>
            <BookmarkBorderIcon />
          </IconButton>
        </Stack>

        {/* Caption */}
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <Typography component="span" sx={{ fontWeight: 700, mr: 1 }}>
            You
          </Typography>
          <EditableMessage
            value={message}
            onChange={onMessageChange}
            sx={{ display: "inline" }}
          />
          <Typography
            variant="caption"
            sx={{ display: "block", opacity: 0.6, mt: 0.5 }}
          >
            JUST NOW
          </Typography>
        </Box>
      </Box>
    );
  }

  // Bluesky – light micro-post
  if (key === "bluesky") {
    return (
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 1.5,
          bgcolor: "#fff",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar sx={{ width: 36, height: 36, bgcolor: "#0ea5e9" }}>Y</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>You</Typography>
            <Typography variant="caption" color="text.secondary">
              @you.bsky.social · now
            </Typography>
            <EditableMessage
              value={message}
              onChange={onMessageChange}
              sx={{ mt: 0.5 }}
            />
            {campaignImage && variant.useImage && (
              <Box
                component="img"
                src={campaignImage}
                alt=""
                sx={{ mt: 1, width: "100%", borderRadius: 2 }}
              />
            )}
          </Box>
        </Stack>
      </Box>
    );
  }

  // Default generic bubble
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#f8fafc",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <EditableMessage value={message} onChange={onMessageChange} />
    </Box>
  );
}
