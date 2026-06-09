import React from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import PlatformIcon from "./PlatformIcon";

const platformOrder = [
  "whatsapp",
  "instagram",
  "facebook",
  "twitter",
  "x",
  "bluesky",
  "signal",
  "sms",
];

export default function ShareCardSelector({
  shareCards,
  selectedId,
  onSelect,
}) {
  const orderedShareCards = [...shareCards].sort((a, b) => {
    const aIndex = platformOrder.indexOf(a.platform);
    const bIndex = platformOrder.indexOf(b.platform);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });

  return (
    <ToggleButtonGroup
      value={selectedId}
      exclusive
      onChange={(_, value) => value && onSelect(value)}
      aria-label="Choose where to share"
      className="channel-card-grid"
    >
      {orderedShareCards.map((card) => (
        <ToggleButton
          key={card.id}
          value={card.id}
          aria-label={card.platformLabel}
          title={card.platformLabel}
          className="channel-card-option"
        >
          <PlatformIcon platform={card.platform} fontSize="small" />
          <span className="channel-card-label">{card.platformLabel}</span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
