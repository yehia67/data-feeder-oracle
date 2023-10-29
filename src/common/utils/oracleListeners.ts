import type { BaseContract, Log, ethers } from "ethers";
import { OracleType } from "src/interfaces";

interface IOracleListeners {
  oracleContract: BaseContract;
  fromBlock: number;
  toBlock: number;
}
interface OracleListenersResponse {
  event: Log | ethers.EventLog;
  oracleType: OracleType;
}
export const oracleListeners = async ({
  oracleContract,
  fromBlock,
  toBlock,
}: IOracleListeners): Promise<OracleListenersResponse[]> => {
  const eventFilter: ethers.DeferredTopicFilter =
    oracleContract.filters.OracleRequested();
  const [[oracleApi]]: [(Log | ethers.EventLog)[]] = await Promise.all([
    oracleContract.queryFilter(eventFilter, fromBlock, toBlock),
  ]);
  const oracleListenerResponse: OracleListenersResponse[] = [];
  if (oracleApi) {
    oracleListenerResponse.push({ event: oracleApi, oracleType: "OracleApi" });
  }
  return oracleListenerResponse;
};
