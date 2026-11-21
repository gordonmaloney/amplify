export function getFinalInstruction({
  canOpenPreparedShare,
  copyFailed,
  needsManualImage,
  platformLabel,
  shouldCopyText,
  platform,
}) {
  if (platform === "copy" || platform === "native_share") {
    if (copyFailed) {
      return "Copy the message manually, then paste it wherever you want to send it.";
    }

    return "Your message is copied. Paste it into the app, group, feed, email or message thread you want to use.";
  }

  if (canOpenPreparedShare && !needsManualImage && !shouldCopyText) {
    return `Open ${platformLabel} with your message already prepared, review it, and send it when you are happy.`;
  }

  if (copyFailed) {
    return needsManualImage
      ? `Copy the message manually, then open ${platformLabel}, upload the campaign image, paste the message, and publish.`
      : `Copy the message manually, then open ${platformLabel}, paste it, and publish.`;
  }

  if (needsManualImage) {
    return `Open ${platformLabel}, upload the campaign image, paste your copied message, and publish.`;
  }

  return `Open ${platformLabel}, paste your copied message, and publish.`;
}
