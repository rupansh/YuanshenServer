import { RegionInfo, RegionSimpleInfo } from "@ysparadox/ysproto";
import { DispatchConfig } from "./dispatch-query";


export const defaultDispatchConfig: DispatchConfig = {
    dispatchHost: "localhost",
    gateServerIp: "127.0.0.1",
    dispatchPort: 80,
    gateServerPort: 4242
};

export function regionSimpleInfo(conf: DispatchConfig): RegionSimpleInfo {
    return {
        name: "ysparadox",
        title: "YuanShen Paradox",
        type: "DEV_PUBLIC",
        dispatchUrl: `http://${conf.dispatchHost}:${conf.dispatchPort}/query_cur_region`
    }
}

export function regionInfo(key: Buffer, conf: DispatchConfig): RegionInfo {
    return RegionInfo.create({
        gateserverIp: conf.gateServerIp,
        gateserverPort: conf.gateServerPort,
        secretKey: key,
    });
}

const clientCustomConfigJson = {
    "sdkenv": "2", "checkdevice": "false", "loadPatch": "false",
    "showexception": "false", "regionConfig": "pm|fk|add",
    "downloadMode": "0"
};

export const clientCustomConfig = Buffer.from(JSON.stringify(clientCustomConfigJson));

export function regionCustomConfig(conf: DispatchConfig) {
    const regionCustomConfigJson = {
        "coverSwitch": ["8"],
        "perf_report_config_url": `http://${conf.dispatchHost}:${conf.dispatchPort}/config/verify`,
        "perf_report_record_url": `http://${conf.dispatchHost}:${conf.dispatchPort}/dataUpload`
    }

    return Buffer.from(JSON.stringify(regionCustomConfigJson));
}