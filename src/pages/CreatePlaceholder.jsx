import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import LoginIcon from "@mui/icons-material/Login";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link as RouterLink } from "react-router-dom";
import PlatformIcon from "../components/PlatformIcon";
import PlatformPreviewFrame from "../components/PlatformPreviewFrame";
import { useCampaignStore } from "../context/useCampaignStore";
import {
  getCardsForSharingMode,
  SHARING_MODE_IDS,
} from "../config/shareModes";

const DEFAULT_URL = "https://tenantact.org";
const DIRECT_PLATFORMS = ["whatsapp", "signal", "sms"];
const GROUP_PLATFORMS = ["whatsapp", "facebook", "instagram", "tiktok", "twitter", "bluesky"];
const ALL_TEMPLATE_PLATFORMS = [
  "whatsapp",
  "signal",
  "sms",
  "facebook",
  "instagram",
  "tiktok",
  "twitter",
  "bluesky",
];

const PLATFORM_LABELS = {
  whatsapp: "WhatsApp",
  signal: "Signal",
  sms: "SMS",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "X",
  bluesky: "Bluesky",
};

const CAMPAIGN_TYPES = [
  { value: "drive-action", label: "Drive action" },
  { value: "mobilise-people", label: "Mobilise people" },
  { value: "amplify-story", label: "Amplify a story" },
];

