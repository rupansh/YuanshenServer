import * as t from "io-ts";

export const GranterData = t.type({
    app_id: t.union([t.number, t.string]),
    channel_id: t.union([t.number, t.string]),
    device: t.string,
    sign: t.string,
    data: t.string
});

export type GranterData = t.TypeOf<typeof GranterData>;

export type DispatchComboSvc = {
    login: (data: GranterData) => string;
    getConfig: (data: void) => string;
    compareProtocolVersion: (data: void) => string;
    combo: (data: void) => string;
};