export function buildShareUrl(shareCard, text) {
  const encodedText = encodeURIComponent(text);

  switch (shareCard.platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedText}`;
    case "telegram":
      return `https://t.me/share/url?url=&text=${encodedText}`;
    case "twitter":
    case "x":
      return `https://x.com/intent/tweet?text=${encodedText}`;
    case "bluesky":
      return `https://bsky.app/intent/compose?text=${encodedText}`;
    case "sms":
      return `sms:?&body=${encodedText}`;
    default:
      return null;
  }
}

export function platformHomeUrl(platform) {
  switch (platform) {
    case "facebook":
      return "https://facebook.com/";
    case "instagram":
      return "https://instagram.com/";
    case "telegram":
      return "https://web.telegram.org/";
    case "messenger":
    case "dm":
      return "https://www.messenger.com/";
    case "signal":
      return "https://signal.org/";
    case "tiktok":
      return "https://www.tiktok.com/";
    case "whatsapp":
      return "https://web.whatsapp.com/";
    case "twitter":
    case "x":
      return "https://x.com/";
    case "bluesky":
      return "https://bsky.app/";
    default:
      return null;
  }
}
