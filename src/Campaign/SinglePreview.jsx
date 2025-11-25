import React, { useState, useEffect } from "react";
import { Box, Button, Chip, Stack, TextField, Typography , Snackbar, Alert} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import PlatformPreviewFrame from "./PlatformPreviewFrame";
import Interstitial from "./Interstitial";
import { BtnStyle } from "../Shared";


const SinglePreview = ({ campaign, variant }) => {
  const [campaignUrl, setCampaignUrl] = useState("");
  const [message, setMessage] = useState(variant.message);

  
	useEffect(() => {
		if (!variant?.message) return;

		// Regex to match URLs (handles http, https, and www)
		const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
		const match = variant.message.match(urlRegex);

		if (match) {
			setCampaignUrl(match[0]);
		} else {
			setCampaignUrl(""); // optional: clear if no URL found
		}
	}, [variant?.message]);


  const [helpOpen, setHelpOpen] = useState(false);

      const [snack, setSnack] = useState({ open: false, message: "" });
			const [url, setUrl] = useState("");
	const campaignImage = campaign.image;

	const manual =
		variant.useImage ||
		variant.label == "Facebook" ||
		variant.label == "Instagram";

	const buildShareUrl = () => {
		const encoded = encodeURIComponent(message);
		switch (variant.key) {
			case "whatsapp":
				return `https://wa.me/?text=${encoded}`;
			case "x":
				return `https://x.com/intent/tweet?text=${encoded}`;
			case "bluesky":
				return `https://bsky.app/intent/compose?text=${encoded}`;
			case "signal":
				return `https://signal.me`;
			default:
				return null;
		}
	};



	async function copyText(text) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			const ta = document.createElement("textarea");
			ta.value = text;
			document.body.appendChild(ta);
			ta.select();
			try {
				document.execCommand("copy");
				return true;
			} catch {
				return false;
			} finally {
				document.body.removeChild(ta);
			}
		}
	}

	async function triggerDownload(url, filename = "amplify-image.jpg") {
		try {
			const res = await fetch(url, { mode: "cors" });
			const blob = await res.blob();
			const objectUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = objectUrl;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(objectUrl);
			return true;
		} catch {
			const a = document.createElement("a");
			a.href = url;
			a.target = "_blank";
			a.rel = "noopener";
			document.body.appendChild(a);
			a.click();
			a.remove();
			return false;
		}
	}




	const onPost = ({ copied, downloaded, variant, url }) => {
		//if (manual) setHelpOpen(true);
		setHelpOpen(true)
		setSnack({
			open: true,
			message: `${variant.label}: ${
				manual ? (copied ? "text copied" : "copy failed") : "share opened"
			} · ${
				manual
					? variant.useImage
						? downloaded
							? "image downloaded"
							: "image download attempted"
						: "no image"
					: ""
			}`.trim(),
		});
		setUrl(url);
  };
  



	const handlePost = async () => {
		let url = "";

		if (
			variant.key == "x" ||
			variant.key == "bluesky" ||
			variant.key == "whatsapp" ||
			variant.key == "signal"
		) {
			url = buildShareUrl();
    }
    
    if (variant.key == "facebook" || variant.key == "instagram") {
      url = variant.link
    }

		if (!manual && !variant.useImage) {
			if (url) window.open(url, "_blank", "noopener,noreferrer");
			onPost && onPost({ copied: false, downloaded: false, variant, url });
			return;
		}

		const copied = await copyText(message);
		let downloaded = false;
		if (campaignImage || variant.useImage)
			downloaded = await triggerDownload(campaignImage);
		onPost && onPost({ copied, downloaded, variant, url });
	};






	return (
		<Box
			sx={{
				p: 2,
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 1,
			}}
    >
      


			<Typography
				variant="primary"
				//color="text.secondary"
				sx={{ display: "block", textAlign: 'center', margin: '0 auto 10px auto', width: '90%' }}
			>

There is a draft message below that you can use, but taking a moment to personalise it will make it even more impactful.
			</Typography>

			<PlatformPreviewFrame
				variant={variant}
				campaignUrl={campaignUrl}
        campaignImage={campaignImage}
        onMessageChange={setMessage}
			/>

			<Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
				<Button
					variant="contained"
					startIcon={<ShareIcon sx={{ mb: 0.3 }} />}
					onClick={handlePost}
					fullWidth
sx={{...BtnStyle}}				>
					Post
				</Button>
      </Stack>
      



          <Interstitial
              variant={variant}
              open={helpOpen}
              url={url}
              manual={manual}
              onClose={() => setHelpOpen(false)}
              platformLabel={variant.label}
              platformLink={url}
              hasImage={variant.useImage}
              messageText={message}
              campaignImage={campaign.image}
      />
      

            <Snackbar
              open={snack.open}
              autoHideDuration={3500}
              onClose={() => setSnack({ open: false, message: "" })}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={() => setSnack({ open: false, message: "" })}
                severity="info"
                variant="filled"
              >
                {snack.message}
              </Alert>
            </Snackbar>
		</Box>
	);
}


export default SinglePreview;
