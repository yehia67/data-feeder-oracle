import { BaseOracle } from "./BaseOracle";

export const OracleApi = Object.freeze({
  address: "0x2EA2dEd6B1Aa3BBa7f932418c7Bf374df7206573",
  abis: [
    ...BaseOracle.abi,
    {
      inputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "url",
          type: "string",
        },
        {
          internalType: "string",
          name: "response",
          type: "string",
        },
      ],
      name: "setOracleResult",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "value",
          type: "string",
        },
      ],
      name: "OracleReturned",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "caller",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "url",
          type: "string",
        },
      ],
      name: "OracleRequested",
      type: "event",
    },
  ],
});
