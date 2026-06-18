import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link as RouterLink, useParams } from "react-router-dom";
import ShareCardSelector from "../components/ShareCardSelector";
import ShareComposer from "../components/ShareComposer";
import {
  getCardsForSharingMode,
  getDefaultSharingModeId,
  getSharingMode,
  sharingModes,
} from "../config/shareModes";
import { getCampaignBySlug } from "../data/campaigns";

export default function CampaignPage() {
  const { campaignSlug } = useParams();
  const campaign = getCampaignBySlug(campaignSlug);
  const [selectedCardId, setSelectedCardId] = useState(
    campaign?.shareCards[0]?.id || ""
  );
  const [selectedSharingModeId, setSelectedSharingModeId] = useState(
    getDefaultSharingModeId()
  );
  const [shareStep, setShareStep] = useState(1);
  const isMobileFlow = useMediaQuery("(max-width:700px)");
  const [mobileStep, setMobileStep] = useState(0);

  const initialEditedText = useMemo(() => {
    if (!campaign) return {};
    return Object.fromEntries(
      campaign.shareCards.map((card) => [card.id, card.defaultText])
    );
  }, [campaign]);

  const [editedTextByCard, setEditedTextByCard] = useState(initialEditedText);

  useEffect(() => {
    if (!campaign) return;
    const defaultModeId = getDefaultSharingModeId();
    const modeCards = getCardsForSharingMode(campaign.shareCards, defaultModeId);
    setSelectedSharingModeId(defaultModeId);
    setSelectedCardId(modeCards[0]?.id || campaign.shareCards[0]?.id || "");
    setShareStep(1);
    setEditedTextByCard(initialEditedText);
    setMobileStep(0);
  }, [campaign, initialEditedText]);

  if (!campaign) {
    return (
      <Container maxWidth="md" className="page-shell">
        <Paper variant="outlined" className="empty-state">
          <Stack spacing={2}>
            <Chip label="Campaign not found" />
            <Typography variant="h1">We could not find that campaign.</Typography>
            <Typography color="text.secondary">
              Check the link, or return to the Amplify homepage to choose an
              active campaign.
            </Typography>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<ArrowBackIcon />}
              sx={{ alignSelf: "flex-start" }}
            >
              Back to homepage
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const selectedSharingMode = getSharingMode(selectedSharingModeId);
  const modeCards = getCardsForSharingMode(
    campaign.shareCards,
    selectedSharingMode.id
  );
  const selectedCard =
    modeCards.find((card) => card.id === selectedCardId) ||
    modeCards[0] ||
    campaign.shareCards[0];
  const editedText =
    editedTextByCard[selectedCard.id] ?? selectedCard.defaultText;

  function updateSharingMode(modeId) {
    const nextMode = getSharingMode(modeId);
    const nextModeCards = getCardsForSharingMode(campaign.shareCards, nextMode.id);
    setSelectedSharingModeId(nextMode.id);
    if (!nextModeCards.some((card) => card.id === selectedCardId)) {
      setSelectedCardId(nextModeCards[0]?.id || campaign.shareCards[0]?.id || "");
    }
  }

  function updateEditedText(value) {
    setEditedTextByCard((current) => ({
      ...current,
      [selectedCard.id]: value,
    }));
  }

  return (
    <Container maxWidth="xl" className="page-shell campaign-task-page">
      {isMobileFlow ? (
        <ShareComposer
          shareCard={selectedCard}
          editedText={editedText}
          onEditedTextChange={updateEditedText}
          campaign={campaign}
          sharingModes={sharingModes}
          selectedSharingMode={selectedSharingMode}
          onSelectSharingMode={updateSharingMode}
          shareStep={shareStep}
          onShareStepChange={setShareStep}
          mobileStep={mobileStep}
          onMobileStepChange={setMobileStep}
          channelSelector={
            <ShareCardSelector
              shareCards={modeCards}
              selectedId={selectedCard.id}
              onSelect={setSelectedCardId}
            />
          }
        />
      ) : (
        <Box className="campaign-desktop-layout">
          <CampaignContextAside campaign={campaign} />
          <ShareComposer
            shareCard={selectedCard}
            editedText={editedText}
            onEditedTextChange={updateEditedText}
            sharingModes={sharingModes}
            selectedSharingMode={selectedSharingMode}
            onSelectSharingMode={updateSharingMode}
            shareStep={shareStep}
            onShareStepChange={setShareStep}
            channelSelector={
              <ShareCardSelector
                shareCards={modeCards}
                selectedId={selectedCard.id}
                onSelect={setSelectedCardId}
              />
            }
          />
        </Box>
      )}
    </Container>
  );
}

function CampaignContextAside({ campaign }) {
  return (
    <Paper variant="outlined" className="campaign-context-aside">
      {campaign.imageUrl ? (
        <Box
          component="img"
          src={campaign.imageUrl}
          alt=""
          className="campaign-aside-image"
        />
      ) : (
        <Box className="campaign-aside-image campaign-image-placeholder">
          <Typography>No image</Typography>
        </Box>
      )}

      <Stack spacing={1.25} className="campaign-aside-copy">
        <Typography className="campaign-aside-meta">
          {campaign.eyebrow}
        </Typography>
        <Typography variant="h2" className="campaign-aside-title">
          {campaign.title}
        </Typography>
        <Typography className="campaign-aside-organiser">
          Organised by {campaign.organiserName}
        </Typography>
        <Typography className="campaign-aside-description">
          {campaign.description}
        </Typography>
      </Stack>

      {campaign.primaryUrl && (
        <Button
          component="a"
          href={campaign.primaryUrl}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          endIcon={<OpenInNewIcon />}
          className="campaign-aside-link"
        >
          Learn more about this campaign
        </Button>
      )}
    </Paper>
  );
}
