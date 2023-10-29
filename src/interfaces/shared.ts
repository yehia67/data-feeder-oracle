export type OracleType = "OracleApi";

export interface IApiOracle {
  id: string;
  url: string;
  oracleType: OracleType;
}
