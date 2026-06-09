import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const platformTips = {
  whatsapp:
    "A short personal ask works best here. Say why you are sharing it and name one person or group you want to come with you.",
  facebook:
    "Facebook posts travel further when they have a clear first sentence, a bit of context, and a direct ask for people to comment or share.",
  instagram:
    "Keep the caption tight and let the image do the work. Stories are stronger with a simple sticker, tag, or short personal note.",
  twitter:
    "Keep it sharp and easy to repost. Lead with the action, then add the link and one reason people should care.",
  x: "Keep it sharp and easy to repost. Lead with the action, then add the link and one reason people should care.",
  bluesky:
    "Bluesky audiences often respond to context. Add one sentence about the campaign stakes before the link.",
  signal:
    "Trusted chats respond to specific asks. Say who the message is for and whether you want people to come, share, or reply.",
  sms:
    "Texts work best one-to-one. Keep it brief, direct, and easy to answer with a yes or no.",
};

function getPlatformTip(platform) {
  return (
    platformTips[platform] ||
    "A personal message from you is more likely to get seen and get people to act."
  );
}

export default function PlatformTip({ platform }) {
  return (
    <Stack direction="row" spacing={1.5} className="tip-card">
      <InfoOutlinedIcon />
      <Box>
        <Typography className="tip-card-title">Tip</Typography>
        <Typography>{getPlatformTip(platform)}</Typography>
      </Box>
    </Stack>
  );
}
