export const campaign = {
  title: "Rogue Landlords Report Launch",
  description:
    "Help spread the word about Living Rent's new report exposing rogue landlords in Leith.",
  url: "https://tenantact.org/rogue-landlords",
  image: "/sample-image.jpeg", // place in /public for dev
  variants: [
    {
      key: "whatsapp",
      label: "WhatsApp",
      type: "direct",
      useImage: false,
      message:
        "🚨 Living Rent exposes rogue landlords in Leith! Read and share the report: https://tenantact.org/rogue-landlords",
    },
    {
      key: "x",
      label: "X",
      type: "direct",
      useImage: true,
      message:
        "🚨 Living Rent exposes rogue landlords in Leith! https://tenantact.org/rogue-landlords",
    },
    {
      key: "bluesky",
      label: "Bluesky",
      type: "direct",
      useImage: false,
      message:
        "Living Rent exposes rogue landlords in Leith → https://tenantact.org/rogue-landlords",
    },
    {
      key: "facebook",
      label: "Facebook",
      type: "manual",
      useImage: true,
      message:
        "Living Rent exposes rogue landlords in Leith. Read and share the report: https://tenantact.org/rogue-landlords",
      link: "https://facebook.com/",
    },
    {
      key: "instagram",
      label: "Instagram",
      type: "manual",
      useImage: true,
      message:
        "Living Rent exposes rogue landlords in Leith. Read and share the report: https://tenantact.org/rogue-landlords",
      link: "https://instagram.com/",
    },
  ],
};
