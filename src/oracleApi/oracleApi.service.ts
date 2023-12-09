import { Injectable } from "@nestjs/common";
import axios from "axios";
import {
  IListenToApiOracle,
  IListenToPokemonOracle,
  IListenToPriceOracle,
} from "./oracleApi.interface";
import { parseUnits } from "ethers/lib/utils";

@Injectable()
export class OracleApiService {
  async listenToOracleApi({ request, oracleContract }: IListenToApiOracle) {
    try {
      const oracleValue = await axios.get(request.url); // to be an api call later
      if (!oracleValue.data) {
        console.error(oracleValue.status);
        return;
      }
      const tx = await (
        await oracleContract["setOracleResult"](
          request.id,
          request.url,
          JSON.stringify(oracleValue.data),
        )
      ).wait();

      console.log(
        `The oracle API transaction hash ${
          tx.transactionHash
        } in ${new Date().toISOString()} with fetched data: \n\n ${JSON.stringify(
          oracleValue.data,
        )}`,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async listenToOraclePrice({ request, oracleContract }: IListenToPriceOracle) {
    try {
      const oracleValue = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${request.ccSymbol}&vs_currencies=${request.fiatSymbol}`,
      ); // to be an api call later

      if (!oracleValue.data) {
        console.error(oracleValue.status);
        return;
      }
      const tx = await (
        await oracleContract["setOracleResult"](
          request.id,
          request.fiatSymbol,
          parseUnits(
            Number(
              oracleValue.data[request.ccSymbol][request.fiatSymbol],
            ).toFixed(2),
            6,
          ),
        )
      ).wait();
      console.log(
        `The Oracle price transaction hash ${
          tx.transactionHash
        } in ${new Date().toISOString()} 1${request.ccSymbol}= ${
          oracleValue.data[request.ccSymbol][request.fiatSymbol]
        }${request.fiatSymbol} `,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async listenToOraclePokemon({
    request,
    oracleContract,
  }: IListenToPokemonOracle) {
    try {
      const randomPokemonId = Math.floor(Math.random() * 1017) + 1;

      const oracleValue = `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`;
      console.log("request", { request });
      const tx = await (
        await oracleContract["setOracleResult"](
          request.id,
          request.submitter,
          oracleValue,
        )
      ).wait();

      console.log(
        `The oracle pokemon transaction hash ${
          tx.transactionHash
        } in ${new Date().toISOString()} with pokemon data: \n\n ${JSON.stringify(
          oracleValue,
        )}`,
      );
    } catch (error) {
      console.error(error);
    }
  }
}
