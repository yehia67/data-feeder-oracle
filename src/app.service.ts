import { Injectable } from "@nestjs/common";
import { Contract, ethers } from "ethers";

import { BATCH_SIZE, RAND_CALLER, RandOracles } from "./common/constants";
import { provider } from "./common/providers/web3";
import { randomUUID } from "crypto";

@Injectable()
export class AppService {
  generateApiKey() {
    return { message: `Welcome to data feeder Oracle`, apiKey: randomUUID() };
  }
  private oracleContract: Contract;
  private signer: ethers.Wallet;
  constructor() {
    this.oracleContract = new ethers.Contract(
      RandOracles.address,
      RandOracles.abis,
      provider,
    );
    this.signer = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, provider);

    this.onRandomOracle();
  }

  async onRandomOracle() {
    const eventFilter: ethers.DeferredTopicFilter =
      this.oracleContract.filters.RandomNumberRequested();
    // Populate requests queue
    const requestsQueue = [];
    while (true) {
      const latestBlock = await provider.getBlockNumber();

      const [event] = (await this.oracleContract.queryFilter(
        eventFilter,
        latestBlock,
        latestBlock,
      )) as ethers.EventLog[];

      if (event) {
        const tx = await event.getTransaction();
        requestsQueue.push({ callerAddress: tx.from, id: event.args[0] });
      }
      // Poll and process requests queue at intervals
      let processedRequests = 0;

      while (requestsQueue.length > 0 && processedRequests < BATCH_SIZE) {
        try {
          const request = requestsQueue.shift();

          const randomNumber = Math.floor(Math.random()); // to be an api call later
          const tx = await (
            await this.oracleContract
              .connect(this.signer)
              ["returnRandomNumber"](randomNumber, RAND_CALLER, request.id)
          ).wait();
          console.log({ tx });

          processedRequests++;
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}
