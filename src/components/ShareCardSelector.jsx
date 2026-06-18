import React from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import PlatformIcon from "./PlatformIcon";

export default function ShareCardSelector({
  shareCards,
  selectedId,
  onSelect,
}) {
  return (
    <ToggleButtonGroup
      value={selectedId}
      exclusive
      onChange={(_, value) => value && onSelect(value)}
      aria-label="Choose where to share"
      className="channel-card-grid"
    >
      {shareCards.map((card) => (
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
