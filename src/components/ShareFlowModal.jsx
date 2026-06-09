import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PlatformPreviewFrame from "./PlatformPreviewFrame";
import PlatformIcon from "./PlatformIcon";
import PlatformTip from "./PlatformTips";
import ShareFlowStep from "./ShareFlowStep";
import { copyToClipboard } from "../utils/clipboard";
import { downloadImage } from "../utils/downloads";
import { buildShareUrl, platformHomeUrl } from "../utils/shareLinks";
import { getFinalInstruction } from "../utils/shareFlow";

export default function ShareFlowModal({
  open,
  onClose,
  shareCard,
  editedText,
  shareUrl,
  initialCopyStatus = "waiting",
}) {
  const [copyStatus, setCopyStatus] = useState("waiting");
  const [downloadStatus, setDownloadStatus] = useState("waiting");
  const [activeStep, setActiveStep] = useState(0);
  const [copyToastId, setCopyToastId] = useState(0);

  const activeShareCard = shareCard || {
    platform: "",
    platformLabel: "",
    imageUrl: "",
    requiresImage: false,
  };
  const platformUrl = platformHomeUrl(activeShareCard.platform);
  const preparedShareUrl = shareUrl || buildShareUrl(activeShareCard, editedText);
  const canOpenPreparedShare = Boolean(preparedShareUrl);
  const needsManualImage = Boolean(
    activeShareCard.imageUrl && activeShareCard.requiresImage
  );
  const imageUrl = activeShareCard.imageUrl;
  const shouldCopyText = !canOpenPreparedShare || needsManualImage;
  const hasOnlyOpenStep = !shouldCopyText && !needsManualImage;
  const copyFailed = copyStatus === "failed";

  const flowSteps = [];
  if (shouldCopyText) {
    flowSteps.push({
      key: "copy",
      status: copyStatus,
      icon: <ContentCopyIcon />,
      title:
        copyStatus === "done"
          ? "Your template has been copied"
          : copyStatus === "failed"
            ? "Copying needs a hand"
            : "Copying your template",
      body:
        copyStatus === "failed"
          ? "Your browser blocked automatic copying."
          : "The message is ready on your clipboard, so you can paste it if the platform asks.",
      actionLabel: "Copy text",
      actionPrefix: "Didn't work?",
      onAction: copyAgain,
      showAction: copyStatus === "done" || copyStatus === "failed",
      toastLabel: copyStatus === "done" ? "Copied" : "",
      toastKey: copyToastId,
    });
  }

  if (needsManualImage) {
    flowSteps.push({
      key: "download",
      status: downloadStatus,
      icon: <FileDownloadIcon />,
      title:
        downloadStatus === "done"
          ? "The image download has started"
          : downloadStatus === "failed"
            ? "Download the image manually"
            : "Downloading the campaign image",
      body:
        downloadStatus === "failed"
          ? "If the download did not start, use the small manual button here before opening the platform."
          : "Attach this image to the post when you finish sharing.",
      actionLabel: "Download image",
      actionPrefix: "Didn't work?",
      onAction: downloadAgain,
      showAction: downloadStatus === "done" || downloadStatus === "failed",
    });
  }

  flowSteps.push({
    key: "open",
    status: "ready",
    icon: <OpenInNewIcon />,
    title: `Now open ${activeShareCard.platformLabel}`,
    body: getFinalInstruction({
      canOpenPreparedShare,
      copyFailed,
      needsManualImage,
      platformLabel: activeShareCard.platformLabel,
      shouldCopyText,
    }),
  });

  useEffect(() => {
    if (!open || !shareCard) return undefined;

    let cancelled = false;

    async function runFlow() {
      setActiveStep(0);
      setCopyStatus(shouldCopyText ? "running" : "skipped");
      setDownloadStatus(needsManualImage ? "waiting" : "skipped");
      let stepIndex = 0;

      if (shouldCopyText) {
        await wait(700);
        const copied =
          initialCopyStatus === "done"
            ? true
            : initialCopyStatus === "failed"
              ? false
              : await copyToClipboard(editedText);
        if (cancelled) return;
        setCopyStatus(copied ? "done" : "failed");
        if (copied) setCopyToastId((currentId) => currentId + 1);
        stepIndex += 1;
      }

      if (needsManualImage) {
        await wait(900);
        if (cancelled) return;
        setActiveStep(stepIndex);
        setDownloadStatus("running");
        await wait(700);
        const downloaded = await downloadImage(imageUrl);
        if (cancelled) return;
        setDownloadStatus(downloaded ? "done" : "failed");
        stepIndex += 1;
      }

      await wait(850);
      if (cancelled) return;
      setActiveStep(stepIndex);
    }

    runFlow();

    return () => {
      cancelled = true;
    };
  }, [
    editedText,
    imageUrl,
    initialCopyStatus,
    needsManualImage,
    open,
    shareCard,
    shouldCopyText,
  ]);

  if (!shareCard) return null;

  async function copyAgain() {
    const copied = await copyToClipboard(editedText);
    setCopyStatus(copied ? "done" : "failed");
    if (copied) setCopyToastId((currentId) => currentId + 1);
  }

  async function downloadAgain() {
    setDownloadStatus("running");
    const downloaded = await downloadImage(imageUrl);
    setDownloadStatus(downloaded ? "done" : "failed");
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      className="share-flow-dialog"
    >
      <DialogTitle className="share-flow-titlebar">
        <Stack direction="row" spacing={1.25} alignItems="center">
          <PlatformIcon platform={shareCard.platform} fontSize="small" />
          <span>Send on {shareCard.platformLabel}</span>
        </Stack>
        <IconButton
          aria-label="Close send dialog"
          onClick={onClose}
          className="share-flow-close-button"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box className="share-flow-dialog-grid">
          <Box className="share-flow-preview-panel">
            <Stack spacing={1.5}>
              <Box className="share-flow-preview-header">
                <Typography className="share-flow-preview-title">
                  Preview
                </Typography>
                <Typography className="share-flow-preview-meta">
                  Updates from your edited template
                </Typography>
              </Box>
              <PlatformPreviewFrame shareCard={shareCard} message={editedText} />
            </Stack>
          </Box>

          <Stack spacing={2.25} className="share-flow-steps-panel">
            <Typography className="share-flow-intro">
              {shouldCopyText || needsManualImage
                ? `Amplify is getting the template ready for you. Once the final step is ready, finish the post inside ${shareCard.platformLabel}.`
                : `No copy and paste needed. Open ${shareCard.platformLabel} with your message already prepared, then review and send it.`}
            </Typography>

            <Box className="share-flow-step-stack">
              {flowSteps.map((step, index) => (
                <ShareFlowStep
                  key={step.key}
                  step={step}
                  index={index}
                  isActive={activeStep === index}
                  isVisible={index <= activeStep}
                />
              ))}
            </Box>

            {copyFailed && (
              <TextField
                label="Text to copy"
                value={editedText}
                multiline
                minRows={3}
                fullWidth
                InputProps={{ readOnly: true }}
                className="share-flow-copy-fallback"
              />
            )}
            <Stack gap={1.25}>
              {(preparedShareUrl || platformUrl) && (
                <Button
                  variant="contained"
                  startIcon={<OpenInNewIcon />}
                  component={Link}
                  href={preparedShareUrl || platformUrl}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  className="share-flow-action share-flow-primary-action"
                >
                  Open {shareCard.platformLabel}
                  {hasOnlyOpenStep ? " now" : ""}
                </Button>
              )}
              <PlatformTip platform={shareCard.platform} />
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
