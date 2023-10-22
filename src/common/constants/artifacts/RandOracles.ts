export const RandOracles = Object.freeze({
  address: "0x027d75ed5235693382fcd98389D71266e1493662",
  abis: [
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
