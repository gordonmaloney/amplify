import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function ShareFlowStep({ step, index, isActive, isVisible }) {
  return (
    <Box
      className="share-flow-step-card"
      data-active={isActive}
      data-visible={isVisible}
      data-status={step.status}
    >
      <Box className="share-flow-step-index">{index + 1}</Box>
      <Box className="share-flow-step-icon">
        <StatusIcon status={step.status} fallback={step.icon} />
      </Box>
      <Box className="share-flow-step-copy">
        <Typography className="share-flow-step-title">{step.title}</Typography>
        <Typography className="share-flow-step-body">{step.body}</Typography>
        {step.showAction && (
          <Box className="share-flow-step-manual">
            <span>{step.actionPrefix}</span>
            <Button size="small" onClick={step.onAction}>
              {step.actionLabel}
            </Button>
          </Box>
        )}
      </Box>
      {step.toastLabel && (
        <Box key={step.toastKey} className="share-flow-step-toast">
          {step.toastLabel}
        </Box>
      )}
    </Box>
  );
}

function StatusIcon({ status, fallback }) {
  if (status === "running") {
    return <CircularProgress size={22} thickness={5} />;
  }

  if (status === "done" || status === "ready") {
    return <CheckCircleIcon />;
  }

  if (status === "failed") {
    return <ErrorOutlineIcon />;
  }

  return fallback;
}
