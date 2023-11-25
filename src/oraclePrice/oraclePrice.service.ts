import { Injectable } from "@nestjs/common";
import axios from "axios";
import type { IListenToOraclePrice } from "./oraclePrice.interface";

@Injectable()
export class OraclePriceService {
  async listenToOraclePrice({
    request,
    oraclePriceContract,
  }: IListenToOraclePrice) {
    try {
      const oracleValue = await axios.get(request.url); // to be an Price call later
      if (!oracleValue.data) {
        console.error(oracleValue.status);
        return;
      }
      const tx = await (
        await oraclePriceContract["setOracleResult"](
          request.id,
          request.url,
          JSON.stringify(oracleValue.data),
        )
      ).wait();
      console.log(
        `The Oracle price transaction hash ${
          tx.hash
        } in ${new Date().toISOString()}}`,
      );
    } catch (error) {
      console.error(error);
    }
  }
}
