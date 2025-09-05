import { getFullnodeUrl } from "@mysten/sui/client";
import {
  DEVNET_NFT_PACKAGE_ID,
  TESTNET_NFT_PACKAGE_ID,
  MAINNET_NFT_PACKAGE_ID,
} from "./constants";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        nftPackageId: DEVNET_NFT_PACKAGE_ID,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        nftPackageId: TESTNET_NFT_PACKAGE_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        nftPackageId: MAINNET_NFT_PACKAGE_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };