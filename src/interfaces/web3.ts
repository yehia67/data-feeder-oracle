export enum ContractName {
  Oracle = 'Oracle',
}
export enum TransactionNames {
  Request = 'Request',
}
export interface ITransactionSubmitter {
  contractName: ContractName;
  transactionName: TransactionNames;
  privateKey: string;
  contractAddress: string;
  args: unknown[];
}
