export const SHARING_MODE_IDS = {
  askDirectly: "ask_directly",
  groupOrFeed: "group_or_feed",
};

export const sharingModes = [
  {
    id: SHARING_MODE_IDS.askDirectly,
    label: "Ask someone directly",
    description: "Send a personal message to one person or a small chat.",
    examples: ["WhatsApp", "Signal", "SMS", "Messenger / DM"],
    recommended: true,
    platforms: ["whatsapp", "signal", "sms", "messenger", "dm", "copy"],
    fallbackMessageTitle: "Your personal ask",
    tip: "Tip: personal messages work best when they sound like a real ask to a real person.",
  },
  {
    id: SHARING_MODE_IDS.groupOrFeed,
    label: "Share to a group or feed",
    description: "Post in a group chat, social feed, story or wider channel.",
    examples: ["WhatsApp group", "Facebook", "Instagram", "X", "Bluesky"],
    platforms: [
      "whatsapp",
      "facebook",
      "instagram",
      "tiktok",
      "twitter",
      "x",
      "bluesky",
      "copy",
    ],
    fallbackMessageTitle: "Your group or feed message",
    tip: "Tip: group and feed posts work best when you add one line explaining why this audience should care.",
  },
];

const modeById = new Map(sharingModes.map((mode) => [mode.id, mode]));

const channelLabels = {
  [SHARING_MODE_IDS.askDirectly]: {
    whatsapp: "WhatsApp",
    signal: "Signal",
    sms: "SMS",
    messenger: "Messenger / DM",
    dm: "Messenger / DM",
    copy: "Copy",
  },
  [SHARING_MODE_IDS.groupOrFeed]: {
    whatsapp: "WhatsApp group",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    twitter: "X",
    x: "X",
    bluesky: "Bluesky",
    copy: "Copy",
  },
};

const messageLabels = {
  [SHARING_MODE_IDS.askDirectly]: {
    whatsapp: "Your personal ask",
    sms: "Your text message",
    messenger: "Your direct message",
    dm: "Your direct message",
    copy: "Your message",
  },
  [SHARING_MODE_IDS.groupOrFeed]: {
    whatsapp: "Your group message",
    facebook: "Your Facebook post",
    instagram: "Your caption",
    tiktok: "Your caption or video prompt",
    twitter: "Your post",
    x: "Your post",
    bluesky: "Your post",
    copy: "Your message",
  },
};

const preferredSourceByMode = {
  [SHARING_MODE_IDS.askDirectly]: ["whatsapp", "signal", "sms"],
  [SHARING_MODE_IDS.groupOrFeed]: [
    "facebook",
    "instagram",
    "twitter",
    "x",
    "bluesky",
    "whatsapp",
  ],
};

export function getSharingMode(modeId) {
  return modeById.get(modeId) || sharingModes[0];
}

export function getDefaultSharingModeId() {
  return sharingModes.find((mode) => mode.recommended)?.id || sharingModes[0].id;
}

export function getChannelLabel(platform, modeId, fallback = "") {
  return channelLabels[modeId]?.[platform] || fallback;
}

export function getMessageTitle(platform, modeId) {
  const mode = getSharingMode(modeId);
  return messageLabels[mode.id]?.[platform] || mode.fallbackMessageTitle;
}

export function getCardsForSharingMode(shareCards, modeId) {
  const mode = getSharingMode(modeId);
  const platformSet = new Set(mode.platforms);
  const cards = shareCards
    .filter((card) => platformSet.has(card.platform))
    .map((card) => ({
      ...card,
      platformLabel: getChannelLabel(card.platform, mode.id, card.platformLabel),
    }));

  const orderedCards = cards.sort(
    (a, b) => mode.platforms.indexOf(a.platform) - mode.platforms.indexOf(b.platform)
  );

  const copySource = getCopySourceCard(shareCards, mode.id);
  if (copySource) {
    orderedCards.push({
      ...copySource,
      id: `copy-${mode.id}`,
      platform: "copy",
      platformLabel: "Copy",
      title: "Copy message",
      guidance: "",
      requiresImage: false,
      shareMode: "manual",
    });
  }

  return orderedCards;
}

function getCopySourceCard(shareCards, modeId) {
  const preferredPlatforms = preferredSourceByMode[modeId] || [];
  return (
    preferredPlatforms
      .map((platform) => shareCards.find((card) => card.platform === platform))
      .find(Boolean) || shareCards[0]
  );
}
