import React, { useState } from "react";
import {
	Box,
	Button,
	IconButton,
	Stack,
	Typography,
	Tooltip,
	useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import X from "@mui/icons-material/X"
import PublicIcon from "@mui/icons-material/Public";
import SinglePreview from "./SinglePreview";
import { BtnStyle, BtnStyleSmall } from "../Shared";

const iconFor = (key) => {
	switch (key) {
		case "whatsapp":
			return <WhatsAppIcon />;
		case "signal":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-signal"
					viewBox="0 0 16 16"
				>
					<path d="m6.08.234.179.727a7.3 7.3 0 0 0-2.01.832l-.383-.643A7.9 7.9 0 0 1 6.079.234zm3.84 0L9.742.96a7.3 7.3 0 0 1 2.01.832l.388-.643A8 8 0 0 0 9.92.234m-8.77 3.63a8 8 0 0 0-.916 2.215l.727.18a7.3 7.3 0 0 1 .832-2.01l-.643-.386zM.75 8a7 7 0 0 1 .081-1.086L.091 6.8a8 8 0 0 0 0 2.398l.74-.112A7 7 0 0 1 .75 8m11.384 6.848-.384-.64a7.2 7.2 0 0 1-2.007.831l.18.728a8 8 0 0 0 2.211-.919M15.251 8q0 .547-.082 1.086l.74.112a8 8 0 0 0 0-2.398l-.74.114q.082.54.082 1.086m.516 1.918-.728-.18a7.3 7.3 0 0 1-.832 2.012l.643.387a8 8 0 0 0 .917-2.219m-6.68 5.25c-.72.11-1.453.11-2.173 0l-.112.742a8 8 0 0 0 2.396 0l-.112-.741zm4.75-2.868a7.2 7.2 0 0 1-1.537 1.534l.446.605a8 8 0 0 0 1.695-1.689zM12.3 2.163c.587.432 1.105.95 1.537 1.537l.604-.45a8 8 0 0 0-1.69-1.691zM2.163 3.7A7.2 7.2 0 0 1 3.7 2.163l-.45-.604a8 8 0 0 0-1.691 1.69l.604.45zm12.688.163-.644.387c.377.623.658 1.3.832 2.007l.728-.18a8 8 0 0 0-.916-2.214M6.913.831a7.3 7.3 0 0 1 2.172 0l.112-.74a8 8 0 0 0-2.396 0zM2.547 14.64 1 15l.36-1.549-.729-.17-.361 1.548a.75.75 0 0 0 .9.902l1.548-.357zM.786 12.612l.732.168.25-1.073A7.2 7.2 0 0 1 .96 9.74l-.727.18a8 8 0 0 0 .736 1.902l-.184.79zm3.5 1.623-1.073.25.17.731.79-.184c.6.327 1.239.574 1.902.737l.18-.728a7.2 7.2 0 0 1-1.962-.811zM8 1.5a6.5 6.5 0 0 0-6.498 6.502 6.5 6.5 0 0 0 .998 3.455l-.625 2.668L4.54 13.5a6.502 6.502 0 0 0 6.93-11A6.5 6.5 0 0 0 8 1.5" />
				</svg>
			); // placeholder
		case "facebook":
			return <FacebookIcon />;
		case "instagram":
			return <InstagramIcon />;
		case "x":
			return <X />; // stand-in for X
		case "bluesky":
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-bluesky"
					viewBox="0 0 16 16"
				>
					<path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948" />
				</svg>
			); // placeholder
		default:
			return <PublicIcon />;
	}
};

const Previews = ({campaign}) => {
	const [index, setIndex] = useState(0);
	const total = campaign.variants.length;
	const current = campaign.variants[index];

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const go = (dir) => setIndex((i) => (i + dir + total) % total);

	return (
		<Box>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				sx={{ mb: 1 }}
			>
				<Typography variant="overline">
					Share on {campaign.variants[index].label}
				</Typography>
				<Stack direction="row" spacing={1}>
					<IconButton aria-label="previous" onClick={() => go(-1)}>
						<ChevronLeftIcon />
					</IconButton>
					<IconButton aria-label="next" onClick={() => go(1)}>
						<ChevronRightIcon />
					</IconButton>
				</Stack>
			</Stack>

			{/* Platform buttons */}
			<Stack
				direction="row"
				spacing={1}
				flexWrap="wrap"
				useFlexGap
				sx={{ mb: 1, mt: 2 }}
				justifyContent="space-around"
			>
				{campaign.variants.map((v, i) => (
					<Tooltip key={v.key} title={v.label}>
						<Button
							variant={i === index ? "contained" : "outlined"}
							onClick={() => setIndex(i)}
							sx={{
								...BtnStyle,
								pb: '5px',
								textTransform: "none",
								minWidth: isMobile ? 48 : "auto",
								px: isMobile ? 1 : 2,
							}}
						>
							{iconFor(v.key)}
							{1 == 2 && v.label}
						</Button>
					</Tooltip>
				))}

				<SinglePreview campaign={campaign} variant={current} />
			</Stack>
		</Box>
	);
}

export default Previews;
