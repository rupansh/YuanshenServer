import { DispatchQuerySvc } from "@ysparadox/dispatch-ints";
import { ysXor } from "@ysparadox/yscrypt";
import { QueryCurrRegionHttpRsp, QueryRegionListHttpRsp } from "@ysparadox/ysproto";
import { clientCustomConfig, defaultDispatchConfig, regionCustomConfig, regionInfo, regionSimpleInfo } from "./payloads";

export type DispatchKeys = {
  xorKey: Buffer,
  ec2b: Buffer
};

export type DispatchConfig = {
  dispatchHost: string,
  gateServerIp: string,
  dispatchPort: number,
  gateServerPort: number
}

export function dispatchQueryHandlers(keys: DispatchKeys, config = defaultDispatchConfig): DispatchQuerySvc {
  return {
    querySecurityFile() {
      return "";
    },
    queryRegionList() {
      const regInf = regionSimpleInfo(config);

      const clientCustomConfigEnc = Buffer.from(clientCustomConfig);
      ysXor(keys.xorKey, clientCustomConfigEnc);
  
      const regionList = QueryRegionListHttpRsp.create({
        regionList: [regInf],
        enableLoginPc: true,
        clientSecretKey: keys.ec2b,
        clientCustomConfigEncrypted: clientCustomConfigEnc,
      });

      return Buffer.from(QueryRegionListHttpRsp.toBinary(regionList)).toString("base64");
    },
    queryCurRegion() {
      const regInf = regionInfo(keys.xorKey, config);

      const regionCustomConfigEnc = regionCustomConfig(config);
      ysXor(keys.ec2b, regionCustomConfigEnc);

      const regionConfig = QueryCurrRegionHttpRsp.create({
        regionInfo: regInf,
        clientSecretKey: keys.xorKey,
        regionCustomConfigEncrypted: regionCustomConfigEnc
      });

      return Buffer.from(QueryCurrRegionHttpRsp.toBinary(regionConfig)).toString("base64");
    }
  }
}