import * as t from "io-ts";

export const MinorApiLogData = t.type({
    data: t.string
});

export type MinorApiLogData = t.TypeOf<typeof MinorApiLogData>;

export type DispathcMiscSvc = {
    h5LogBatch: (data: MinorApiLogData) => string;
    getAgreementInfos: (data: void) => string;
    versionData: string;
}