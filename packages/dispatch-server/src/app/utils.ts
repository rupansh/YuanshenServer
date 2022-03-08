import { EffectContext, useContext } from "@marblejs/core";
import { SvcsToken } from ".";
import { Deps } from "../deps";

export const genServiceGetter = <S extends keyof Deps>(svc: S) => function (ctx: EffectContext<unknown>): Deps[S] {
    return useContext(SvcsToken)(ctx.ask)[svc];
}