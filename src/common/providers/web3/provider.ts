import { ethers } from "ethers";

export const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.topos-subnet.testnet-1.topos.technology",
);
