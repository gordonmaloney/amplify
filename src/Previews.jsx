import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PublicIcon from "@mui/icons-material/Public";
import SinglePreview from "./SinglePreview";

const iconFor = (key) => {
  switch (key) {
    case "whatsapp":
      return <WhatsAppIcon />;
    case "facebook":
      return <FacebookIcon />;
    case "instagram":
      return <InstagramIcon />;
    case "x":
      return <TwitterIcon />; // stand-in for X
    case "bluesky":
      return <PublicIcon />; // placeholder
    default:
      return <PublicIcon />;
  }
};

export default function Previews({
  variants,
  onUpdateVariant,
  onPost,
  campaignImage,
}) {
  const [index, setIndex] = useState(0);
  const total = variants.length;
  const current = variants[index];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const go = (dir) => setIndex((i) => (i + dir + total) % total);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography variant="overline">
          Share on {variants[index].label}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="previous" onClick={() => go(-1)}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton aria-label="next" onClick={() => go(1)}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Stack>

      <SinglePreview
        variant={current}
        campaignImage={campaignImage}
        onChangeMessage={(msg) =>
          onUpdateVariant(index, { ...current, message: msg })
        }
        onPost={(result) => onPost && onPost(result)}
      />

      {/* Platform buttons */}
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 1, mt: 2 }}
        justifyContent="space-around"
      >
        {variants.map((v, i) => (
          <Tooltip key={v.key} title={v.label}>
            <Button
              variant={i === index ? "contained" : "outlined"}
              onClick={() => setIndex(i)}
              startIcon={iconFor(v.key)}
              sx={{
                textTransform: "none",
                minWidth: isMobile ? 48 : "auto",
                px: isMobile ? 1 : 2,
              }}
            >
              {!isMobile && v.label}
            </Button>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}
