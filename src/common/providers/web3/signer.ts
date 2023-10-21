import { ServiceUnavailableException } from '@nestjs/common';
import { ContractTransactionResponse, ethers, Interface } from 'ethers';
import { ITransactionSubmitter, ContractName } from 'src/interfaces/web3';
import { provider } from './provider';

export const transactionSubmitter = async ({
  privateKey,
  contractAddress,
  transactionName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contractName,
  args,
}: ITransactionSubmitter): Promise<ContractTransactionResponse | null> => {
  try {
    const signer = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(contractAddress, []); // abi to be added
    return await contract.connect(signer)[transactionName](...args);
  } catch (error) {
    const errorMsg = `${error}`;
    console.log(`error message is`, errorMsg);

    throw new ServiceUnavailableException(errorMsg);
  }
};
