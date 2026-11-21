import React, { useMemo, useState } from "react";
import { CampaignStoreContext } from "./campaignStoreContextValue";
import { campaigns as seedCampaigns } from "../data/campaigns";

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
      : undefined,
  };
}

export function CampaignStoreProvider({ children }) {
  const [campaigns, setCampaigns] = useState(() => seedCampaigns.map(cloneCampaign));

  const value = useMemo(
    () => ({
      campaigns,
      getCampaignBySlug(slug) {
        return campaigns.find((campaign) => campaign.slug === slug);
      },
      createCampaign(campaign) {
        setCampaigns((current) => [cloneCampaign(campaign), ...current]);
      },
      updateCampaign(campaignId, campaign) {
        setCampaigns((current) =>
          current.map((item) =>
            item.id === campaignId ? cloneCampaign(campaign) : item
          )
        );
      },
      deleteCampaign(campaignId) {
        setCampaigns((current) =>
          current.filter((campaign) => campaign.id !== campaignId)
        );
      },
    }),
    [campaigns]
  );

  return (
    <CampaignStoreContext.Provider value={value}>
      {children}
    </CampaignStoreContext.Provider>
  );
}
