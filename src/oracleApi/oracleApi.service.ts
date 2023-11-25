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
      const tx = await (
        await oracleContract["setOracleResult"](
          request.id,
          request.url,
          JSON.stringify(oracleValue.data),
        )
      ).wait();
      console.log(
        `The oracle API transaction hash ${
          tx.hash
        } in ${new Date().toISOString()}}`,
      );
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
      console.log(
        `The Oracle price transaction hash ${
          tx.hash
        } in ${new Date().toISOString()}}`,
      );
    } catch (error) {
      console.error(error);
      throw new ServiceUnavailableException(error);
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
      console.log(
        `The oracle pokemon transaction hash ${
          tx.hash
        } in ${new Date().toISOString()}}`,
      );
    } catch (error) {
      console.error(error);
      throw new ServiceUnavailableException(error);
    }
  }
}

/*
cast send 0x229D068d763018B92E25107A49D61882eEa48898 "function requestOracle()"  --rpc-url https://rpc.topos-subnet.testnet-1.topos.technology --private-key 479c97cd694402864f4a5625951cb47dfac5c160ae56f3f00d86fe8735106d18 --legacy
The oracle pokemon transaction hash 0x67afcd96265f85516c09cb36a4162ad798bc3197d13cbb66c1a92f6621a2b386 in 2023-11-18T10:09:02.262Z}
The oracle pokemon transaction hash 0xcb07a9b7cea67d14a19b4d6efd0ed1283354273346ff260c8bd18ab3e618ad60 in 2023-11-18T10:09:13.480Z}
The oracle pokemon transaction hash 0xedecd252a8b92539bc7a9f670d5a96d0673b7edec53adeaebb2d5cd6adf09945 in 2023-11-18T10:09:23.973Z}
The oracle pokemon transaction hash 0x4e840c39d5cc887f00a45c87b77e71905c00ca067d07c4dea42cedb5329309cf in 2023-11-18T10:09:33.715Z}
The oracle pokemon transaction hash 0xce63edc533da4da81ef018783e04c46edd667cb1ab80b6c5d5562392c089f126 in 2023-11-18T10:09:45.428Z}
The oracle pokemon transaction hash 0x9dd121ed93d16d99313bd99cc91029d52ce88b88cbe4af193c19822e19217524 in 2023-11-18T10:09:55.763Z}
*/
