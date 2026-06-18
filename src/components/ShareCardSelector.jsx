import React from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import PlatformIcon from "./PlatformIcon";
import { getRoutePlatformLabel, sortCardsForRoute } from "../config/shareRoutes";

export default function ShareCardSelector({
  shareCards,
  selectedId,
  onSelect,
  routeId,
}) {
  const orderedShareCards = sortCardsForRoute(shareCards, routeId);

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
          aria-label={getRoutePlatformLabel(card, routeId)}
          title={getRoutePlatformLabel(card, routeId)}
          className="channel-card-option"
        >
          <PlatformIcon platform={card.platform} fontSize="small" />
          <span className="channel-card-label">
            {getRoutePlatformLabel(card, routeId)}
          </span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export function ShareRouteSelector({ routes, selectedId, onSelect }) {
  return (
    <ToggleButtonGroup
      value={selectedId}
      exclusive
      onChange={(_, value) => value && onSelect(value)}
      aria-label="Choose how you want to share"
      className="route-card-grid"
    >
      {routes.map((route) => (
        <ToggleButton
          key={route.id}
          value={route.id}
          className="route-card-option"
          aria-label={route.label}
        >
          <span className="route-card-title">{route.label}</span>
          <span className="route-card-description">{route.description}</span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
