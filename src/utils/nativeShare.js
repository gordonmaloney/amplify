export function canUseNativeShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export function buildNativeShareData({ title, text, url }) {
  const shareData = {
    title: title || undefined,
    text,
  };

  if (url && !text.includes(url)) {
    shareData.url = url;
  }

  return shareData;
}

export function isNativeShareAbort(error) {
  return error?.name === "AbortError";
}
