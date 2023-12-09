import { Inject, Injectable } from "@nestjs/common";
import { ethers } from "ethers";

import { OracleApi } from "./common/constants";
import { provider } from "./common/providers/web3";
import { randomUUID } from "crypto";

import { OracleApiService } from "./oracleApi/oracleApi.service";
import { OraclePrice } from "./common/constants/artifacts/OraclePrice";
import { OraclePokemon } from "./common/constants/artifacts/OraclePokemon";

@Injectable()
export class AppService {
  @Inject(OracleApiService)
  private readonly oracleApiService: OracleApiService;
  generateApiKey() {
    return { message: `Welcome to data feeder Oracle`, apiKey: randomUUID() };
  }

  constructor() {
    try {
      this.onRandomOracle();
    } catch (error) {
      console.error(`Error on ${Date.now()} reason`, error);
      this.onRandomOracle();
    }
  }

  onRandomOracle() {
    console.log("Oracle start listening...");
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

    const oraclePokemonContract = new ethers.Contract(
      OraclePokemon.address,
      OraclePokemon.abis,
      signer,
    );

    oracleApiContract.on("OracleRequested", (id, caller, url) =>
      this.oracleApiService.listenToOracleApi({
        oracleContract: oracleApiContract,
        request: {
          id,
          url,
          oracleType: "OracleApi",
        },
      }),
    );

    oraclePriceContract.on(
      "OracleRequested",
      (id, caller, fiatSymbol, ccSymbol) =>
        this.oracleApiService.listenToOraclePrice({
          oracleContract: oraclePriceContract,
          request: {
            id,
            fiatSymbol,
            ccSymbol,
            oracleType: "OraclePrice",
          },
        }),
    );

    oraclePokemonContract.on("OracleRequested", async (id, submitter) => {
      this.oracleApiService.listenToOraclePokemon({
        oracleContract: oraclePokemonContract,
        request: {
          id,
          submitter,
          oracleType: "OraclePokemon",
        },
      });
    });
  }
}