export default function CreatePlaceholder() {
  const { campaigns, createCampaign, updateCampaign, deleteCampaign } =
    useCampaignStore();
  const [organiser, setOrganiser] = useState(null);
  const [loginForm, setLoginForm] = useState({ name: "", email: "" });
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [selectedTemplatePlatform, setSelectedTemplatePlatform] =
    useState("whatsapp");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const slugSet = useMemo(
    () =>
      new Set(
        campaigns
          .filter((campaign) => campaign.id !== editingCampaign?.originalId)
          .map((campaign) => campaign.slug)
      ),
    [campaigns, editingCampaign?.originalId]
  );

  if (!organiser) {
    return (
      <Container maxWidth="md" className="page-shell campaign-task-page">
        <Paper variant="outlined" className="creator-login-card">
          <Stack spacing={2.25}>
            <Chip label="Organiser workspace" className="creator-kicker-chip" />
            <Typography variant="h1" className="creator-page-title">
              Build an Amplify campaign
            </Typography>
            <Typography className="creator-muted-copy">
              Log in locally to create, edit and preview campaigns. Nothing is
              saved after refresh yet.
            </Typography>
            <Stack spacing={1.5}>
              <TextField
                label="Your name"
                value={loginForm.name}
                onChange={(event) =>
                  setLoginForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                fullWidth
              />
            </Stack>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              disabled={!loginForm.name.trim() || !loginForm.email.trim()}
              onClick={() =>
                setOrganiser({
                  name: loginForm.name.trim(),
                  email: loginForm.email.trim(),
                })
              }
              className="creator-primary-button"
            >
              Enter workspace
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  function beginCreate() {
    const campaign = createDraftCampaign({
      title: "New campaign",
      organiserName: organiser.name,
      existingSlugs: new Set(campaigns.map((item) => item.slug)),
    });
    setEditingCampaign({ ...campaign, originalId: null, slugTouched: false });
    setSelectedTemplatePlatform("whatsapp");
  }

  function beginEdit(campaign) {
    setEditingCampaign({
      ...cloneCampaign(campaign),
      originalId: campaign.id,
      slugTouched: true,
    });
    setSelectedTemplatePlatform(campaign.shareCards[0]?.platform || "whatsapp");
  }

  function beginDuplicate(campaign) {
    const copy = cloneCampaign(campaign);
    const title = `${copy.title} copy`;
    copy.id = makeId(title);
    copy.title = title;
    copy.slug = uniqueSlug(slugify(title), new Set(campaigns.map((item) => item.slug)));
    copy.status = "draft";
    copy.shareCards = copy.shareCards.map((card) => ({
      ...card,
      id: `${copy.id}-${card.platform}`,
    }));
    setEditingCampaign({ ...copy, originalId: null, slugTouched: true });
    setSelectedTemplatePlatform(copy.shareCards[0]?.platform || "whatsapp");
  }

  function saveCampaign() {
    const cleanedCampaign = normaliseCampaignForSave(editingCampaign);
    if (editingCampaign.originalId) {
      updateCampaign(editingCampaign.originalId, cleanedCampaign);
    } else {
      createCampaign(cleanedCampaign);
    }
    setEditingCampaign(null);
  }

  function updateDraft(updater) {
    setEditingCampaign((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      return next;
    });
  }

  function updateCampaignField(field, value) {
    updateDraft((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !current.slugTouched) {
        next.slug = uniqueSlug(
          slugify(value),
          new Set(
            campaigns
              .filter((campaign) => campaign.id !== current.originalId)
              .map((campaign) => campaign.slug)
          )
        );
      }
      if (field === "primaryUrl") {
        next.shareCards = next.shareCards.map((card) => ({
          ...card,
          urlToShare: value,
        }));
      }
      return next;
    });
  }

  function updateTemplate(platform, field, value) {
    updateDraft((current) => ({
      ...current,
      shareCards: current.shareCards.map((card) =>
        card.platform === platform ? { ...card, [field]: value } : card
      ),
    }));
  }

  function copyTemplateText(targetPlatform, sourcePlatform) {
    const source = editingCampaign.shareCards.find(
      (card) => card.platform === sourcePlatform
    );
    if (!source) return;
    updateTemplate(targetPlatform, "defaultText", source.defaultText);
  }

  function applyImageUrl(imageUrl) {
    updateDraft((current) => ({
      ...current,
      imageUrl,
      shareCards: current.shareCards.map((card) => ({
        ...card,
        imageUrl,
      })),
    }));
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    applyImageUrl(URL.createObjectURL(file));
  }

  const isEditing = Boolean(editingCampaign);
  const activeTemplate = editingCampaign?.shareCards.find(
    (card) => card.platform === selectedTemplatePlatform
  );
  const slugError = Boolean(editingCampaign?.slug && slugSet.has(editingCampaign.slug));
  const canSave =
    editingCampaign?.title?.trim() &&
    editingCampaign?.slug?.trim() &&
    editingCampaign?.primaryUrl?.trim() &&
    !slugError;

  return (
    <Container maxWidth="xl" className="page-shell campaign-task-page creator-page">
      {!isEditing ? (
        <CreatorDashboard
          organiser={organiser}
          campaigns={campaigns}
          onCreate={beginCreate}
          onEdit={beginEdit}
          onDuplicate={beginDuplicate}
          onDelete={setDeleteTarget}
        />
      ) : (
        <Box className="creator-editor-layout">
          <Box className="creator-editor-main">
            <Stack spacing={2}>
              <Paper variant="outlined" className="creator-panel">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                  className="creator-editor-heading"
                >
                  <Box>
                    <Typography className="creator-kicker">
                      Campaign editor
                    </Typography>
                    <Typography variant="h1" className="creator-page-title">
                      {editingCampaign.originalId
                        ? "Edit campaign"
                        : "Create campaign"}
                    </Typography>
                  </Box>
                  <Stack direction="row" gap={1} className="creator-action-row">
                    <Button onClick={() => setEditingCampaign(null)}>Cancel</Button>
                    <Button
                      variant="contained"
                      disabled={!canSave}
                      onClick={saveCampaign}
                      className="creator-primary-button"
                    >
                      Save campaign
                    </Button>
                  </Stack>
                </Stack>
              </Paper>

              <Paper variant="outlined" className="creator-panel">
                <CreatorSectionHeading
                  label="Basics"
                  title="What are people sharing?"
                  helper="Make the action clear enough that someone can understand it in a few seconds."
                />
                <Box className="creator-form-grid">
                  <TextField
                    label="Campaign title"
                    value={editingCampaign.title}
                    onChange={(event) =>
                      updateCampaignField("title", event.target.value)
                    }
                    fullWidth
                  />
                  <TextField
                    label="Organiser"
                    value={editingCampaign.organiserName}
                    onChange={(event) =>
                      updateCampaignField("organiserName", event.target.value)
                    }
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Campaign type</InputLabel>
                    <Select
                      label="Campaign type"
                      value={editingCampaign.campaignType}
                      onChange={(event) => {
                        const type = event.target.value;
                        updateDraft((current) => ({
                          ...current,
                          campaignType: type,
                          eyebrow: getEyebrowForType(type),
                        }));
                      }}
                    >
                      {CAMPAIGN_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={editingCampaign.status}
                      onChange={(event) =>
                        updateCampaignField("status", event.target.value)
                      }
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="paused">Paused</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <TextField
                  label="Short description"
                  value={editingCampaign.description}
                  onChange={(event) =>
                    updateCampaignField("description", event.target.value)
                  }
                  multiline
                  minRows={3}
                  fullWidth
                  sx={{ mt: 1.5 }}
                />
              </Paper>

              <Paper variant="outlined" className="creator-panel">
                <CreatorSectionHeading
                  label="URL"
                  title="Set the campaign link"
                  helper="Make the action link obvious and keep only one primary link."
                />
                <Box className="creator-form-grid">
                  <TextField
                    label="Action URL"
                    value={editingCampaign.primaryUrl}
                    onChange={(event) =>
                      updateCampaignField("primaryUrl", event.target.value)
                    }
                    fullWidth
                  />
                  <TextField
                    label="Campaign slug"
                    value={editingCampaign.slug}
                    error={slugError}
                    helperText={
                      slugError
                        ? "That URL is already in use this session."
                        : `/act/${editingCampaign.slug || "campaign-url"}`
                    }
                    onChange={(event) =>
                      updateDraft((current) => ({
                        ...current,
                        slug: slugify(event.target.value),
                        slugTouched: true,
                      }))
                    }
                    fullWidth
                  />
                </Box>
              </Paper>

              <Paper variant="outlined" className="creator-panel">
                <CreatorSectionHeading
                  label="Image"
                  title="Add the campaign graphic"
                  helper="Use a clear campaign graphic that still makes sense when cropped."
                />
                <Box className="creator-image-editor">
                  <Box className="creator-image-preview">
                    {editingCampaign.imageUrl ? (
                      <Box
                        component="img"
                        src={editingCampaign.imageUrl}
                        alt=""
                        className="creator-uploaded-image"
                      />
                    ) : (
                      <ImageIcon />
                    )}
                  </Box>
                  <Stack spacing={1}>
                    <Button variant="outlined" component="label">
                      Upload image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                      />
                    </Button>
                    <TextField
                      label="Or image path/URL"
                      value={editingCampaign.imageUrl}
                      onChange={(event) => applyImageUrl(event.target.value)}
                      fullWidth
                    />
                    <Button onClick={() => applyImageUrl("")}>
                      Remove image
                    </Button>
                  </Stack>
                </Box>
              </Paper>

              <Paper variant="outlined" className="creator-panel">
                <CreatorSectionHeading
                  label="Templates"
                  title="Write platform copy"
                  helper="Reuse the core ask, but change the first line for the audience."
                />
                <Tabs
                  value={selectedTemplatePlatform}
                  onChange={(_, value) => setSelectedTemplatePlatform(value)}
                  variant="scrollable"
                  className="creator-template-tabs"
                >
                  {editingCampaign.shareCards.map((card) => (
                    <Tab
                      key={card.platform}
                      value={card.platform}
                      icon={<PlatformIcon platform={card.platform} />}
                      iconPosition="start"
                      label={card.platformLabel}
                    />
                  ))}
                </Tabs>
                {activeTemplate && (
                  <TemplateEditor
                    template={activeTemplate}
                    templates={editingCampaign.shareCards}
                    onChange={updateTemplate}
                    onCopyText={copyTemplateText}
                  />
                )}
              </Paper>

              <Paper variant="outlined" className="creator-panel">
                <CreatorSectionHeading
                  label="Boost"
                  title="Add a post to boost"
                  helper="Ask people for real engagement: comment, save, share, or send to someone relevant."
                />
                <BoostEditor
                  boostContent={editingCampaign.boostContent}
                  onChange={(boostContent) =>
                    updateDraft((current) => ({ ...current, boostContent }))
                  }
                />
              </Paper>
            </Stack>
          </Box>

          <Box className="creator-preview-column">
            <CreatorPreview campaign={editingCampaign} template={activeTemplate} />
          </Box>
        </Box>
      )}

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete campaign?</DialogTitle>
        <DialogContent>
          <Typography>
            This only removes it from the current in-memory session.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              deleteCampaign(deleteTarget.id);
              setDeleteTarget(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function CreatorDashboard({
  organiser,
  campaigns,
  onCreate,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" className="creator-panel creator-dashboard-hero">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
          className="creator-dashboard-heading"
        >
          <Box>
            <Typography className="creator-kicker">
              Logged in as {organiser.name}
            </Typography>
            <Typography variant="h1" className="creator-page-title">
              Campaign workspace
            </Typography>
            <Typography className="creator-muted-copy">
              Create and edit campaign pages, share templates and boost prompts
              for this browser session.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
            className="creator-primary-button"
          >
            Create campaign
          </Button>
        </Stack>
      </Paper>

      <Box className="creator-campaign-grid">
        {campaigns.map((campaign) => (
          <Paper
            key={campaign.id}
            variant="outlined"
            className="creator-campaign-card"
          >
            <Box
              component="img"
              src={campaign.imageUrl}
              alt=""
              className="creator-campaign-thumb"
            />
            <Stack spacing={1.1} className="creator-campaign-copy">
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={campaign.status} size="small" />
                <Chip label={campaign.eyebrow} size="small" />
              </Stack>
              <Typography variant="h2" className="creator-card-title">
                {campaign.title}
              </Typography>
              <Typography className="creator-muted-copy">
                {campaign.organiserName} · /act/{campaign.slug}
              </Typography>
              <Box className="creator-card-actions">
                <Button
                  component={RouterLink}
                  to={`/act/${campaign.slug}`}
                  startIcon={<VisibilityIcon />}
                >
                  View
                </Button>
                <Button startIcon={<EditIcon />} onClick={() => onEdit(campaign)}>
                  Edit
                </Button>
                <Button
                  startIcon={<ContentCopyIcon />}
                  onClick={() => onDuplicate(campaign)}
                >
                  Duplicate
                </Button>
                <IconButton
                  aria-label={`Delete ${campaign.title}`}
                  onClick={() => onDelete(campaign)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Stack>
  );
}

function CreatorSectionHeading({ label, title, helper }) {
  return (
    <Box className="creator-section-heading">
      <Typography className="creator-kicker">{label}</Typography>
      <Typography variant="h2" className="creator-section-title">
        {title}
      </Typography>
      <Typography className="creator-muted-copy">{helper}</Typography>
    </Box>
  );
}

function TemplateEditor({ template, templates, onChange, onCopyText }) {
  const guidance = getTemplateGuidance(template.platform);

  return (
    <Stack spacing={1.5} className="creator-template-editor">
      <Box className="creator-guidance-row">
        {guidance.map((item) => (
          <Chip key={item} label={item} className="creator-guidance-chip" />
        ))}
      </Box>
      <Box className="creator-form-grid">
        <TextField
          label="Template title"
          value={template.title}
          onChange={(event) =>
            onChange(template.platform, "title", event.target.value)
          }
          fullWidth
        />
        <TextField
          label="Recommended use"
          value={template.recommendedUse}
          onChange={(event) =>
            onChange(template.platform, "recommendedUse", event.target.value)
          }
          fullWidth
        />
      </Box>
      <TextField
        label="Message template"
        value={template.defaultText}
        onChange={(event) =>
          onChange(template.platform, "defaultText", event.target.value)
        }
        multiline
        minRows={5}
        fullWidth
      />
      <TextField
        label="Guidance"
        value={template.guidance}
        onChange={(event) =>
          onChange(template.platform, "guidance", event.target.value)
        }
        multiline
        minRows={2}
        fullWidth
      />
      <Box className="creator-form-grid">
        <TextField
          label="URL to share"
          value={template.urlToShare}
          onChange={(event) =>
            onChange(template.platform, "urlToShare", event.target.value)
          }
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(template.requiresImage)}
              onChange={(event) =>
                onChange(template.platform, "requiresImage", event.target.checked)
              }
            />
          }
          label="Needs image upload when sharing"
        />
      </Box>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {templates
          .filter((item) => item.platform !== template.platform)
          .slice(0, 4)
          .map((item) => (
            <Button
              key={item.platform}
              size="small"
              onClick={() => onCopyText(template.platform, item.platform)}
            >
              Copy text from {item.platformLabel}
            </Button>
          ))}
      </Stack>
    </Stack>
  );
}

function BoostEditor({ boostContent, onChange }) {
  const enabled = Boolean(boostContent?.enabled);
  const current = boostContent || createDefaultBoostContent();
  const urlLooksEmbeddable =
    current.platform !== "instagram" ||
    /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\//i.test(current.url || "");

  function update(field, value) {
    onChange({ ...current, enabled, [field]: value });
  }

  return (
    <Stack spacing={1.5}>
      <FormControlLabel
        control={
          <Checkbox
            checked={enabled}
            onChange={(event) =>
              onChange({ ...current, enabled: event.target.checked })
            }
          />
        }
        label="Include a post-open boost step"
      />
      {enabled && (
        <>
          <Box className="creator-form-grid">
            <FormControl fullWidth>
              <InputLabel>Platform</InputLabel>
              <Select
                label="Platform"
                value={current.platform}
                onChange={(event) => update("platform", event.target.value)}
              >
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="x">X</MenuItem>
                <MenuItem value="bluesky">Bluesky</MenuItem>
                <MenuItem value="tiktok">TikTok</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Content type"
              value={current.contentType}
              onChange={(event) => update("contentType", event.target.value)}
              fullWidth
            />
          </Box>
          <TextField
            label="Original post URL"
            value={current.url}
            error={!urlLooksEmbeddable}
            helperText={
              urlLooksEmbeddable
                ? "This will open after the supporter shares."
                : "Instagram embeds work best with /p/, /reel/ or /tv/ URLs."
            }
            onChange={(event) => update("url", event.target.value)}
            fullWidth
          />
          <TextField
            label="Boost title"
            value={current.title}
            onChange={(event) => update("title", event.target.value)}
            fullWidth
          />
          <TextField
            label="Boost description"
            value={current.description}
            onChange={(event) => update("description", event.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
          <Box className="creator-form-grid">
            <TextField
              label="Actions, one per line"
              value={(current.actions || []).join("\n")}
              onChange={(event) =>
                update("actions", linesFromTextarea(event.target.value))
              }
              multiline
              minRows={5}
              fullWidth
            />
            <TextField
              label="Comment starters, one per line"
              value={(current.commentStarters || []).join("\n")}
              onChange={(event) =>
                update("commentStarters", linesFromTextarea(event.target.value))
              }
              multiline
              minRows={5}
              fullWidth
            />
          </Box>
        </>
      )}
    </Stack>
  );
}

function CreatorPreview({ campaign, template }) {
  const previewCard = template || campaign.shareCards[0];
  const directCards = getCardsForSharingMode(
    campaign.shareCards,
    SHARING_MODE_IDS.askDirectly
  );
  const groupCards = getCardsForSharingMode(
    campaign.shareCards,
    SHARING_MODE_IDS.groupOrFeed
  );

  return (
    <Stack spacing={2} className="creator-preview-sticky">
      <Paper variant="outlined" className="campaign-context-aside creator-preview-card">
        {campaign.imageUrl ? (
          <Box
            component="img"
            src={campaign.imageUrl}
            alt=""
            className="campaign-aside-image"
          />
        ) : (
          <Box className="campaign-aside-image creator-empty-image">
            <ImageIcon />
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
        <Button
          component={RouterLink}
          to={`/act/${campaign.slug}`}
          variant="outlined"
          endIcon={<OpenInNewIcon />}
          className="campaign-aside-link"
        >
          View campaign
        </Button>
      </Paper>

      <Paper variant="outlined" className="creator-panel">
        <CreatorSectionHeading
          label="Share preview"
          title={previewCard.platformLabel}
          helper={previewCard.guidance || "Preview without saving."}
        />
        <PlatformPreviewFrame
          shareCard={previewCard}
          message={previewCard.defaultText}
        />
        <Stack spacing={0.75} className="creator-preview-channel-summary">
          <Typography className="creator-kicker">Direct channels</Typography>
          <Typography className="creator-muted-copy">
            {directCards.map((card) => card.platformLabel).join(", ")}
          </Typography>
          <Typography className="creator-kicker">Group/feed channels</Typography>
          <Typography className="creator-muted-copy">
            {groupCards.map((card) => card.platformLabel).join(", ")}
          </Typography>
        </Stack>
      </Paper>

      {campaign.boostContent?.enabled && (
        <Paper variant="outlined" className="creator-panel">
          <CreatorSectionHeading
            label="Boost preview"
            title={campaign.boostContent.title || "Boost original post"}
            helper={campaign.boostContent.description}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <PlatformIcon platform={campaign.boostContent.platform} />
            <Typography className="creator-muted-copy">
              {campaign.boostContent.url || "No boost URL yet"}
            </Typography>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}

function createDraftCampaign({ title, organiserName, existingSlugs }) {
  const slug = uniqueSlug(slugify(title), existingSlugs);
  const id = makeId(slug);
  const campaign = {
    id,
    slug,
    title,
    eyebrow: "Drive action",
    description:
      "Describe what supporters are sharing and why this action matters.",
    primaryUrl: DEFAULT_URL,
    imageUrl: "",
    organiserName,
    campaignType: "drive-action",
    status: "draft",
    shareCards: ALL_TEMPLATE_PLATFORMS.map((platform) =>
      createTemplate({ campaignId: id, platform, primaryUrl: DEFAULT_URL })
    ),
    boostContent: createDefaultBoostContent(false),
  };
  return campaign;
}

function createTemplate({ campaignId, platform, primaryUrl }) {
  const isDirect = DIRECT_PLATFORMS.includes(platform);
  return {
    id: `${campaignId}-${platform}`,
    platform,
    platformLabel: PLATFORM_LABELS[platform] || platform,
    title: isDirect ? "Ask someone directly" : "Share to a group or feed",
    guidance: isDirect
      ? "Write like you are asking one real person."
      : "Say why this audience should care.",
    defaultText: isDirect
      ? `Can you take a minute to back this? ${primaryUrl}`
      : `Sharing this because it matters locally. Please take a minute: ${primaryUrl}`,
    urlToShare: primaryUrl,
    imageUrl: "",
    requiresImage: ["facebook", "instagram", "tiktok"].includes(platform),
    shareMode: isDirect ? "direct" : "manual",
    recommendedUse: isDirect
      ? "Use for direct asks to people who might care."
      : "Use for a relevant group, feed or wider channel.",
  };
}

function createDefaultBoostContent(enabled = true) {
  return {
    enabled,
    platform: "instagram",
    contentType: "post",
    url: "",
    title: "Boost the original post",
    description:
      "Real comments, shares, saves and DMs help more people see it.",
    actions: [
      "Open the original post.",
      "Read or watch enough to understand it.",
      "Leave a real comment in your own words.",
      "Share or send it somewhere relevant.",
    ],
    commentStarters: [
      "This is worth reading and sharing.",
      "This matters locally because...",
      "If you rent, please take a look.",
    ],
  };
}

function normaliseCampaignForSave(campaign) {
  const cleaned = cloneCampaign(campaign);
  delete cleaned.originalId;
  delete cleaned.slugTouched;
  cleaned.id = cleaned.id || makeId(cleaned.slug);
  cleaned.shareCards = cleaned.shareCards.map((card) => ({
    ...card,
    imageUrl: card.imageUrl || cleaned.imageUrl,
    urlToShare: card.urlToShare || cleaned.primaryUrl,
  }));
  if (cleaned.boostContent && !cleaned.boostContent.enabled) {
    cleaned.boostContent = { ...cleaned.boostContent, enabled: false };
  }
  return cleaned;
}

function cloneCampaign(campaign) {
  return {
    ...campaign,
    shareCards: campaign.shareCards.map((card) => ({ ...card })),
    boostContent: campaign.boostContent
      ? {
          ...campaign.boostContent,
          actions: [...(campaign.boostContent.actions || [])],
          commentStarters: [...(campaign.boostContent.commentStarters || [])],
        }
      : createDefaultBoostContent(false),
  };
}

function getEyebrowForType(type) {
  return CAMPAIGN_TYPES.find((item) => item.value === type)?.label || "Drive action";
}

function getTemplateGuidance(platform) {
  if (platform === "sms") return ["Keep it short", "One clear link"];
  if (platform === "instagram" || platform === "tiktok") {
    return ["Manual posting", "Caption can be reused", "Use a strong image"];
  }
  if (GROUP_PLATFORMS.includes(platform)) {
    return ["Add audience context", "One clear ask"];
  }
  return ["Write like a real ask", "Personalise the first line"];
}

function linesFromTextarea(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function slugify(value) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "new-campaign"
  );
}

function uniqueSlug(baseSlug, existingSlugs) {
  let slug = baseSlug || "new-campaign";
  let index = 2;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }
  return slug;
}

function makeId(value) {
  return `${slugify(value)}-${Math.random().toString(36).slice(2, 7)}`;
}
