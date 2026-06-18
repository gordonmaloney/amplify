export const SHARE_ROUTE_IDS = {
  direct: "direct",
  wide: "wide",
};

export const shareRoutes = [
  {
    id: SHARE_ROUTE_IDS.direct,
    label: "Ask someone directly",
    description:
      "Send a personal message to one or a few people who might care.",
    editorNote:
      "This works best when it sounds like a real ask to a real person.",
    platformLabels: {
      whatsapp: "WhatsApp",
      signal: "Signal",
      sms: "SMS",
      messenger: "Messenger / DM",
      copy: "Copy",
    },
    platformOrder: ["whatsapp", "signal", "sms", "messenger", "copy"],
  },
  {
    id: SHARE_ROUTE_IDS.wide,
    label: "Promote in a group or feed",
    description:
      "Post in a group, feed, story or wider channel where more people may see it.",
    editorNote:
      "This works best when you add context for the group or audience you're posting to.",
    platformLabels: {
      whatsapp: "WhatsApp group",
      telegram: "Telegram group",
      signal: "Signal group",
      facebook: "Facebook",
      instagram: "Instagram",
      tiktok: "TikTok",
      twitter: "X",
      x: "X",
      bluesky: "Bluesky",
      copy: "Copy",
    },
    platformOrder: [
      "whatsapp",
      "telegram",
      "signal",
      "facebook",
      "instagram",
      "tiktok",
      "twitter",
      "x",
      "bluesky",
      "copy",
    ],
  },
];

const widePlatforms = new Set([
  "facebook",
  "instagram",
  "tiktok",
  "twitter",
  "x",
  "bluesky",
]);

const directPlatforms = new Set([
  "signal",
  "sms",
  "messenger",
  "dm",
]);

const wideCopyPattern =
  /\b(group|groups|chat|chats|branch|branches|feed|post|public|audience|network|networks|neighbourhood|organising)\b/i;

export function getShareRoute(routeId) {
  return (
    shareRoutes.find((route) => route.id === routeId) || shareRoutes[0]
  );
}

export function getShareCardRouteId(shareCard) {
  if (shareCard.route) return shareCard.route;
  if (shareCard.shareRoute) return shareCard.shareRoute;
  if (shareCard.routeId) return shareCard.routeId;

  const platform = shareCard.platform;
  if (widePlatforms.has(platform)) return SHARE_ROUTE_IDS.wide;
  if (directPlatforms.has(platform)) return SHARE_ROUTE_IDS.direct;

  const copyToCheck = [
    shareCard.platformLabel,
    shareCard.title,
    shareCard.guidance,
    shareCard.recommendedUse,
  ]
    .filter(Boolean)
    .join(" ");

  return wideCopyPattern.test(copyToCheck)
    ? SHARE_ROUTE_IDS.wide
    : SHARE_ROUTE_IDS.direct;
}

export function getCardsForRoute(shareCards, routeId) {
  return shareCards.filter((card) => getShareCardRouteId(card) === routeId);
}

export function getFirstAvailableRouteId(shareCards) {
  return (
    shareRoutes.find((route) => getCardsForRoute(shareCards, route.id).length)
      ?.id || shareRoutes[0].id
  );
}

export function getRoutePlatformLabel(shareCard, routeId) {
  const route = getShareRoute(routeId || getShareCardRouteId(shareCard));
  return route.platformLabels[shareCard.platform] || shareCard.platformLabel;
}

export function sortCardsForRoute(shareCards, routeId) {
  const route = getShareRoute(routeId);
  return [...shareCards].sort((a, b) => {
    const aIndex = route.platformOrder.indexOf(a.platform);
    const bIndex = route.platformOrder.indexOf(b.platform);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
}
