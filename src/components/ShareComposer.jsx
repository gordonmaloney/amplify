import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
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
import { getRoutePlatformLabel, SHARE_ROUTE_IDS } from "../config/shareRoutes";
import { copyToClipboard } from "../utils/clipboard";
import { downloadImage } from "../utils/downloads";
import { buildShareUrl, platformHomeUrl } from "../utils/shareLinks";

const directSuggestions = [
  "someone who rents",
  "someone who came before",
  "someone in your branch",
  "someone affected by this",
  "someone who would come if asked",
];

const audienceSuggestions = [
  "someone who rents",
  "someone who came before",
  "someone in your branch",
  "someone affected by this",
  "someone who would come if asked",
];

const directCoachChips = [
  { label: "I thought of you because...", text: "I thought of you because..." },
  {
    label: "This made me think of you because...",
    text: "This made me think of you because...",
  },
  { label: "Could you take one minute to...", text: "Could you take one minute to..." },
  { label: "No pressure, but...", text: "No pressure, but..." },
];

const wideCoachChips = [
  { label: "Sharing this here because...", text: "Sharing this here because..." },
  {
    label: "This is especially relevant locally because...",
    text: "This is especially relevant locally because...",
  },
  {
    label: "The most useful thing you can do is...",
    text: "The most useful thing you can do is...",
  },
  { label: "If you rent, please...", text: "If you rent, please..." },
];

