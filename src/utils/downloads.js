export async function downloadImage(url, filename = "amplify-campaign-image.jpg") {
  if (!url) return false;

  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerLink(objectUrl, filename);
    URL.revokeObjectURL(objectUrl);
    return true;
  } catch {
    openImage(url);
    return false;
  }
}

export function openImage(url) {
  if (!url) return;
  triggerLink(url, null, "_blank");
}

function triggerLink(href, download, target) {
  const link = document.createElement("a");
  link.href = href;
  if (download) link.download = download;
  if (target) {
    link.target = target;
    link.rel = "noopener";
  }
  document.body.appendChild(link);
  link.click();
  link.remove();
}
