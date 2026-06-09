import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Link,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SendIcon from "@mui/icons-material/Send";
import PlatformPreviewFrame from "./PlatformPreviewFrame";
import PlatformIcon from "./PlatformIcon";
import PlatformTip from "./PlatformTips";
import ShareFlowModal from "./ShareFlowModal";
import ShareFlowStep from "./ShareFlowStep";
import { copyToClipboard } from "../utils/clipboard";
import { downloadImage } from "../utils/downloads";
import { buildShareUrl, platformHomeUrl } from "../utils/shareLinks";

export default function ShareComposer({
  shareCard,
  editedText,
  onEditedTextChange,
  channelSelector,
  campaign,
  mobileStep,
  onMobileStepChange,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialCopyStatus, setInitialCopyStatus] = useState("waiting");

  const shareUrl = buildShareUrl(shareCard, editedText);
  const characterCount = editedText.length;
  const characterLimit = getCharacterLimit(shareCard.platform);
  const shouldShareImage = Boolean(shareCard.imageUrl && shareCard.requiresImage);

  async function handlePrimaryShare() {
    const shouldPrepareClipboard = !shareUrl || shouldShareImage;
    if (shouldPrepareClipboard) {
      setInitialCopyStatus("running");
      const copied = await copyToClipboard(editedText);
      setInitialCopyStatus(copied ? "done" : "failed");
    } else {
      setInitialCopyStatus("skipped");
    }
    setModalOpen(true);
  }

  if (campaign && typeof mobileStep === "number") {
    return (
      <MobileShareFlow
        campaign={campaign}
        shareCard={shareCard}
        editedText={editedText}
        onEditedTextChange={onEditedTextChange}
        channelSelector={channelSelector}
        mobileStep={mobileStep}
        onMobileStepChange={onMobileStepChange}
        shareUrl={shareUrl}
        characterCount={characterCount}
        characterLimit={characterLimit}
        shouldShareImage={shouldShareImage}
      />
    );
  }

  return (
    <Paper className="share-action-card" variant="outlined">
      <Box className="share-action-intro">
        <Typography variant="h1" className="share-action-title">
          Share this action
        </Typography>
        <Typography className="share-action-subtitle">
          Personalise the pre-written message below, then share it on your
          channels to help spread the word.
        </Typography>
      </Box>

      <Box className="message-workspace">
        <Box className="share-to-row">
          {channelSelector}
        </Box>

        <Box className="message-tab-body">
          <Box className="desktop-post-meta-row">
            <Box className="desktop-post-header">
              <Box className="desktop-post-avatar">
                <PlatformIcon platform={shareCard.platform} fontSize="small" />
              </Box>
              <Box className="desktop-post-heading-copy">
                <Typography className="desktop-post-title">
                  Your post template
                </Typography>
                <Typography className="desktop-post-subtitle">
                  Prepared for {shareCard.platformLabel}
                </Typography>
              </Box>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className="selected-channel-helper"
            >
              <InfoOutlinedIcon fontSize="small" />
              <Typography>{shareCard.guidance}</Typography>
            </Stack>
          </Box>

          <Box className="message-editor-section">
            <Typography component="label" htmlFor="share-message" className="message-editor-label">
              Your message
            </Typography>

            <Box
              className={`desktop-template-card${
                shouldShareImage ? " desktop-template-card-with-image" : ""
              }`}
            >
              <Box className="message-editor-wrap">
                <TextField
                  id="share-message"
                  value={editedText}
                  onChange={(event) => onEditedTextChange(event.target.value)}
                  multiline
                  minRows={6}
                  fullWidth
                  inputProps={{ "aria-label": "Edit your campaign message" }}
                  className="message-textarea"
                />
                {characterLimit && (
                  <Typography
                    className="character-count"
                    data-over-limit={characterCount > characterLimit}
                    aria-live="polite"
                  >
                    {characterCount} / {characterLimit}
                  </Typography>
                )}
              </Box>
              {shouldShareImage && (
                <Box className="desktop-template-attachment">
                  <Box
                    component="img"
                    src={shareCard.imageUrl}
                    alt=""
                    className="desktop-template-image"
                  />
                  <Stack spacing={0.25} className="desktop-template-image-copy">
                    <Typography className="image-share-title">
                      Suggested campaign image
                    </Typography>
                    <Typography>
                      Attach this image in the send step if you want the post to
                      stand out.
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Box>

            <Stack direction="row" flexWrap="wrap" gap={2} className="share-action-buttons">
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handlePrimaryShare}
                className="primary-share-button"
              >
                Share on {shareCard.platformLabel}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Stack direction="row" spacing={1} alignItems="center" className="privacy-note">
        <LockOutlinedIcon fontSize="small" />
        <Typography>No account needed. We don&apos;t store your message.</Typography>
      </Stack>

      <ShareFlowModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        shareCard={shareCard}
        editedText={editedText}
        shareUrl={shareUrl}
        initialCopyStatus={initialCopyStatus}
      />
    </Paper>
  );
}

function MobileShareFlow({
  campaign,
  shareCard,
  editedText,
  onEditedTextChange,
  channelSelector,
  mobileStep,
  onMobileStepChange,
  shareUrl,
  characterCount,
  characterLimit,
  shouldShareImage,
}) {
  const preparedShareUrl = shareUrl || platformHomeUrl(shareCard.platform);
  const canOpenPreparedShare = Boolean(shareUrl);
  const shouldCopyText = !canOpenPreparedShare || shouldShareImage;
  const [copyStatus, setCopyStatus] = useState("waiting");
  const [downloadStatus, setDownloadStatus] = useState("waiting");
  const [activeShareStep, setActiveShareStep] = useState(0);
  const [copyToastId, setCopyToastId] = useState(0);
  const [platformMenuAnchor, setPlatformMenuAnchor] = useState(null);
  const copyFailed = copyStatus === "failed";
  const hasOnlyOpenStep = !shouldCopyText && !shouldShareImage;
  const platformMenuOpen = Boolean(platformMenuAnchor);

  useEffect(() => {
    setPlatformMenuAnchor(null);
  }, [shareCard.id]);

  useEffect(() => {
    if (mobileStep !== 1) return undefined;

    let cancelled = false;

    async function runMobileShareFlow() {
      setActiveShareStep(0);
      setCopyStatus(shouldCopyText ? "running" : "skipped");
      setDownloadStatus(shouldShareImage ? "waiting" : "skipped");
      let stepIndex = 0;

      if (shouldCopyText) {
        await wait(700);
        const copied = await copyToClipboard(editedText);
        if (cancelled) return;
        setCopyStatus(copied ? "done" : "failed");
        if (copied) setCopyToastId((currentId) => currentId + 1);
        stepIndex += 1;
      }

      if (shouldShareImage) {
        await wait(900);
        if (cancelled) return;
        setActiveShareStep(stepIndex);
        setDownloadStatus("running");
        await wait(700);
        const downloaded = await downloadImage(shareCard.imageUrl);
        if (cancelled) return;
        setDownloadStatus(downloaded ? "done" : "failed");
        stepIndex += 1;
      }

      await wait(850);
      if (!cancelled) setActiveShareStep(stepIndex);
    }

    runMobileShareFlow();

    return () => {
      cancelled = true;
    };
  }, [
    editedText,
    mobileStep,
    shareCard.imageUrl,
    shouldCopyText,
    shouldShareImage,
  ]);

  async function copyAgain() {
    const copied = await copyToClipboard(editedText);
    setCopyStatus(copied ? "done" : "failed");
    if (copied) setCopyToastId((currentId) => currentId + 1);
  }

  async function downloadAgain() {
    setDownloadStatus("running");
    const downloaded = await downloadImage(shareCard.imageUrl);
    setDownloadStatus(downloaded ? "done" : "failed");
  }

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
          ? "Copy it manually below."
          : "Ready to paste when you post.",
      actionLabel: "Copy text",
      actionPrefix: "Didn't work?",
      onAction: copyAgain,
      showAction: copyStatus === "done" || copyStatus === "failed",
      toastLabel: copyStatus === "done" ? "Copied" : "",
      toastKey: copyToastId,
    });
  }

  if (shouldShareImage) {
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
          ? "Download it manually below."
          : "Attach it to your post.",
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
    title: `Now open ${shareCard.platformLabel}`,
    body: getMobileFinalInstruction({
      canOpenPreparedShare,
      copyFailed,
      needsManualImage: shouldShareImage,
      platformLabel: shareCard.platformLabel,
      shouldCopyText,
    }),
  });

  return (
    <Box className="mobile-flow-shell">
      {mobileStep === 0 && (
        <>
          <MobileCampaignBrief campaign={campaign} />
          <Paper variant="outlined" className="mobile-stage-card mobile-compose-stage">
            <Stack spacing={1.25} className="mobile-compose-content">
              <Stack direction="row" spacing={1} className="mobile-guidance">
                <InfoOutlinedIcon fontSize="small" />
                <Typography>
                  Here&apos;s a template message. Personalise it if you can:
                  the more it sounds like you, the better.
                </Typography>
              </Stack>
              <Box className="mobile-native-composer">
                <TextField
                  value={editedText}
                  onChange={(event) => onEditedTextChange(event.target.value)}
                  multiline
                  minRows={7}
                  maxRows={10}
                  fullWidth
                  inputProps={{ "aria-label": "Edit your campaign message" }}
                  className="mobile-native-textarea"
                />
                {characterLimit && (
                  <Typography
                    className="mobile-character-count"
                    data-over-limit={characterCount > characterLimit}
                  >
                    {characterCount} / {characterLimit}
                  </Typography>
                )}
                {shouldShareImage && (
                  <Box className="mobile-template-image-panel">
                    <Box className="mobile-template-image-divider" />
                    <Box
                      component="img"
                      src={shareCard.imageUrl}
                      alt=""
                      className="mobile-native-image"
                    />
                  </Box>
                )}
              </Box>
              <Box className="mobile-compose-action-row">
                <Button
                  type="button"
                  onClick={(event) => setPlatformMenuAnchor(event.currentTarget)}
                  className="mobile-platform-control"
                >
                  <Box className="mobile-current-platform">
                    <PlatformIcon platform={shareCard.platform} fontSize="small" />
                    <Typography>{shareCard.platformLabel}</Typography>
                  </Box>
                  <Box className="mobile-change-platform-button">
                    Change platform
                  </Box>
                </Button>
                <Popover
                  open={platformMenuOpen}
                  anchorEl={platformMenuAnchor}
                  onClose={() => setPlatformMenuAnchor(null)}
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                  className="mobile-platform-popover"
                >
                  <Box className="mobile-platform-menu">{channelSelector}</Box>
                </Popover>
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={() => onMobileStepChange(1)}
                  className="mobile-primary-button"
                >
                  Preview and share
                </Button>
              </Box>
            </Stack>
          </Paper>
        </>
      )}

      {mobileStep === 1 && (
        <Paper variant="outlined" className="mobile-stage-card mobile-share-stage">
          <Stack spacing={2}>
            <Box className="mobile-native-header">
              <PlatformIcon platform={shareCard.platform} fontSize="small" />
              <Box>
                <Typography className="mobile-native-title">
                  Share on {shareCard.platformLabel}
                </Typography>
                <Typography className="mobile-native-subtitle">
                  Finish inside {shareCard.platformLabel}
                </Typography>
              </Box>
            </Box>
            <Stack spacing={1} className="mobile-share-instructions">
              <Typography>
                {shouldCopyText || shouldShareImage
                  ? `Getting your post ready for ${shareCard.platformLabel}.`
                  : `Open ${shareCard.platformLabel}, check it, then send.`}
              </Typography>
              <Box className="mobile-flow-step-stack">
                {flowSteps.map((step, index) => (
                  <ShareFlowStep
                    key={step.key}
                    step={step}
                    index={index}
                    isActive={activeShareStep === index}
                    isVisible={index <= activeShareStep}
                  />
                ))}
              </Box>
            </Stack>
            <Stack spacing={1}>
              {preparedShareUrl && (
                <Button
                  component={Link}
                  href={preparedShareUrl}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  variant="contained"
                  startIcon={<OpenInNewIcon />}
                  className="mobile-primary-button"
                >
                  Open {shareCard.platformLabel}{hasOnlyOpenStep ? " now" : ""}
                </Button>
              )}
            </Stack>
            <Box className="mobile-full-preview">
              <PlatformPreviewFrame shareCard={shareCard} message={editedText} />
            </Box>
            {copyFailed && (
              <TextField
                label="Text to copy"
                value={editedText}
                multiline
                minRows={4}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            )}
            <Button onClick={() => onMobileStepChange(0)}>
              Back to edit message
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}

function MobileCampaignBrief({ campaign }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper variant="outlined" className="mobile-stage-card mobile-blurb-card">
      {campaign.imageUrl && (
        <Box
          component="img"
          src={campaign.imageUrl}
          alt=""
          className="mobile-blurb-image"
        />
      )}
      <Box className="mobile-blurb-copy-wrap" data-expanded={expanded}>
        <Typography className="mobile-stage-kicker">
          {campaign.eyebrow} · {campaign.organiserName}
        </Typography>
        <Typography variant="h1" className="mobile-blurb-title">
          {campaign.title}
        </Typography>
        <Typography className="mobile-blurb-copy">
          {campaign.description}
        </Typography>
        <Button
          size="small"
          onClick={() => setExpanded((current) => !current)}
          className="mobile-blurb-read-more"
        >
          {expanded ? "Show less" : "Read more"}
        </Button>
      </Box>
    </Paper>
  );
}

function getCharacterLimit(platform) {
  if (platform === "twitter" || platform === "x") return 280;
  if (platform === "bluesky") return 300;
  return null;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getMobileFinalInstruction({
  canOpenPreparedShare,
  copyFailed,
  needsManualImage,
  platformLabel,
  shouldCopyText,
}) {
  if (canOpenPreparedShare && !needsManualImage && !shouldCopyText) {
    return `Open ${platformLabel}, check it, then send.`;
  }

  if (copyFailed) {
    return needsManualImage
      ? `Copy the text, upload the image, then post.`
      : `Copy the text, paste it, then post.`;
  }

  if (needsManualImage) {
    return `Upload the image, paste your text, then post.`;
  }

  return `Paste your text, then post.`;
}

export function SharePreviewPanel({ shareCard, editedText }) {
  return (
    <Paper className="preview-panel" variant="outlined">
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className="preview-card-header"
        >
          <Typography variant="h2" className="preview-panel-title">
            Preview
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.75} className="preview-live-status">
            <Box className="status-dot" aria-hidden="true" />
            <Typography>Updates live</Typography>
          </Stack>
        </Stack>
        <Box className="preview-channel-label">
          <PlatformIcon platform={shareCard.platform} fontSize="small" />
          <Typography>{shareCard.platformLabel}</Typography>
        </Box>
        <PlatformPreviewFrame shareCard={shareCard} message={editedText} />
        <PlatformTip platform={shareCard.platform} />
      </Stack>
    </Paper>
  );
}
