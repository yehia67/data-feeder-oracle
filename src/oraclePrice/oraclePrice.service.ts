import { Injectable, ServiceUnavailableException } from "@nestjs/common";
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
        throw new ServiceUnavailableException(oracleValue.status);
      }
      console.log({ response: oracleValue.data });
      const tx = await (
        await oraclePriceContract["setOracleResult"](
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
}
