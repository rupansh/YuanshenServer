import * as t from "io-ts";

export const TokenToVerify = t.type({
    uid: t.string,
    token: t.string
});

export type TokenToVerify = t.TypeOf<typeof TokenToVerify>;

export const LoginData = t.type({
    account: t.string,
    is_crypto: t.boolean,
    password: t.string
});

export type LoginData = t.TypeOf<typeof LoginData>;

export type DispatchShieldSvc = {
    login: (data: LoginData) => string;
    verify: (data: TokenToVerify) => string;
    loadConfig: (data: void) => string;
};