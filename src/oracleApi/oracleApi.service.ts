import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import axios from "axios";
import {
  IListenToApiOracle,
  IListenToPokemonOracle,
  IListenToPriceOracle,
} from "./oracleApi.interface";
import { parseUnits } from "ethers";

@Injectable()
export class OracleApiService {
  async listenToOracleApi({ request, oracleContract }: IListenToApiOracle) {
    try {
      const oracleValue = await axios.get(request.url); // to be an api call later
      if (!oracleValue.data) {
        throw new ServiceUnavailableException(oracleValue.status);
      }
      console.log({ response: oracleValue.data });
      const tx = await (
        await oracleContract["setOracleResult"](
          request.id,
          request.url,
          JSON.stringify(oracleValue.data),
        )
      ).wait();
      console.log({ tx });
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async listenToOraclePrice({ request, oracleContract }: IListenToPriceOracle) {
    try {
      const oracleValue = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${request.ccSymbol}&vs_currencies=${request.fiatSymbol}`,
      ); // to be an api call later

      if (!oracleValue.data) {
        throw new ServiceUnavailableException(oracleValue.status);
      }

      console.log({ response: oracleValue.data });

      const tx = await (
        await oracleContract["setOracleResult"](
          request.id,
          request.fiatSymbol,
          parseUnits(
            oracleValue.data[request.ccSymbol][request.fiatSymbol].toString(),
            6,
          ),
        )
      ).wait();
      console.log({ tx });
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

      const tx = await (
        await oracleContract["setOracleResult"](
          request.id,
          request.submitter,
          oracleValue,
        )
      ).wait();
      console.log({ tx });
    } catch (error) {
      console.error(error);
    }
  }
}
