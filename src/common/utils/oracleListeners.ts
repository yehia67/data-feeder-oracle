import type { BaseContract, Log, ethers } from "ethers";
import { OracleType } from "src/interfaces";

interface IOracleListeners {
  oracleApiContract: BaseContract;
  oraclePriceContract: BaseContract;
  fromBlock: number;
  toBlock: number;
}
interface OracleListenersResponse {
  event: Log | ethers.EventLog;
  oracleType: OracleType;
}
export const oracleListeners = async ({
  oracleApiContract,
  oraclePriceContract,
  fromBlock,
  toBlock,
}: IOracleListeners): Promise<OracleListenersResponse[]> => {
  const oracleApiEventFilter: ethers.DeferredTopicFilter =
    oracleApiContract.filters.OracleRequested();

  const oraclePriceEventFilter: ethers.DeferredTopicFilter =
    oraclePriceContract.filters.OracleRequested();

  const [[oracleApi], [oraclePrice]]: [
    (Log | ethers.EventLog)[],
    (Log | ethers.EventLog)[],
  ] = await Promise.all([
    oracleApiContract.queryFilter(oracleApiEventFilter, fromBlock, toBlock),
    oraclePriceContract.queryFilter(oraclePriceEventFilter, fromBlock, toBlock),
  ]);
  const oracleListenerResponse: OracleListenersResponse[] = [];
  if (oracleApi) {
    oracleListenerResponse.push({ event: oracleApi, oracleType: "OracleApi" });
  }
  if (oraclePrice) {
    oracleListenerResponse.push({
      event: oraclePrice,
      oracleType: "OraclePrice",
    });
  }
  return oracleListenerResponse;
};
