import { Inject, Injectable } from "@nestjs/common";
import { ethers } from "ethers";

import { BATCH_SIZE, OracleApi } from "./common/constants";
import { provider } from "./common/providers/web3";
import { randomUUID } from "crypto";
import { IApiOracle, IOraclePrice, IOracleRequest } from "./interfaces";
import { oracleListeners } from "./common/utils";
import { OracleApiService } from "./oracleApi/oracleApi.service";
import { OraclePrice } from "./common/constants/artifacts/OraclePrice";

@Injectable()
export class AppService {
  @Inject(OracleApiService)
  private readonly oracleApiService: OracleApiService;
  generateApiKey() {
    return { message: `Welcome to data feeder Oracle`, apiKey: randomUUID() };
  }

  constructor() {
    const onRandomOracleRef = this.onRandomOracle;
    this.onRandomOracle()
      .catch((error) => console.error(`Error on ${Date.now()} reason`, error))
      .finally(function () {
        onRandomOracleRef();
      });
  }

  async onRandomOracle() {
    // Populate requests queue
    const requestsQueue: IOracleRequest[] = [];
    let fromBlock = 0;
    const signer = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, provider);

    const oracleApiContract = new ethers.Contract(
      OracleApi.address,
      OracleApi.abis,
      signer,
    );

    const oraclePriceContract = new ethers.Contract(
      OraclePrice.address,
      OraclePrice.abis,
      signer,
    );
    while (true) {
      const toBlock = await provider.getBlockNumber();
      fromBlock = fromBlock || toBlock;
      const oracleEvents = await oracleListeners({
        toBlock,
        fromBlock,
        oracleApiContract,
        oraclePriceContract,
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
          if (oracleType === "OraclePrice") {
            requestsQueue.push({
              id: (event as ethers.EventLog).args[0],
              fiatSymbol: (event as ethers.EventLog).args[2],
              ccSymbol: (event as ethers.EventLog).args[3],
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
              request: request as IApiOracle,
              oracleContract: oracleApiContract,
            });
          }
          if (request.oracleType === "OraclePrice") {
            this.oracleApiService.listenToOraclePrice({
              request: request as IOraclePrice,
              oracleContract: oraclePriceContract,
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
