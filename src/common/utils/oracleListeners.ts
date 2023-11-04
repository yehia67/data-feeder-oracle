import type { BaseContract, Log, ethers } from "ethers";
import { OracleType } from "src/interfaces";

interface IOracleListeners {
  oracleApiContract: BaseContract;
  oraclePriceContract: BaseContract;
  oraclePokemonContract: BaseContract;
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
  oraclePokemonContract,
  fromBlock,
  toBlock,
}: IOracleListeners): Promise<OracleListenersResponse[]> => {
  const oracleApiEventFilter: ethers.DeferredTopicFilter =
    oracleApiContract.filters.OracleRequested();

  const oraclePriceEventFilter: ethers.DeferredTopicFilter =
    oraclePriceContract.filters.OracleRequested();

  const oraclePokemonEventFilter: ethers.DeferredTopicFilter =
    oraclePokemonContract.filters.OracleRequested();

  const [[oracleApi], [oraclePrice], [oraclePokemon]]: [
    (Log | ethers.EventLog)[],
    (Log | ethers.EventLog)[],
    (Log | ethers.EventLog)[],
  ] = await Promise.all([
    oracleApiContract.queryFilter(oracleApiEventFilter, fromBlock, toBlock),
    oraclePriceContract.queryFilter(oraclePriceEventFilter, fromBlock, toBlock),
    oraclePokemonContract.queryFilter(
      oraclePokemonEventFilter,
      fromBlock,
      toBlock,
    ),
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

  if (oraclePokemon) {
    oracleListenerResponse.push({
      event: oraclePokemon,
      oracleType: "OraclePokemon",
    });
  }
  return oracleListenerResponse;
};
