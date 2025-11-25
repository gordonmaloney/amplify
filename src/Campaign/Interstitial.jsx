// =============================
// File: src/Interstitial.jsx
// =============================
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import { BtnStyle, BtnStyleSmall } from "../Shared";

export default function Interstitial({
  variant,
  open,
  onClose,
  platformLabel,
  manual,
  platformLink,
  hasImage,
  messageText, // <- pass lastPlatform?.message
  campaignImage, // <- pass campaign.image
  url,
}) {


  async function copyAgain() {
    if (!messageText) return;
    try {
      await navigator.clipboard.writeText(messageText);
      // optional: hook into your snackbar instead of alert
      alert("Message copied again.");
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = messageText;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        alert("Message copied again.");
      } catch {
        alert("Could not copy automatically. Please copy manually.");
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  async function downloadAgain(filename = "amplify-image.jpg") {
    if (!campaignImage) return;
    try {
      const res = await fetch(campaignImage, { mode: "cors" });
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Last resort: open the image in a new tab
      const a = document.createElement("a");
      a.href = campaignImage;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }



  const FacebookInstructions = () => {
    return (
			<>
				<li>Open the app or website using the button below.</li>

				<li>Start a new story or post</li>
				<li>Paste the message you copied</li>
				{variant.useImage && <li>Attach the downloaded image</li>}
				<li>Then publish!</li>
			</>
		);
  }

    const InstagramInstructions = () => {
			return (
				<>
					<li>Open the app or website using the button below.</li>

					<li>Start a new story or post</li>
					<li>Paste the message you copied</li>
					{variant.useImage && <li>Attach the downloaded image</li>}
					<li>Then publish!</li>
				</>
			);
		};

  const TwitterInstructions = () => {
    return (
			<>
				<li>Open X using the button below.</li>
				<li>Your message should already be pre-filled</li>
				{variant.useImage && <li>Attach the downloaded image</li>}
				<li>Then post!</li>
			</>
		);
  }


    const BlueSkyInstructions = () => {
			return (
				<>
					<li>Open Bluesky using the button below.</li>

					<li>Your message should already be pre-filled</li>
					{variant.useImage && <li>Attach the downloaded image</li>}
					<li>Then post!</li>
				</>
			);
    };
  
  const WhatsappInstructions = () => {
    return (
		<>
			<li>WhatsApp should've opened automatically, but if not you can either do so manually or try the button below.</li>
			<li>
				Your message should already be pre-filled</li>
			<li>Select who to send your message to - that could be an individual or a groupchat</li>
			{variant.useImage && <li>Attach the downloaded image</li>}
			<li>Then hit send!</li>
			</>
		);
  }
	
	  const SignalInstructions = () => {
			return (
				<>
					<li>
						Signal should've opened automatically, but if not you can either do
						so manually or try the button below.
					</li>
					<li>
						Select who to send your message to - that could be an individual or
						a groupchat
					</li>
					<li>Your message should be copied to your clipboard, so just paste it in</li>
					{variant.useImage && <li>Attach the downloaded image</li>}
					<li>Then hit send!</li>
				</>
			);
		};
	
	
  
	
	const instructionsFor = (key) => {
		switch (key) {
			case "whatsapp":
				return <WhatsappInstructions />;
			case "signal":
				return <SignalInstructions />
			case "facebook":
				return <FacebookInstructions />;
			case "instagram":
				return <InstagramInstructions />;
			case "x":
				return <TwitterInstructions />; // stand-in for X
			case "bluesky":
				return <BlueSkyInstructions />; // placeholder
			default:
				return <></>;
		}
	};

  return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>
				How to post on {platformLabel || "your platform"}
			</DialogTitle>
			<DialogContent>
				<ol style={{ marginTop: 0 }}>{instructionsFor(variant.key)}</ol>

				<center>
					{(!platformLink && variant.useImage) ||
						(platformLink && (
							<Button
						  variant="contained"
								href={platformLink}
								target="_blank"
								rel="noopener"
								sx={{...BtnStyle, margin: "0 auto",  width: "90%" }}
							>
								Open {platformLabel}
							</Button>
						))}
				</center>

				<Divider sx={{ mt: 3, mb: 1 }} />

				<Box>
					<Typography variant="body2" gutterBottom>
						<center>
							Your message should have been copied to your clipboard
							automatically, and your image downloaded, but you can re-do either
							here if you need to:
						</center>
					</Typography>
					<Stack direction="row" spacing={1} justifyContent={"space-around"}>
						{messageText && (
							<Button
								sx={BtnStyleSmall}
								variant="outlined"
								size="small"
								onClick={copyAgain}
							>
								Re-copy message
							</Button>
						)}
						{campaignImage && (
							<Button
								variant="outlined"
								size="small"
								sx={BtnStyleSmall}
								onClick={() => downloadAgain()}
							>
								Re-Download image
							</Button>
						)}
					</Stack>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
