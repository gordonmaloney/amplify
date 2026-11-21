import { useContext } from "react";
import { CampaignStoreContext } from "./campaignStoreContextValue";

export function useCampaignStore() {
  const context = useContext(CampaignStoreContext);
  if (!context) {
    throw new Error("useCampaignStore must be used inside CampaignStoreProvider");
  }
  return context;
}
