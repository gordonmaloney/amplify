import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
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
import DoneAllIcon from "@mui/icons-material/DoneAll";

function PreviewText({ children, sx }) {
  return (
    <Typography sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", ...sx }}>
      {children}
    </Typography>
  );
}

function PhoneShell({ children, title }) {
  return (
    <Box className="phone-preview" aria-label={`${title} preview`}>
      {children}
    </Box>
  );
}

export default function PlatformPreviewFrame({ shareCard, message }) {
  const imageUrl = shareCard.imageUrl;
  const showImage = Boolean(imageUrl && shareCard.requiresImage);
  const platform = shareCard.platform;

  if (platform === "whatsapp" || platform === "signal" || platform === "sms") {
    const isSms = platform === "sms";
    const isSignal = platform === "signal";
    const bubbleColor = isSignal ? "#3b82f6" : isSms ? "#1f7a52" : "#0b6f4b";

    return (
      <PhoneShell title={shareCard.platformLabel}>
        <Stack className="phone-topbar" direction="row" alignItems="center">
          <Avatar sx={{ width: 30, height: 30, bgcolor: bubbleColor }}>
            {isSms ? "T" : "Y"}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              {isSms ? "Text message" : shareCard.platformLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isSignal ? "Trusted group chat" : "Ready to send"}
            </Typography>
          </Box>
        </Stack>
        <Box className="chat-canvas">
          <Box className="chat-bubble" sx={{ bgcolor: bubbleColor }}>
            <PreviewText sx={{ color: "#fff", fontSize: 14, lineHeight: 1.4 }}>
              {message}
            </PreviewText>
            <DoneAllIcon sx={{ fontSize: 16, opacity: 0.78, float: "right" }} />
          </Box>
        </Box>
      </PhoneShell>
    );
  }

  if (platform === "twitter" || platform === "x") {
    return (
      <Box className="x-preview">
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar sx={{ width: 38, height: 38, bgcolor: "#1d9bf0" }}>Y</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography className="x-preview-name" sx={{ fontWeight: 700 }}>
                You
              </Typography>
              <Typography variant="caption" className="x-preview-meta">
                @you · now
              </Typography>
            </Stack>
            <PreviewText sx={{ mt: 0.5 }}>
              {message}
            </PreviewText>
            {showImage && (
              <Box component="img" src={imageUrl} alt="" className="post-image" />
            )}
          </Box>
        </Stack>
      </Box>
    );
  }

  if (platform === "facebook") {
    return (
      <Card variant="outlined" className="facebook-preview">
        <CardContent className="preview-card-content" sx={{ p: 0 }}>
          <Stack direction="row" alignItems="center" sx={{ px: 1.5, py: 1 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#1877f2", mr: 1.5 }}>
              Y
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, lineHeight: 1 }}>
                You
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Just now
                </Typography>
                <PublicIcon fontSize="inherit" color="disabled" />
              </Stack>
            </Box>
            <IconButton size="small" aria-label="Post options">
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box sx={{ px: 1.25, pb: 0.75 }}>
            <PreviewText>{message}</PreviewText>
          </Box>
          {showImage && (
            <Box component="img" src={imageUrl} alt="" className="post-image" />
          )}
          {shareCard.urlToShare && !showImage && (
            <Box className="link-preview">
              <Typography variant="caption" color="text.secondary">
                {shareCard.urlToShare.replace(/^https?:\/\//, "")}
              </Typography>
              <Typography sx={{ mt: 0.5, fontWeight: 700 }}>
                Campaign details
              </Typography>
            </Box>
          )}
          <Divider />
          <Stack direction="row" justifyContent="space-around" sx={{ py: 0.25 }}>
            <IconButton size="small" aria-label="Like">
              <ThumbUpOffAltIcon />
            </IconButton>
            <IconButton size="small" aria-label="Comment">
              <ChatBubbleOutlineRoundedIcon />
            </IconButton>
            <IconButton size="small" aria-label="Share">
              <ShareOutlinedIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (platform === "instagram") {
    return (
      <Box className="instagram-preview">
        <Stack direction="row" alignItems="center" sx={{ px: 1.25, py: 0.75 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#e1306c", mr: 1.25 }}>
            Y
          </Avatar>
          <Typography sx={{ fontWeight: 700 }}>You</Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size="small"
            aria-label="Post options"
            className="instagram-icon-button"
          >
            <MoreHorizIcon />
          </IconButton>
        </Stack>
        {showImage ? (
          <Box component="img" src={imageUrl} alt="" className="instagram-image" />
        ) : (
          <Box className="instagram-empty" />
        )}
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ px: 0.75, py: 0.25 }}>
          <IconButton
            size="small"
            aria-label="Like"
            className="instagram-icon-button"
          >
            <FavoriteBorderIcon />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Comment"
            className="instagram-icon-button"
          >
            <ModeCommentOutlinedIcon />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Send"
            className="instagram-icon-button"
          >
            <SendOutlinedIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size="small"
            aria-label="Save"
            className="instagram-icon-button"
          >
            <BookmarkBorderIcon />
          </IconButton>
        </Stack>
        <Box sx={{ px: 1.25, pb: 1 }}>
          <Typography component="span" sx={{ fontWeight: 700, mr: 1 }}>
            You
          </Typography>
          <PreviewText sx={{ display: "inline" }}>
            {message}
          </PreviewText>
          <Typography variant="caption" sx={{ display: "block", opacity: 0.62, mt: 0.5 }}>
            JUST NOW
          </Typography>
        </Box>
      </Box>
    );
  }

  if (platform === "bluesky") {
    return (
      <Box className="bluesky-preview">
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar sx={{ width: 38, height: 38, bgcolor: "#0ea5e9" }}>Y</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700 }}>You</Typography>
            <Typography variant="caption" color="text.secondary">
              @you.bsky.social · now
            </Typography>
            <PreviewText sx={{ mt: 0.5 }}>{message}</PreviewText>
            {showImage && (
              <Box component="img" src={imageUrl} alt="" className="post-image" />
            )}
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box className="generic-preview">
      <Typography variant="subtitle2" gutterBottom>
        {shareCard.platformLabel}
      </Typography>
      <PreviewText>{message}</PreviewText>
    </Box>
  );
}
