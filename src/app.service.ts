import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { BATCH_SIZE, MAX_RETRIES, SLEEP_TIME } from './common/constants';
import { provider } from './common/providers/web3';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getRandomNumber() {
    // Initialize contract
    const oracleContractAddress = 'ORACLE-CONTRACT-ADDRESS-HERE';
    const oracleContractABI = []; // abi to be added
    const oracleContract = new ethers.Contract(
      oracleContractAddress,
      oracleContractABI,
      provider,
    );

    // Populate requests queue
    const requestsQueue = [];

    oracleContract.on('RandomNumberRequested', async (callerAddress, id) => {
      requestsQueue.push({ callerAddress, id });
    });

    // Poll and process requests queue at intervals
    setInterval(async () => {
      let processedRequests = 0;

      while (requestsQueue.length > 0 && processedRequests < BATCH_SIZE) {
        const request = requestsQueue.shift();

        let retries = 0;
        while (retries < MAX_RETRIES) {
          try {
            const randomNumber = await this.getRandomNumber();

            await oracleContract.returnRandomNumber(
              randomNumber,
              request.callerAddress,
              request.id,
            );
            break;
          } catch (error) {
            retries++;
          }
        }

        processedRequests++;
      }
    }, SLEEP_TIME);
  }
}
