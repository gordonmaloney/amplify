import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { boostGuidance, defaultCommentStarters } from "../config/boostGuidance";
import { SHARING_MODE_IDS } from "../config/shareModes";

const MODAL_STAGE = {
  prepare: "prepare",
  nextAction: "nextAction",
  boostContent: "boostContent",
};

export default function ShareFlowModal({
  open,
  onClose,
  shareCard,
  editedText,
  shareUrl,
  initialCopyStatus = "waiting",
  campaign,
  completedRoute,
  onChooseNextRoute,
}) {
  const [copyStatus, setCopyStatus] = useState("waiting");
  const [downloadStatus, setDownloadStatus] = useState("waiting");
  const [activeStep, setActiveStep] = useState(0);
  const [copyToastId, setCopyToastId] = useState(0);
  const [modalStage, setModalStage] = useState(MODAL_STAGE.prepare);
  const [copiedCommentIndex, setCopiedCommentIndex] = useState(null);
  const [boostPostOpened, setBoostPostOpened] = useState(false);
  const nextActionTimerRef = useRef(null);

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
  const nextAction = getNextAction({ completedRoute });
  const nextActionCopy = getNextActionCopy(nextAction);
  const boostContent = getBoostContent(campaign);
  const boostStage = getBoostStage(boostContent);
  const isBoostStage = modalStage === MODAL_STAGE.boostContent && boostStage;

  function clearNextActionTimer() {
    if (!nextActionTimerRef.current) return;
    window.clearTimeout(nextActionTimerRef.current);
    nextActionTimerRef.current = null;
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
    clearNextActionTimer();
    setModalStage(MODAL_STAGE.prepare);
    setCopiedCommentIndex(null);
    setBoostPostOpened(false);

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
      clearNextActionTimer();
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

  useEffect(() => {
    if (!open || !boostStage?.canEmbed) return;
    loadInstagramEmbedScript();
  }, [boostStage?.canEmbed, open]);

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

  function scheduleNextActionStage() {
    clearNextActionTimer();
    nextActionTimerRef.current = window.setTimeout(() => {
      setModalStage(getPostOpenModalStage({ campaign, completedRoute }));
      nextActionTimerRef.current = null;
    }, 2500);
  }

  function handleChooseNextAction() {
    if (nextAction) {
      onChooseNextRoute?.(nextAction);
    }

    onClose();
  }

  async function copyCommentStarter(comment, index) {
    const copied = await copyToClipboard(comment);
    if (copied) setCopiedCommentIndex(index);
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
          <PlatformIcon
            platform={isBoostStage ? boostStage.platform : shareCard.platform}
            fontSize="small"
          />
          <span>
            {isBoostStage
              ? "Boost original post"
              : `Send on ${shareCard.platformLabel}`}
          </span>
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
        <Box
          className={`share-flow-dialog-grid${
            isBoostStage ? " share-flow-dialog-grid-boost" : ""
          }`}
        >
          {isBoostStage ? (
            <BoostOriginalPostPreview
              boostStage={boostStage}
              onOpenOriginal={() => setBoostPostOpened(true)}
            />
          ) : (
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
          )}

          {isBoostStage ? (
            <Stack spacing={2.25} className="share-flow-steps-panel">
              <Box className="share-flow-boost-heading">
                <Typography className="share-flow-next-kicker">
                  Boost content
                </Typography>
                <Typography variant="h2" className="share-flow-next-title">
                  {boostStage.title}
                </Typography>
                <Typography className="share-flow-next-body">
                  {boostStage.description}
                </Typography>
              </Box>

              {boostPostOpened && (
                <Typography className="share-flow-boost-opened-note">
                  Once you've opened it, comment, share, save or send it to
                  someone who might care.
                </Typography>
              )}

              <Box className="share-flow-boost-section">
                <Typography className="share-flow-recovery-title">
                  What helps most
                </Typography>
                <Box component="ol" className="share-flow-boost-checklist">
                  {boostStage.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </Box>
                <Typography className="share-flow-boost-tip">
                  Real comments, shares, saves and DMs are more useful than
                  silent views.
                </Typography>
              </Box>

              <Box className="share-flow-boost-section">
                <Typography className="share-flow-recovery-title">
                  Comment starters
                </Typography>
                <Typography className="share-flow-boost-helper">
                  Pick one, then change a few words so it sounds like you.
                </Typography>
                <Stack spacing={0.75} className="share-flow-comment-starters">
                  {boostStage.commentStarters.map((comment, index) => (
                    <Box key={comment} className="share-flow-comment-starter">
                      <Typography>{comment}</Typography>
                      <Button
                        size="small"
                        onClick={() => copyCommentStarter(comment, index)}
                        className="share-flow-recovery-action"
                      >
                        {copiedCommentIndex === index ? "Copied" : "Copy"}
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
                className="share-flow-boost-actions"
              >
                <Button
                  type="button"
                  onClick={() => setModalStage(MODAL_STAGE.prepare)}
                  className="share-flow-secondary-action"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  href={boostStage.url}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  startIcon={<OpenInNewIcon />}
                  onClick={() => setBoostPostOpened(true)}
                  className="share-flow-action share-flow-primary-action"
                >
                  Open original post
                </Button>
              </Stack>
            </Stack>
          ) : modalStage === MODAL_STAGE.nextAction ? (
            <Stack spacing={2.25} className="share-flow-steps-panel">
              <Box className="share-flow-next-action">
                <Typography className="share-flow-next-kicker">
                  Next action
                </Typography>
                <Typography variant="h2" className="share-flow-next-title">
                  {nextActionCopy.title}
                </Typography>
                <Typography className="share-flow-next-body">
                  {nextActionCopy.body}
                </Typography>
                {nextActionCopy.primaryLabel && (
                  <Button
                    variant="contained"
                    startIcon={
                      nextAction === "boost_post" ? (
                        <OpenInNewIcon />
                      ) : undefined
                    }
                    onClick={handleChooseNextAction}
                    className="share-flow-action share-flow-primary-action"
                  >
                    {nextActionCopy.primaryLabel}
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={onClose}
                  className="share-flow-done-link"
                >
                  I'm done for now
                </Button>
              </Box>

              <Box className="share-flow-recovery">
                <Typography className="share-flow-recovery-title">
                  Something went wrong?
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={copyAgain}
                    className="share-flow-recovery-action"
                  >
                    Copy text again
                  </Button>
                  {needsManualImage && (
                    <Button
                      size="small"
                      startIcon={<FileDownloadIcon />}
                      onClick={downloadAgain}
                      className="share-flow-recovery-action"
                    >
                      Download image again
                    </Button>
                  )}
                  {(preparedShareUrl || platformUrl) && (
                    <Button
                      size="small"
                      startIcon={<OpenInNewIcon />}
                      component={Link}
                      href={preparedShareUrl || platformUrl}
                      target="_blank"
                      rel="noopener"
                      underline="none"
                      className="share-flow-recovery-action"
                    >
                      Open {shareCard.platformLabel} again
                    </Button>
                  )}
                  <Button
                    size="small"
                    onClick={onClose}
                    className="share-flow-recovery-action"
                  >
                    Go back and edit
                  </Button>
                </Stack>
              </Box>
            </Stack>
          ) : (
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
                    onClick={scheduleNextActionStage}
                    className="share-flow-action share-flow-primary-action"
                  >
                    Open {shareCard.platformLabel}
                    {hasOnlyOpenStep ? " now" : ""}
                  </Button>
                )}
                <PlatformTip platform={shareCard.platform} />
              </Stack>
            </Stack>
          )}
        </Box>
      </DialogContent>
      {modalStage === MODAL_STAGE.prepare && (
        <DialogActions>
          <Button onClick={onClose}>Done</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

function BoostOriginalPostPreview({ boostStage, onOpenOriginal }) {
  const [embedStatus, setEmbedStatus] = useState(
    boostStage.canEmbed ? "pending" : "fallback"
  );
  const showFallbackCard = embedStatus === "fallback";
  const showEmbedLoading = embedStatus === "pending";
  const handleEmbedReady = useCallback(() => setEmbedStatus("ready"), []);
  const handleEmbedFallback = useCallback(() => setEmbedStatus("fallback"), []);

  useEffect(() => {
    setEmbedStatus(boostStage.canEmbed ? "pending" : "fallback");
  }, [boostStage.canEmbed, boostStage.url]);

  return (
    <Box className="share-flow-preview-panel share-flow-original-post-panel">
      <Stack spacing={1.5}>
        <Box className="share-flow-preview-header">
          <Typography className="share-flow-preview-title">
            Original post
          </Typography>
          <Typography className="share-flow-preview-meta">
            Open this after you finish your share
          </Typography>
        </Box>

        {boostStage.canEmbed && (
          <InstagramPostEmbed
            url={boostStage.url}
            onReady={handleEmbedReady}
            onFallback={handleEmbedFallback}
          />
        )}

        {showEmbedLoading && (
          <Box className="share-flow-embed-loading" aria-live="polite">
            <Box className="share-flow-embed-loading-icon">
              <PlatformIcon platform={boostStage.platform} fontSize="small" />
            </Box>
            <Typography>Loading original post...</Typography>
          </Box>
        )}

        {showFallbackCard && (
          <Box className="share-flow-original-post-card">
            <Box className="share-flow-original-post-icon">
              <PlatformIcon platform={boostStage.platform} fontSize="small" />
            </Box>
            <Stack spacing={1.25} className="share-flow-original-post-copy">
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={0.75}
                className="share-flow-boost-meta-row"
              >
                <Box component="span">{boostStage.platformLabel}</Box>
                <Box component="span">{boostStage.contentTypeLabel}</Box>
              </Stack>
              <Typography className="share-flow-original-post-title">
                {boostStage.title}
              </Typography>
              <Typography className="share-flow-boost-url">
                {boostStage.url}
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href={boostStage.url}
                target="_blank"
                rel="noopener"
                underline="none"
                onClick={onOpenOriginal}
                startIcon={<OpenInNewIcon />}
                className="share-flow-action share-flow-primary-action"
              >
                Open original post
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

function InstagramPostEmbed({ url, onReady, onFallback }) {
  useEffect(() => {
    if (!url) return undefined;

    let cancelled = false;
    let fallbackTimer;
    let pollTimer;

    function markReadyWhenIframeAppears() {
      const iframe = document.querySelector(
        `.share-flow-instagram-embed-wrap iframe[src*="instagram"]`
      );
      if (iframe) {
        onReady();
        return true;
      }
      return false;
    }

    async function processEmbed() {
      if (cancelled) return;
      await loadInstagramEmbedScript();
      if (cancelled) return;
      window.instgrm?.Embeds?.process?.();
      pollTimer = window.setInterval(() => {
        if (cancelled || markReadyWhenIframeAppears()) {
          window.clearInterval(pollTimer);
        }
      }, 200);
      fallbackTimer = window.setTimeout(() => {
        if (cancelled) return;
        window.clearInterval(pollTimer);
        if (!markReadyWhenIframeAppears()) {
          onFallback();
        }
      }, 3500);
    }

    processEmbed();

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      window.clearInterval(pollTimer);
    };
  }, [onFallback, onReady, url]);

  return (
    <Box className="share-flow-instagram-embed-wrap">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
      >
        <a href={url} target="_blank" rel="noreferrer">
          View this post on Instagram
        </a>
      </blockquote>
    </Box>
  );
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getPostOpenModalStage({ campaign }) {
  if (campaign?.boostContent?.enabled && campaign?.boostContent?.url) {
    return MODAL_STAGE.boostContent;
  }

  return MODAL_STAGE.nextAction;
}

function getNextAction({ completedRoute }) {
  if (completedRoute === SHARING_MODE_IDS.askDirectly) {
    return SHARING_MODE_IDS.groupOrFeed;
  }

  if (completedRoute === SHARING_MODE_IDS.groupOrFeed) {
    return SHARING_MODE_IDS.askDirectly;
  }

  return null;
}

function getNextActionCopy(nextAction) {
  switch (nextAction) {
    case SHARING_MODE_IDS.groupOrFeed:
      return {
        title: "Next: share it to a group or feed",
        body:
          "Once you've sent your message, help the campaign travel further by sharing it somewhere more people might see it.",
        primaryLabel: "Share to a group or feed",
      };
    case SHARING_MODE_IDS.askDirectly:
      return {
        title: "Next: ask someone directly",
        body:
          "Once you've posted it, the most useful next step is to send it to one person who might care.\n\nPersonal asks often work better because they come from someone the person already trusts.",
        primaryLabel: "Ask someone directly",
      };
    default:
      return {
        title: "You're done for now",
        body: "Thanks for helping this campaign travel further.",
        primaryLabel: "",
      };
  }
}

function getBoostContent(campaign) {
  if (!campaign?.boostContent?.enabled || !campaign?.boostContent?.url) {
    return null;
  }

  return campaign.boostContent;
}

function getBoostStage(boostContent) {
  if (!boostContent) return null;

  const platform = normaliseBoostPlatform(boostContent.platform);
  const contentType = normaliseBoostContentType(boostContent.contentType);
  const guidance =
    boostGuidance[platform]?.[contentType] ||
    boostGuidance[platform]?.post ||
    boostGuidance.generic.post;

  const commentStarters =
    Array.isArray(boostContent.commentStarters) &&
    boostContent.commentStarters.length > 0
      ? boostContent.commentStarters
      : getDefaultBoostCommentStarters();

  return {
    platform,
    canEmbed: platform === "instagram" && isInstagramPostUrl(boostContent.url),
    title: boostContent.title || guidance.title || "Boost the original post",
    description:
      boostContent.description ||
      "Help the original post travel further. Real comments and shares from real people can help more people see it.",
    platformLabel: getBoostPlatformLabel(platform),
    contentTypeLabel: toTitleCase(contentType),
    url: boostContent.url,
    actions:
      Array.isArray(boostContent.actions) && boostContent.actions.length > 0
        ? boostContent.actions
        : guidance.actions,
    tip: guidance.tip,
    commentPrompt:
      guidance.commentPrompt ||
      "Pick one, then change a few words so it sounds like you.",
    commentStarters,
  };
}

function isInstagramPostUrl(url = "") {
  return /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\//i.test(url);
}

function loadInstagramEmbedScript() {
  if (window.instgrm?.Embeds) {
    return Promise.resolve();
  }

  const existingScript = document.querySelector(
    'script[src="//www.instagram.com/embed.js"], script[src="https://www.instagram.com/embed.js"]'
  );

  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener("load", resolve, { once: true });
      window.setTimeout(resolve, 1000);
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = resolve;
    script.onerror = resolve;
    document.body.appendChild(script);
  });
}

function normaliseBoostPlatform(platform = "") {
  const value = platform.toLowerCase();
  if (value === "twitter") return "x";
  return boostGuidance[value] ? value : "generic";
}

function normaliseBoostContentType(contentType = "") {
  return contentType.toLowerCase() || "post";
}

function getBoostPlatformLabel(platform) {
  const labels = {
    instagram: "Instagram",
    facebook: "Facebook",
    x: "X",
    bluesky: "Bluesky",
    tiktok: "TikTok",
    generic: "Original platform",
  };

  return labels[platform] || toTitleCase(platform);
}

function toTitleCase(value = "") {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getDefaultBoostCommentStarters() {
  return [
    defaultCommentStarters.supportive,
    defaultCommentStarters.political,
    defaultCommentStarters.personal,
    "If you rent, this is worth reading and sharing.",
  ];
}