export default function ShareComposer({
  shareCard,
  editedText,
  onEditedTextChange,
  shareRoute,
  routeSelector,
  channelSelector,
  campaign,
  mobileStep,
  onMobileStepChange,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialCopyStatus, setInitialCopyStatus] = useState("waiting");
  const [directTargets, setDirectTargets] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [selectedRelationalChip, setSelectedRelationalChip] = useState("");
  const [relationalInput, setRelationalInput] = useState("");
  const [templateFields, setTemplateFields] = useState({
    why: "",
    area: "",
    ask: "",
    deadline: "",
  });
  const editorInputRef = useRef(null);
  const isDirectRoute = shareRoute?.id === SHARE_ROUTE_IDS.direct;
  const relationalChips = isDirectRoute ? directTargets : audiences;
  const coachChips = isDirectRoute ? directCoachChips : wideCoachChips;
  const routeHeading = getRouteHeading(shareRoute?.id);
  const coachText = isDirectRoute
    ? "Use their name. Say why you thought of them. Make one clear ask."
    : "Say why you're posting it here. Add a local, branch or audience-specific line.";
  const messageForSharing = prepareMessageForSharing(editedText, {
    routeId: shareRoute?.id,
    selectedRelationalChip,
    templateFields,
    link: shareCard.urlToShare || campaign?.primaryUrl || "",
  });

  const shareUrl = buildShareUrl(shareCard, messageForSharing);
  const characterCount = messageForSharing.length;
  const characterLimit = getCharacterLimit(shareCard.platform);
  const shouldShareImage = Boolean(shareCard.imageUrl && shareCard.requiresImage);
  const channelLabel = getRoutePlatformLabel(shareCard, shareRoute?.id);
  const messageLabel = getMessageLabel(shareCard.platform, shareRoute?.id);
  const readinessItems = getReadinessItems({
    editedText,
    defaultText: shareCard.defaultText,
    isDirectRoute,
    messageForSharing,
    selectedRelationalChip,
    shareCard,
  });

  useEffect(() => {
    setSelectedRelationalChip("");
    setRelationalInput("");
  }, [shareRoute?.id, shareCard.id]);

  async function handlePrimaryShare() {
    const shouldPrepareClipboard = !shareUrl || shouldShareImage;
    if (shouldPrepareClipboard) {
      setInitialCopyStatus("running");
      const copied = await copyToClipboard(messageForSharing);
      setInitialCopyStatus(copied ? "done" : "failed");
    } else {
      setInitialCopyStatus("skipped");
    }
    setModalOpen(true);
  }

  function addRelationalChip(label) {
    const normalizedLabel = label.trim();
    if (!normalizedLabel) return;

    const updateChips = (currentChips) =>
      currentChips.includes(normalizedLabel)
        ? currentChips
        : [...currentChips, normalizedLabel];

    if (isDirectRoute) {
      setDirectTargets(updateChips);
    } else {
      setAudiences(updateChips);
    }
    setSelectedRelationalChip(normalizedLabel);
    setRelationalInput("");
  }

  function insertStarterText(text) {
    const textArea = editorInputRef.current;
    const hasSelection =
      textArea &&
      typeof textArea.selectionStart === "number" &&
      typeof textArea.selectionEnd === "number";
    const insertion = text;

    if (!hasSelection) {
      const separator = editedText.trim() ? "\n\n" : "";
      onEditedTextChange(`${editedText}${separator}${insertion}`);
      return;
    }

    const { selectionStart, selectionEnd } = textArea;
    const needsLeadingSpace =
      selectionStart > 0 && !/[\s\n]$/.test(editedText.slice(0, selectionStart));
    const needsTrailingSpace =
      selectionEnd < editedText.length &&
      !/^[\s\n]/.test(editedText.slice(selectionEnd));
    const insertedText = `${needsLeadingSpace ? " " : ""}${insertion}${
      needsTrailingSpace ? " " : ""
    }`;
    const nextText = `${editedText.slice(0, selectionStart)}${insertedText}${editedText.slice(
      selectionEnd
    )}`;
    const nextCursor = selectionStart + insertedText.length;
    onEditedTextChange(nextText);
    window.requestAnimationFrame(() => {
      textArea.focus();
      textArea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  const relationalPrompt = shareRoute && (
    <RelationalPrompt
      isDirectRoute={isDirectRoute}
      chips={relationalChips}
      suggestions={isDirectRoute ? directSuggestions : audienceSuggestions}
      selectedChip={selectedRelationalChip}
      inputValue={relationalInput}
      onInputChange={setRelationalInput}
      onAddChip={addRelationalChip}
      onSelectChip={setSelectedRelationalChip}
    />
  );

  const coach = shareRoute && (
    <PersonalisationCoach
      helperText={coachText}
      isDirectRoute={isDirectRoute}
      coachChips={coachChips}
      onInsert={insertStarterText}
    />
  );

  const tokenFields = (
    <TemplateTokenFields
      message={editedText}
      values={templateFields}
      onChange={setTemplateFields}
    />
  );

  if (campaign && typeof mobileStep === "number") {
    return (
      <MobileShareFlow
        campaign={campaign}
        shareCard={shareCard}
        editedText={editedText}
        onEditedTextChange={onEditedTextChange}
        shareRoute={shareRoute}
        routeSelector={routeSelector}
        channelSelector={channelSelector}
        mobileStep={mobileStep}
        onMobileStepChange={onMobileStepChange}
        shareUrl={shareUrl}
        channelLabel={channelLabel}
        messageForSharing={messageForSharing}
        relationalPrompt={relationalPrompt}
        coach={coach}
        tokenFields={tokenFields}
        editorInputRef={editorInputRef}
        characterCount={characterCount}
        characterLimit={characterLimit}
        shouldShareImage={shouldShareImage}
        messageLabel={messageLabel}
        readinessItems={readinessItems}
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

      {routeSelector && (
        <Box className="route-selection-section">
          <Typography className="route-selection-label">
            How do you want to share?
          </Typography>
          {routeSelector}
        </Box>
      )}

      {routeHeading && (
        <Box className="route-context-heading">
          <Typography className="route-context-title">{routeHeading.title}</Typography>
          <Typography className="route-context-subtitle">
            {routeHeading.subtitle}
          </Typography>
        </Box>
      )}

      <Box className="message-workspace">
        <Box className="share-step-heading">
          <Typography className="share-step-title">Choose where to share</Typography>
        </Box>
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
                  {messageLabel}
                </Typography>
                <Typography className="desktop-post-subtitle">
                  Prepared for {channelLabel}
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
            {relationalPrompt}
            <Typography component="label" htmlFor="share-message" className="message-editor-label">
              3. {messageLabel}
            </Typography>
            {shareRoute?.editorNote && (
              <Stack
                direction="row"
                spacing={1}
                className="route-editor-note"
              >
                <InfoOutlinedIcon fontSize="small" />
                <Typography>{shareRoute.editorNote}</Typography>
              </Stack>
            )}
            {tokenFields}

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
                  minRows={4}
                  maxRows={10}
                  fullWidth
                  inputRef={editorInputRef}
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
            {selectedRelationalChip && messageForSharing !== editedText && (
              <Box className="personalised-preview">
                <Typography className="personalised-preview-title">
                  Personalised preview
                </Typography>
                <Typography>{messageForSharing}</Typography>
              </Box>
            )}
            {coach}

            <ReadinessStatus
              isDirectRoute={isDirectRoute}
              items={readinessItems}
              unchangedFromDefault={isUnchangedFromDefault(
                editedText,
                shareCard.defaultText
              )}
            />

            <Stack direction="row" flexWrap="wrap" gap={2} className="share-action-buttons">
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handlePrimaryShare}
                className="primary-share-button"
              >
                Share on {channelLabel}
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
        editedText={messageForSharing}
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
  shareRoute,
  routeSelector,
  channelSelector,
  mobileStep,
  onMobileStepChange,
  shareUrl,
  channelLabel,
  messageForSharing,
  relationalPrompt,
  coach,
  tokenFields,
  editorInputRef,
  characterCount,
  characterLimit,
  shouldShareImage,
  messageLabel,
  readinessItems,
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
  const routeHeading = getRouteHeading(shareRoute?.id);

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
        const copied = await copyToClipboard(messageForSharing);
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
    messageForSharing,
    mobileStep,
    shareCard.imageUrl,
    shouldCopyText,
    shouldShareImage,
  ]);

  async function copyAgain() {
    const copied = await copyToClipboard(messageForSharing);
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
              {routeSelector && (
                <Box className="mobile-route-section">
                  <Typography className="mobile-section-label">
                    How do you want to share?
                  </Typography>
                  {routeSelector}
                </Box>
              )}
              {routeHeading && (
                <Box className="route-context-heading mobile-route-context-heading">
                  <Typography className="route-context-title">
                    {routeHeading.title}
                  </Typography>
                  <Typography className="route-context-subtitle">
                    {routeHeading.subtitle}
                  </Typography>
                </Box>
              )}
              <Box className="mobile-channel-strip">{channelSelector}</Box>
              {relationalPrompt}
              <Typography component="label" className="message-editor-label">
                3. {messageLabel}
              </Typography>
              <Box className="mobile-native-composer">
                <TextField
                  value={editedText}
                  onChange={(event) => onEditedTextChange(event.target.value)}
                  multiline
                  minRows={5}
                  maxRows={9}
                  fullWidth
                  inputRef={editorInputRef}
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
              {tokenFields}
              {messageForSharing !== editedText && (
                <Box className="personalised-preview mobile-personalised-preview">
                  <Typography className="personalised-preview-title">
                    Personalised preview
                  </Typography>
                  <Typography>{messageForSharing}</Typography>
                </Box>
              )}
              {coach}
              <ReadinessStatus
                isDirectRoute={shareRoute?.id === SHARE_ROUTE_IDS.direct}
                items={readinessItems}
                unchangedFromDefault={isUnchangedFromDefault(
                  editedText,
                  shareCard.defaultText
                )}
              />
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
              <PlatformPreviewFrame shareCard={shareCard} message={messageForSharing} />
            </Box>
            {copyFailed && (
              <TextField
                label="Text to copy"
                value={messageForSharing}
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

function getRouteHeading(routeId) {
  if (routeId === SHARE_ROUTE_IDS.direct) {
    return {
      title: "Ask someone directly",
      subtitle:
        "Pick someone who might care, then send them a message that sounds like you.",
    };
  }

  if (routeId === SHARE_ROUTE_IDS.wide) {
    return {
      title: "Promote in a group or feed",
      subtitle:
        "Share this somewhere relevant, with one line explaining why this audience should care.",
    };
  }

  return null;
}

function getMessageLabel(platform, routeId) {
  if (routeId === SHARE_ROUTE_IDS.direct) {
    if (platform === "whatsapp") return "Your personal ask";
    if (platform === "sms") return "Your text message";
    return "Your message";
  }

  if (platform === "whatsapp" || platform === "signal" || platform === "telegram") {
    return "Your group message";
  }
  if (platform === "facebook") return "Your Facebook post";
  if (platform === "instagram") return "Your caption";
  if (platform === "tiktok") return "Your caption or video prompt";

  return "Your message";
}

function getReadinessItems({
  editedText,
  defaultText,
  isDirectRoute,
  messageForSharing,
  selectedRelationalChip,
  shareCard,
}) {
  const trimmedMessage = messageForSharing.trim();
  const hasLink = Boolean(
    shareCard.urlToShare &&
      (trimmedMessage.includes(shareCard.urlToShare) ||
        shareCard.shareMode === "direct")
  );
  const hasPersonalLine =
    Boolean(selectedRelationalChip) ||
    editedText.split(/\n+/).some((line) => {
      const normalizedLine = line.trim().toLowerCase();
      return (
        normalizedLine.startsWith("i thought") ||
        normalizedLine.startsWith("this made me think") ||
        normalizedLine.startsWith("no pressure") ||
        normalizedLine.startsWith("sharing this here") ||
        normalizedLine.includes("because")
      );
    });
  const unchangedFromDefault = isUnchangedFromDefault(editedText, defaultText);

  if (isDirectRoute) {
    return [
      { label: "Clear ask", complete: hasClearAsk(trimmedMessage) },
      {
        label: "Link included, if applicable",
        complete: !shareCard.urlToShare || hasLink,
      },
      {
        label: "Personal line added, if applicable",
        complete: hasPersonalLine || !selectedRelationalChip,
      },
    ];
  }

  return [
    { label: "Clear ask", complete: hasClearAsk(trimmedMessage) },
    { label: "Link handled for this channel", complete: !shareCard.urlToShare || hasLink },
    { label: "Audience context added", complete: hasPersonalLine },
    { label: "Not just the untouched default, if applicable", complete: !unchangedFromDefault },
  ];
}

function ReadinessStatus({ isDirectRoute, items, unchangedFromDefault }) {
  return (
    <Box className="message-readiness">
      <Stack direction="row" flexWrap="wrap" gap={0.75} className="readiness-chip-row">
        {items.map((item) => (
          <Box
            key={item.label}
            className="readiness-chip"
            data-complete={item.complete}
          >
            <span aria-hidden="true" />
            <Typography>{item.label}</Typography>
          </Box>
        ))}
      </Stack>
      {!isDirectRoute && unchangedFromDefault && (
        <Typography className="readiness-nudge">
          Group and public posts work better when they sound like a real person.
          Add one line if you can.
        </Typography>
      )}
    </Box>
  );
}

function RelationalPrompt({
  isDirectRoute,
  chips,
  suggestions,
  selectedChip,
  inputValue,
  onInputChange,
  onAddChip,
  onSelectChip,
}) {
  const title = isDirectRoute
    ? "1. Who are you asking?"
    : "1. Who is this for?";
  const placeholder = isDirectRoute
    ? "Add a name or reminder, e.g. Aisha, Mum, Ben from work"
    : "Add an audience, e.g. branch WhatsApp group, local tenants' group";
  const helpText = isDirectRoute
    ? "These names stay on this device and are not saved."
    : "This is just to help you shape the message. It is not saved.";
  const secondaryPrompt = isDirectRoute
    ? "Need ideas? Think of someone who rents, someone in your branch, or someone who would come if personally invited."
    : "";

  function handleSubmit(event) {
    event.preventDefault();
    onAddChip(inputValue);
  }

  return (
    <Box className="relational-prompt">
      <Typography className="relational-prompt-title">{title}</Typography>
      <Box component="form" className="relational-chip-form" onSubmit={handleSubmit}>
        <TextField
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder={placeholder}
          size="small"
          fullWidth
          inputProps={{ "aria-label": title }}
          className="relational-chip-input"
        />
        <Button type="submit" variant="outlined" className="relational-add-button">
          Add
        </Button>
      </Box>
      <ChipRow
        chips={[...chips, ...suggestions.filter((chip) => !chips.includes(chip))]}
        selectedChip={selectedChip}
        onSelectChip={(chip) => {
          if (!chips.includes(chip)) onAddChip(chip);
          else onSelectChip(chip);
        }}
      />
      <Typography className="relational-privacy-note">{helpText}</Typography>
      {secondaryPrompt && (
        <Typography className="relational-secondary-prompt">
          {secondaryPrompt}
        </Typography>
      )}
    </Box>
  );
}

function ChipRow({ chips, selectedChip, onSelectChip }) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={0.75} className="prompt-chip-row">
      {chips.map((chip) => (
        <Chip
          key={chip}
          label={chip}
          size="small"
          onClick={() => onSelectChip(chip)}
          className="prompt-chip"
          data-selected={selectedChip === chip}
        />
      ))}
    </Stack>
  );
}

function PersonalisationCoach({ helperText, isDirectRoute, coachChips, onInsert }) {
  return (
    <Box className="personalisation-coach">
      <Typography className="personalisation-coach-title">
        {isDirectRoute ? "2. Make the message personal" : "2. Make it relevant"}
      </Typography>
      <Typography className="personalisation-coach-text">{helperText}</Typography>
      <Stack direction="row" flexWrap="wrap" gap={0.75} className="coach-chip-row">
        {coachChips.map((chip) => (
          <Chip
            key={chip.label}
            label={chip.label}
            size="small"
            onClick={() => onInsert(chip.text)}
            className="coach-chip"
          />
        ))}
      </Stack>
    </Box>
  );
}

function TemplateTokenFields({ message, values, onChange }) {
  const fields = [
    { token: "why", label: "Why this matters" },
    { token: "area", label: "Local detail" },
    { token: "ask", label: "Clear ask" },
    { token: "deadline", label: "Deadline" },
  ].filter((field) => message.includes(`{${field.token}}`));

  if (!fields.length) return null;

  return (
    <Box className="template-token-fields">
      {fields.map((field) => (
        <TextField
          key={field.token}
          value={values[field.token]}
          label={field.label}
          size="small"
          fullWidth
          onChange={(event) =>
            onChange((currentValues) => ({
              ...currentValues,
              [field.token]: event.target.value,
            }))
          }
        />
      ))}
    </Box>
  );
}

function prepareMessageForSharing(
  message,
  { routeId, selectedRelationalChip, templateFields, link }
) {
  let nextMessage = message
    .replaceAll("{name}", selectedRelationalChip || "")
    .replaceAll("{why}", templateFields.why || "")
    .replaceAll("{area}", templateFields.area || "")
    .replaceAll("{ask}", templateFields.ask || "")
    .replaceAll("{deadline}", templateFields.deadline || "")
    .replaceAll("{link}", link || "");

  if (
    routeId === SHARE_ROUTE_IDS.direct &&
    selectedRelationalChip &&
    !message.includes("{name}") &&
    !startsWithGreeting(nextMessage, selectedRelationalChip)
  ) {
    nextMessage = `Hi ${selectedRelationalChip}, ${lowercaseFirstLetter(nextMessage)}`;
  }

  return nextMessage;
}

function startsWithGreeting(message, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^(hi|hey|hello)\\s+${escapedName}\\b`, "i").test(
    message.trim()
  );
}

function lowercaseFirstLetter(text) {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function getCharacterLimit(platform) {
  if (platform === "twitter" || platform === "x") return 280;
  if (platform === "bluesky") return 300;
  return null;
}

function hasClearAsk(message) {
  return /\b(can you|please|share|send|sign|email|join|come|read|take|ask|help|do it|post|tell)\b/i.test(
    message
  );
}

function isUnchangedFromDefault(message, defaultText) {
  return message.trim() === defaultText.trim();
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
