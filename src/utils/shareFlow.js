export function getFinalInstruction({
  canOpenPreparedShare,
  copyFailed,
  needsManualImage,
  platformLabel,
  shouldCopyText,
}) {
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
