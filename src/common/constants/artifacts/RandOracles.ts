export const RandOracles = Object.freeze({
  address: "0x7d2fde48f4a7A8e309B9ed62a9a6a223b4dEbC34",
  abis: [
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_apiKey",
          type: "bytes32",
        },
      ],
      name: "addNewApiKey",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "apiLimit",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
          indexed: true,
        },
        {
          internalType: "address",
          name: "callerAddress",
          type: "address",
          indexed: false,
        },
      ],
      type: "event",
      name: "RandomNumberRequested",
      anonymous: false,
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "randomNumber",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "callerAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
      ],
      name: "returnRandomNumber",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
});
