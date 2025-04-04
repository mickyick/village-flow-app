
import { config } from "@onflow/fcl";

// Configure FCL for the Flow blockchain
export const initFlowConfig = () => {
  config()
    .put("app.detail.title", "Village App")
    .put("app.detail.icon", "/placeholder.svg")
    // Using Flow's testnet for development
    .put("accessNode.api", "https://rest-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
    // Enable hybrid auth (walletless onboarding)
    .put("discovery.authn.include", ["Blocto", "Lilico", "Dapper"]);
};
