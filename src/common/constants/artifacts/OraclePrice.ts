import { BaseOracle } from "./BaseOracle";

export const OraclePrice = Object.freeze({
  address: "0x1e2928B34D1E4D46aBC1b5D497fFdaB5459A0bbA",
  abis: [
    ...BaseOracle.abi,
    {
      inputs: [
        {
          internalType: "string",
          name: "fiatSymbol",
          type: "string",
        },
        {
          internalType: "string",
          name: "ccSymbol",
          type: "string",
        },
      ],
      name: "requestOracle",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "fiatSymbol",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "ccValue",
          type: "uint256",
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
          name: "fiatName",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "cryptoValue",
          type: "uint256",
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
          name: "fiatSymbol",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "ccSymbol",
          type: "string",
        },
      ],
      name: "OracleRequested",
      type: "event",
    },
  ],
});
