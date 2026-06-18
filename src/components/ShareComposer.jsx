import React, { useEffect, useRef, useState } from "react";
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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
import { getMessageTitle, SHARING_MODE_IDS } from "../config/shareModes";

export default function ShareComposer({
  shareCard,
  editedText,
  onEditedTextChange,
  sharingModes = [],
  selectedSharingMode,
  onSelectSharingMode,
  shareStep,
  onShareStepChange,
  channelSelector,
  campaign,
  mobileStep,
  onMobileStepChange,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialCopyStatus, setInitialCopyStatus] = useState("waiting");
  const stepTwoMessageRef = useRef(null);

  const shareUrl = buildShareUrl(shareCard, editedText);
  const characterCount = editedText.length;
  const characterLimit = getCharacterLimit(shareCard.platform);
  const shouldShareImage = Boolean(shareCard.imageUrl && shareCard.requiresImage);
  const selectedModeId = selectedSharingMode?.id || SHARING_MODE_IDS.askDirectly;
  const messageTitle = getMessageTitle(shareCard.platform, selectedModeId);
  const isMobile = campaign && typeof mobileStep === "number";
  const isFinalMobileShareStep = isMobile && mobileStep === 1;

  useEffect(() => {
    if (!isMobile || shareStep !== 2 || isFinalMobileShareStep) return undefined;

    const scrollId = window.setTimeout(() => {
      stepTwoMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => window.clearTimeout(scrollId);
  }, [isFinalMobileShareStep, isMobile, shareStep, selectedModeId]);

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

  function handlePrimaryAction() {
    if (isMobile && onMobileStepChange) {
      onMobileStepChange(1);
      return;
    }

    handlePrimaryShare();
  }

  if (isFinalMobileShareStep) {
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
        channelLabel={shareCard.platformLabel}
        characterCount={characterCount}
        characterLimit={characterLimit}
        shouldShareImage={shouldShareImage}
      />
    );
  }

  const composerCard = (
    <Paper className="share-action-card" variant="outlined">
      <Box className="share-flow-panel">
        <Box className="share-action-intro">
          <Typography variant="h1" className="share-action-title">
            Share this action
          </Typography>
          <Typography className="share-action-subtitle">
            {shareStep === 1
              ? "Choose what kind of message you want to share. You'll pick the channel and edit the message next."
              : "Choose the channel and make the message your own."}
          </Typography>
        </Box>

        {shareStep === 1 ? (
          <ShareModeStep
            sharingModes={sharingModes}
            selectedModeId={selectedModeId}
            onSelectSharingMode={onSelectSharingMode}
            onChooseMode={(modeId) => {
              onSelectSharingMode(modeId);
              onShareStepChange(2);
            }}
          />
        ) : (
          <Box className="share-step-two">
            <Box className="sharing-mode-summary">
              <Box className="sharing-mode-summary-copy">
                <Typography className="sharing-mode-summary-label">
                  Sharing mode
                </Typography>
                <Typography className="sharing-mode-summary-title">
                  {selectedSharingMode.label}
                </Typography>
              </Box>
              <Stack direction="row" gap={0.75} className="sharing-mode-switcher">
                {sharingModes.map((mode) => (
                  <Button
                    key={mode.id}
                    type="button"
                    onClick={() => onSelectSharingMode(mode.id)}
                    className="sharing-mode-switch"
                    data-selected={mode.id === selectedModeId}
                  >
                    {mode.id === selectedModeId
                      ? mode.label
                      : `Switch to ${
                          mode.id === SHARING_MODE_IDS.askDirectly
                            ? "direct"
                            : "group/feed"
                        }`}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Typography className="share-step-label">Step 2 of 2</Typography>

            <Typography className="share-channel-label">
              Where are you sharing it?
            </Typography>
            <Box
              className="message-workspace two-step-message-workspace"
              ref={stepTwoMessageRef}
            >
              <Box className="share-to-row">{channelSelector}</Box>

              <Box className="message-tab-body">
                <Box className="message-editor-section">
                  <Box
                    className={`desktop-template-card${
                      shouldShareImage ? " desktop-template-card-with-image" : ""
                    }`}
                  >
                    <Box className="message-editor-wrap">
                      <Box className="message-title-strip">
                        <Typography className="desktop-post-title">
                          {messageTitle}
                        </Typography>
                        <Typography className="desktop-post-subtitle">
                          Prepared for {shareCard.platformLabel}
                        </Typography>
                      </Box>
                      <TextField
                        id="share-message"
                        value={editedText}
                        onChange={(event) => onEditedTextChange(event.target.value)}
                        multiline
                        minRows={5}
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
                            Attach this image in the send step if you want the
                            post to stand out.
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              className="step-two-actions"
            >
              <Button
                type="button"
                onClick={() => onShareStepChange(1)}
                className="share-back-link"
              >
                Back
              </Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handlePrimaryAction}
                className="primary-share-button"
              >
                {isMobile ? "Preview and share" : `Share on ${shareCard.platformLabel}`}
              </Button>
            </Stack>

            <Box className="share-bottom-tip">
              <InfoOutlinedIcon fontSize="small" />
              <Typography>{selectedSharingMode.tip}</Typography>
            </Box>
          </Box>
        )}
      </Box>

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

  if (isMobile) {
    return (
      <Box className="mobile-flow-shell">
        <MobileCampaignBrief campaign={campaign} />
        {composerCard}
      </Box>
    );
  }

  return composerCard;
}

function ShareModeStep({
  sharingModes,
  selectedModeId,
  onChooseMode,
}) {
  return (
    <>
      <Box className="share-step-divider" />
      <Typography className="share-step-label">Step 1 of 2</Typography>
      <Box className="sharing-mode-grid">
        {sharingModes.map((mode) => (
          <Button
            key={mode.id}
            type="button"
            onClick={() => onChooseMode(mode.id)}
            className="sharing-mode-card"
            data-selected={selectedModeId === mode.id}
          >
            {mode.recommended && (
              <Box component="span" className="sharing-mode-recommended">
                Recommended
              </Box>
            )}
            <Box className="sharing-mode-icon">
              {mode.id === SHARING_MODE_IDS.askDirectly ? (
                <ChatBubbleOutlineIcon fontSize="small" />
              ) : (
                <DynamicFeedOutlinedIcon fontSize="small" />
              )}
            </Box>
            <Typography className="sharing-mode-card-title">{mode.label}</Typography>
            <Typography className="sharing-mode-card-description">
              {mode.description}
            </Typography>
            <Box className="sharing-mode-examples">
              <Typography className="sharing-mode-examples-label">
                Examples
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {mode.examples.map((example) => (
                  <Box key={example} className="sharing-mode-example-pill">
                    {example}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Button>
        ))}
      </Box>
      <Box className="share-step-footer">
        <Stack direction="row" spacing={1} alignItems="center" className="share-change-note">
          <InfoOutlinedIcon fontSize="small" />
          <Typography>You can change this later.</Typography>
        </Stack>
      </Box>
    </>
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
  channelLabel,
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
    title: `Now open ${channelLabel}`,
    body: getMobileFinalInstruction({
      canOpenPreparedShare,
      copyFailed,
      needsManualImage: shouldShareImage,
      platformLabel: channelLabel,
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
                    <Typography>{channelLabel}</Typography>
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
                  Share on {channelLabel}
                </Typography>
                <Typography className="mobile-native-subtitle">
                  Finish inside {channelLabel}
                </Typography>
              </Box>
            </Box>
            <Stack spacing={1} className="mobile-share-instructions">
              <Typography>
                {shouldCopyText || shouldShareImage
                  ? `Getting your post ready for ${channelLabel}.`
                  : `Open ${channelLabel}, check it, then send.`}
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
                  Open {channelLabel}{hasOnlyOpenStep ? " now" : ""}
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
