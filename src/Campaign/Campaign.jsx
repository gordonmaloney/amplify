import React from "react";
import { campaign } from "./DummyData";
import { Box, Card, CardHeader, CardContent, Divider, Stack, Typography } from "@mui/material";
import Previews from "./Previews";

const Campaign = () => {
  return (
		<div>
			<Box sx={{ maxWidth: 600, mx: "auto", my: 4, p: 2 }}>
				<Card variant="outlined">
					<CardHeader title={campaign.title} subheader={campaign.description} />

					<Divider />
					<CardContent>
						<Stack spacing={2}>
					
							<Previews
                campaign={campaign}
							/>
						</Stack>{" "}
					</CardContent>
				</Card>
			</Box>
		</div>
	);
};

export default Campaign;
