export const campaign = {
	title: "Rogue Landlords Open Letter",
	description:
		"20+ orgs have backed an open letter demanding Edinburgh Council crack down on rogue landlords. Will you share the story in your networks so it has the biggest impact possible?",
	url: "",
	image: "/image.png", // place in /public for dev
	variants: [
		// WHATSAPP
		{
			key: "whatsapp",
			label: "WhatsApp",
			useImage: false,
			message:
				"BREAKING! 📢 Living Rent Leith has just delivered an open letter to senior Edinburgh councillors demanding action on rogue landlords.\n\nOver 20 trade unions, charities and community organisations have signed on, calling for the council to use the powers it already has to protect tenants from unsafe housing, illegal evictions and abusive landlord behaviour.\n\nRead more: https://www.livingrent.org/rogue_landlords_open_letter",
		},

		// SIGNAL
		{
			key: "signal",
			label: "Signal",
			useImage: false,
			message:
				"BREAKING! 📢 Living Rent Leith has delivered an open letter demanding the council crack down on rogue landlords.\n\n20+ unions, charities and community groups have backed it — urging the council to act to protect tenants from unsafe homes, illegal evictions and abusive landlords.\n\nFull letter: https://www.livingrent.org/rogue_landlords_open_letter",
		},

		// X (short, punchy)
		{
			key: "x",
			label: "X",
			useImage: true,
			message:
				"BREAKING! 📢 Living Rent Leith has delivered an open letter demanding real action on rogue landlords.\n\n20+ organisations have joined the call for the council to finally use its powers to protect tenants from unsafe housing, illegal evictions and abusive landlords.\n\nRead the letter: https://www.livingrent.org/rogue_landlords_open_letter",
		},

		// BLUESKY (similar to X but slightly longer tone allowed)
		{
			key: "bluesky",
			label: "Bluesky",
			useImage: false,
			message:
				"BREAKING! 📢 Today, Living Rent Leith delivered an open letter demanding the council act on rogue landlords.\n\nOver 20 trade unions, charities and community organisations have signed on, calling for proper enforcement to protect tenants from unsafe conditions and illegal evictions.\n\nFull letter: https://www.livingrent.org/rogue_landlords_open_letter",
		},

		// FACEBOOK (longer, narrative-friendly)
		{
			key: "facebook",
			label: "Facebook",
			useImage: true,
			message:
				"BREAKING! 📢\n\nToday members of Living Rent Leith delivered an open letter to senior councillors, calling on the City of Edinburgh Council to finally crack down on rogue landlords who flout the law.\n\nThe letter is backed by over 20 trade unions, charities and community organisations — all demanding the council better use the powers it already has to protect tenants from unsafe conditions, illegal evictions, rent hikes and abusive landlord behaviour.\n\nRead the full letter and add your voice:\nhttps://www.livingrent.org/rogue_landlords_open_letter",
			link: "https://www.facebook.com/",
		},

		// INSTAGRAM (short, CTA, assumes image carries some content)
		{
			key: "instagram",
			label: "Instagram",
			useImage: true,
			message:
				"BREAKING! 📢 Today, Living Rent Leith delivered an open letter demanding the council take real action against rogue landlords.\n\n20+ unions and community groups are backing the call for stronger enforcement to protect tenants.\n\nFull letter in bio or at: livingrent.org/rogue_landlords_open_letter",
			link: "https://instagram.com/",
		},
	],
};
