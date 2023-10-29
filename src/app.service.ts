import { Inject, Injectable } from "@nestjs/common";
import { Contract, ethers } from "ethers";

import { BATCH_SIZE, OracleApi } from "./common/constants";
import { provider } from "./common/providers/web3";
import { randomUUID } from "crypto";
import { IApiOracle } from "./interfaces";
import { oracleListeners } from "./common/utils";
import { OracleApiService } from "./oracleApi/oracleApi.service";

@Injectable()
export class AppService {
  @Inject(OracleApiService)
  private readonly oracleApiService: OracleApiService;
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

    this.onRandomOracle()
      .catch((error) => console.error(`Error on ${Date.now()} reason`, error))
      .finally(function () {
        this.onRandomOracle();
      });
  }

  async onRandomOracle() {
    // Populate requests queue
    const requestsQueue: IApiOracle[] = [];
    let fromBlock = 0;
    while (true) {
      const toBlock = await provider.getBlockNumber();
      fromBlock = fromBlock || toBlock;
      const oracleEvents = await oracleListeners({
        toBlock,
        fromBlock,
        oracleContract: this.oracleContract.connect(this.signer),
      });

      if (oracleEvents.length) {
        oracleEvents.forEach(({ event, oracleType }) => {
          if (oracleType === "OracleApi") {
            requestsQueue.push({
              id: (event as ethers.EventLog).args[0],
              url: (event as ethers.EventLog).args[2],
              oracleType,
            });
          }
        });
      }
      // Poll and process requests queue at intervals
      let processedRequests = 0;

      while (requestsQueue.length > 0 && processedRequests < BATCH_SIZE) {
        try {
          const request = requestsQueue.shift();
          if (request.oracleType === "OracleApi") {
            this.oracleApiService.listenToOracleApi({
              request,
              oracleApiContract: this.oracleContract.connect(this.signer),
            });
          }

          fromBlock = toBlock;
          processedRequests++;
        } catch (error) {
          console.error(error);
        }
      }
      await new Promise((r) => setTimeout(r, 10000));
    }
  }
}
