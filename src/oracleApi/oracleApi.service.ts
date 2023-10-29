import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import axios from "axios";
import { IListenToOracleApi } from "./oracleApi.interface";

@Injectable()
export class OracleApiService {
  async listenToOracleApi({ request, oracleApiContract }: IListenToOracleApi) {
    try {
      const oracleValue = await axios.get(request.url); // to be an api call later
      if (!oracleValue.data) {
        throw new ServiceUnavailableException(oracleValue.status);
      }
      console.log({ response: oracleValue.data });
      const tx = await (
        await oracleApiContract["setOracleResult"](
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
