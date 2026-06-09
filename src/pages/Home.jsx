import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BuildIcon from "@mui/icons-material/Build";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link as RouterLink } from "react-router-dom";
import { campaigns } from "../data/campaigns";

const useCases = [
  {
    title: "Mobilise people",
    copy:
      "Turn supporters out for protests, direct actions, meetings, canvasses, branch AGMs, and other moments where showing up matters.",
  },
  {
    title: "Drive action",
    copy:
      "Get people to sign, email, register, donate, join, or take another concrete step that builds pressure.",
  },
  {
    title: "Amplify a story",
    copy:
      "Help a victory, announcement, position, or piece of content travel through trusted relationships instead of platform luck.",
  },
];

export default function Home() {
  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);
  const [carouselTransition, setCarouselTransition] = useState({
    direction: 0,
    phase: "idle",
    targetIndex: null,
  });
  const swipeStartXRef = useRef(null);
  const carouselFrameRef = useRef(null);
  const carouselTimeoutRef = useRef(null);
  const hasMultipleCampaigns = campaigns.length > 1;
  const displayedCampaignIndex =
    carouselTransition.targetIndex ?? activeCampaignIndex;

  useEffect(() => {
    return () => {
      if (carouselFrameRef.current) {
        window.cancelAnimationFrame(carouselFrameRef.current);
      }
      if (carouselTimeoutRef.current) {
        window.clearTimeout(carouselTimeoutRef.current);
      }
    };
  }, []);

  function normalizeCampaignIndex(index) {
    return (index + campaigns.length) % campaigns.length;
  }

  function getCampaignFromIndex(index, offset = 0) {
    return campaigns[normalizeCampaignIndex(index + offset)];
  }

  function moveCampaign(direction) {
    if (!hasMultipleCampaigns || carouselTransition.phase !== "idle") {
      return;
    }

    startCarouselTransition(
      direction,
      normalizeCampaignIndex(activeCampaignIndex + direction)
    );
  }

  function showCampaign(index) {
    if (index === activeCampaignIndex || carouselTransition.phase !== "idle") {
      return;
    }

    startCarouselTransition(index > activeCampaignIndex ? 1 : -1, index);
  }

  function startCarouselTransition(direction, targetIndex) {
    if (carouselFrameRef.current) {
      window.cancelAnimationFrame(carouselFrameRef.current);
    }
    if (carouselTimeoutRef.current) {
      window.clearTimeout(carouselTimeoutRef.current);
    }

    setCarouselTransition({
      direction,
      phase: "ready",
      targetIndex,
    });

    carouselFrameRef.current = window.requestAnimationFrame(() => {
      carouselFrameRef.current = window.requestAnimationFrame(() => {
        setCarouselTransition((currentTransition) => ({
          ...currentTransition,
          phase: "sliding",
        }));
        carouselTimeoutRef.current = window.setTimeout(() => {
          finishCarouselTransition(targetIndex);
        }, 800);
        carouselFrameRef.current = null;
      });
    });
  }

  function completeCarouselTransition(event) {
    if (
      event.target !== event.currentTarget ||
      carouselTransition.phase !== "sliding"
    ) {
      return;
    }

    finishCarouselTransition(carouselTransition.targetIndex);
  }

  function finishCarouselTransition(targetIndex) {
    if (carouselTimeoutRef.current) {
      window.clearTimeout(carouselTimeoutRef.current);
      carouselTimeoutRef.current = null;
    }

    setActiveCampaignIndex(targetIndex);
    setCarouselTransition({
      direction: 0,
      phase: "idle",
      targetIndex: null,
    });
  }

  function handleCarouselPointerDown(event) {
    swipeStartXRef.current = event.clientX;
  }

  function handleCarouselPointerUp(event) {
    if (swipeStartXRef.current === null) {
      return;
    }

    const deltaX = event.clientX - swipeStartXRef.current;
    swipeStartXRef.current = null;

    if (Math.abs(deltaX) < 44) {
      return;
    }

    moveCampaign(deltaX < 0 ? 1 : -1);
  }

  function handleCarouselPointerCancel() {
    swipeStartXRef.current = null;
  }

  function getCarouselPanels() {
    if (carouselTransition.phase === "idle") {
      return [
        normalizeCampaignIndex(activeCampaignIndex - 1),
        activeCampaignIndex,
        normalizeCampaignIndex(activeCampaignIndex + 1),
      ];
    }

    return [
      carouselTransition.direction < 0
        ? carouselTransition.targetIndex
        : normalizeCampaignIndex(activeCampaignIndex - 1),
      activeCampaignIndex,
      carouselTransition.direction > 0
        ? carouselTransition.targetIndex
        : normalizeCampaignIndex(activeCampaignIndex + 1),
    ];
  }

  return (
    <Container maxWidth="lg" className="page-shell">
      <Box className="home-hero">
        <Stack spacing={2} sx={{ maxWidth: 780 }}>
          <Typography variant="h1">Amplify</Typography>
          <Typography variant="h2" className="hero-subtitle">
            Campaign messages for organising through{" "}
            <span className="brush-highlight">real relationships</span>.
          </Typography>
          <Typography className="hero-copy">
            Billionaires, oligarchs and loser tech-bros can buy our social
            networks, newspapers and TV stations. They can flood the internet
            with bots. They can manipulate algorithms and platform policies to
            push misinformation, advertising and far-right propaganda.
          </Typography>
          <Typography className="hero-copy">
            But what they don't have, and can't take from us, are the real,
            natural relationships that ordinary people have with our friends,
            colleagues, neighbours, and family. And there is no amount of
            money or bots, no suppressive algorithm, and no AI-generated slop
            that can outweigh a real message from a trusted friend.
          </Typography>
          <Typography className="hero-copy">
            That's what this tool is for: for organisers to make use of the
            organic networks of members and supporters to amplify our messages,
            despite the best efforts of people like Musk and Zuckerberg.
          </Typography>
        </Stack>
      </Box>

      <Box className="content-band use-cases-band">
        <Box className="use-case-grid">
          {useCases.map(({ title, copy }) => (
            <Box key={title} className="use-case-card" tabIndex={0}>
              <Typography variant="h3">{title}</Typography>
              <Typography color="text.secondary">{copy}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box className="content-band">
        <Stack spacing={2}>
          <Box className="campaign-section-heading">
            <Typography variant="h2" className="section-heading">
              Active campaigns
            </Typography>
            <Stack direction="row" spacing={1} className="campaign-carousel-controls">
              <IconButton
                type="button"
                aria-label="Previous campaign"
                className="carousel-control"
                onClick={() => moveCampaign(-1)}
                disabled={!hasMultipleCampaigns}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                type="button"
                aria-label="Next campaign"
                className="carousel-control"
                onClick={() => moveCampaign(1)}
                disabled={!hasMultipleCampaigns}
              >
                <ChevronRightIcon />
              </IconButton>
            </Stack>
          </Box>
          <Box
            className="featured-campaign-carousel-viewport"
            onPointerDown={handleCarouselPointerDown}
            onPointerUp={handleCarouselPointerUp}
            onPointerCancel={handleCarouselPointerCancel}
          >
            <Box
              className={`featured-campaign-carousel-track is-${carouselTransition.phase} ${
                carouselTransition.direction > 0
                  ? "is-sliding-next"
                  : carouselTransition.direction < 0
                    ? "is-sliding-prev"
                    : ""
              }`}
              onTransitionEnd={completeCarouselTransition}
            >
              {getCarouselPanels().map((campaignIndex, panelIndex) => {
                const campaign = campaigns[campaignIndex];
                const isCurrentPanel = panelIndex === 1;

                return (
                  <Box
                    key={`${campaign.id}-${panelIndex}`}
                    className="featured-campaign-carousel"
                    aria-label={isCurrentPanel ? "Active campaigns" : undefined}
                    aria-hidden={!isCurrentPanel}
                  >
                    {hasMultipleCampaigns && (
                      <button
                        type="button"
                        tabIndex={isCurrentPanel ? 0 : -1}
                        className="campaign-peek campaign-peek-left"
                        onClick={() => moveCampaign(-1)}
                        aria-label={`Show ${getCampaignFromIndex(campaignIndex, -1).title}`}
                      >
                        <img
                          src={getCampaignFromIndex(campaignIndex, -1).imageUrl}
                          alt=""
                        />
                        <span>{getCampaignFromIndex(campaignIndex, -1).title}</span>
                      </button>
                    )}

                    <Paper
                      variant="outlined"
                      className="campaign-card campaign-feature-card"
                    >
                      <Box className="campaign-feature-media">
                        <img src={campaign.imageUrl} alt="" />
                      </Box>
                      <Stack spacing={1.25} className="campaign-feature-copy">
                        <Chip label={campaign.eyebrow} size="small" />
                        <Typography variant="h3">{campaign.title}</Typography>
                        <Typography color="text.secondary">
                          {campaign.description}
                        </Typography>
                        <Button
                          component={RouterLink}
                          to={`/act/${campaign.slug}`}
                          endIcon={<ArrowForwardIcon />}
                          sx={{ alignSelf: "flex-start" }}
                          tabIndex={isCurrentPanel ? 0 : -1}
                        >
                          Open sharing page
                        </Button>
                      </Stack>
                    </Paper>

                    {hasMultipleCampaigns && (
                      <button
                        type="button"
                        tabIndex={isCurrentPanel ? 0 : -1}
                        className="campaign-peek campaign-peek-right"
                        onClick={() => moveCampaign(1)}
                        aria-label={`Show ${getCampaignFromIndex(campaignIndex, 1).title}`}
                      >
                        <img
                          src={getCampaignFromIndex(campaignIndex, 1).imageUrl}
                          alt=""
                        />
                        <span>{getCampaignFromIndex(campaignIndex, 1).title}</span>
                      </button>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
          {hasMultipleCampaigns && (
            <Box className="campaign-carousel-dots" aria-label="Campaign slides">
              {campaigns.map((campaign, index) => (
                <button
                  key={campaign.id}
                  type="button"
                  className={index === displayedCampaignIndex ? "is-active" : ""}
                  aria-label={`Show ${campaign.title}`}
                  aria-current={index === displayedCampaignIndex}
                  onClick={() => showCampaign(index)}
                />
              ))}
            </Box>
          )}
        </Stack>
      </Box>

      <Box component="footer" className="home-footer">
        <Box className="home-footer-imprint">
          <img src="/brand-assets/living-rent-logo.png" alt="Living Rent" />
          <Typography>
            Built by members of Living Rent,
            <br />
            Scotland's tenants' union.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/admin"
          variant="outlined"
          startIcon={<BuildIcon />}
          className="home-footer-action"
        >
          Organiser tools
        </Button>
      </Box>
    </Container>
  );
}
