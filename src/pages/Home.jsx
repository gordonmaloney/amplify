import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link as RouterLink } from "react-router-dom";
import { useCampaignStore } from "../context/useCampaignStore";

const useCases = [
  {
    title: "Mobilise members",
    copy:
      "Help members bring friends, neighbours, workmates and family into the room for meetings, events and action.",
  },
  {
    title: "Build pressure",
    copy:
      "Turn support into collective action by giving members a clear ask to share with people they know.",
  },
  {
    title: "Celebrate our power",
    copy:
      "Celebrate victories, tell the story of the campaign and show what organised tenants can achieve together.",
  },
];

export default function Home() {
  const { campaigns } = useCampaignStore();
  const liveCampaigns = campaigns.filter(
    (campaign) => campaign.status === "active"
  );
  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);
  const [carouselTransition, setCarouselTransition] = useState({
    direction: 0,
    phase: "idle",
    targetIndex: null,
  });
  const swipeStartXRef = useRef(null);
  const carouselFrameRef = useRef(null);
  const carouselTimeoutRef = useRef(null);
  const hasMultipleCampaigns = liveCampaigns.length > 1;
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

  useEffect(() => {
    if (
      liveCampaigns.length > 0 &&
      activeCampaignIndex >= liveCampaigns.length
    ) {
      setActiveCampaignIndex(0);
    }
  }, [activeCampaignIndex, liveCampaigns.length]);

  function normalizeCampaignIndex(index) {
    return (index + liveCampaigns.length) % liveCampaigns.length;
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

  function renderCampaignCarousel() {
    if (liveCampaigns.length === 0) {
      return (
        <Stack spacing={1.5} className="home-hero-campaigns">
          <Typography variant="h2" className="section-heading">
            Live campaigns
          </Typography>
          <Typography color="text.secondary">
            There are no live campaigns just now.
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={1.5} className="home-hero-campaigns">
        <Box className="campaign-section-heading">
          <Typography variant="h2" className="section-heading">
            Live campaigns
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
              const campaign = liveCampaigns[campaignIndex];
              const isCurrentPanel = panelIndex === 1;

              return (
                <Box
                  key={`${campaign.id}-${panelIndex}`}
                  className="featured-campaign-carousel"
                  aria-label={isCurrentPanel ? "Live campaigns" : undefined}
                  aria-hidden={!isCurrentPanel}
                >
                  <Paper
                    component={RouterLink}
                    to={`/act/${campaign.slug}`}
                    variant="outlined"
                    className="campaign-card campaign-feature-card campaign-feature-link"
                    aria-label={`Open ${campaign.title}`}
                    tabIndex={isCurrentPanel ? 0 : -1}
                  >
                    <Box className="campaign-feature-media">
                      <img src={campaign.imageUrl} alt="" />
                    </Box>
                    <Stack spacing={1.1} className="campaign-feature-copy">
                      <Typography variant="h3">{campaign.title}</Typography>
                      <Typography color="text.secondary">
                        {campaign.description}
                      </Typography>
                      <Box className="campaign-feature-cta" aria-hidden="true">
                        <span>Open sharing page</span>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Box>
        {hasMultipleCampaigns && (
          <Box className="campaign-carousel-dots" aria-label="Campaign slides">
            {liveCampaigns.map((campaign, index) => (
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
    );
  }

  return (
    <Container maxWidth="lg" className="page-shell">
      <Box className="home-hero">
        <Stack spacing={2} className="home-hero-heading">
          <Typography variant="h1">
            <span className="brush-highlight">Amplify</span>
          </Typography>
          <Typography variant="h2" className="hero-subtitle">
            Cut through the algorithms and the noise
          </Typography>
        </Stack>
        <Box className="home-hero-layout">
          <Stack spacing={2} className="home-hero-copy">
            <Typography className="hero-copy">
              Billionares, oligarchs and loser tech-bros can buy our social
              networks, newspapers and TV stations. They can flood the internet
              with bots. They can manipulate algorithms and platform policies to
              push misinformation and advertising.
            </Typography>
            <Typography className="hero-copy">
              But what they don&apos;t have - and can&apos;t take from us - are the
              real, natural relationships that ordinary people have with our
              friends, colleagues, neighbours, and family. And there is no amount
              of money, no suppressive algorithm, no AI-generated slop that can
              outweigh a real message from a trusted friend.
            </Typography>
            <Typography className="hero-copy">
              That&apos;s what this tool is for: for organisers to make use the
              organic networks of members and supporters to amplify our messages
              - despite the best efforts of Musk and Zuckerberg.
            </Typography>
          </Stack>
          {renderCampaignCarousel()}
        </Box>
      </Box>

      <Box className="content-band use-cases-band">
        <Box className="use-case-grid">
          {useCases.map(({ title, copy }) => (
            <Box key={title} className="use-case-card">
              <Typography variant="h3">{title}</Typography>
              <Typography color="text.secondary">{copy}</Typography>
            </Box>
          ))}
        </Box>
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
          to="/create"
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
