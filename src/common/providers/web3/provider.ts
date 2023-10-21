import { ethers } from 'ethers';

export const provider = new ethers.JsonRpcProvider(
  'https://rpc.topos-subnet.testnet-1.topos.technology',
);
