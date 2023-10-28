import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { Contract, ethers } from "ethers";

import { BATCH_SIZE, OracleApi } from "./common/constants";
import { provider } from "./common/providers/web3";
import { randomUUID } from "crypto";
import axios from "axios";
import { IApiOracle } from "./interfaces";

@Injectable()
export class AppService {
  generateApiKey() {
    return { message: `Welcome to data feeder Oracle`, apiKey: randomUUID() };
  }
  private oracleContract: Contract;
  private signer: ethers.Wallet;
  constructor() {
    this.oracleContract = new ethers.Contract(
      OracleApi.address,
      OracleApi.abis,
      provider,
    );
    this.signer = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, provider);

    this.onRandomOracle();
  }

  async onRandomOracle() {
    const eventFilter: ethers.DeferredTopicFilter =
      this.oracleContract.filters.OracleRequested();
    // Populate requests queue
    const requestsQueue: IApiOracle[] = [];
    while (true) {
      const latestBlock = await provider.getBlockNumber();

      const [event] = (await this.oracleContract.queryFilter(
        eventFilter,
        latestBlock,
        latestBlock,
      )) as ethers.EventLog[];

      if (event) {
        const tx = await event.getTransaction();
        requestsQueue.push({
          callerAddress: tx.from,
          id: event.args[0],
          url: event.args[2],
        });
      }
      // Poll and process requests queue at intervals
      let processedRequests = 0;

      while (requestsQueue.length > 0 && processedRequests < BATCH_SIZE) {
        try {
          const request = requestsQueue.shift();

          const oracleValue = await axios.get(request.url); // to be an api call later
          if (!oracleValue.data) {
            throw new ServiceUnavailableException(oracleValue.status);
          }
          console.log({ response: oracleValue.data });
          const tx = await (
            await this.oracleContract
              .connect(this.signer)
              ["setOracleResult"](
                request.id,
                request.url,
                JSON.stringify(oracleValue.data),
              )
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
