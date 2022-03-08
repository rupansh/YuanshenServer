import { combineRoutes, r } from "@marblejs/http";
import { requestValidator$ } from "@marblejs/middleware-io";
import { GranterData } from "@ysparadox/dispatch-ints";
import { map } from "rxjs";
import { genServiceGetter } from "./utils";

const getComboSvc = genServiceGetter('combo');

const postLogin$ = r.pipe(
    r.matchPath("/login/v2/login"),
    r.matchType("POST"),
    r.useEffect((req$, ctx) => req$.pipe(
        requestValidator$({ body: GranterData }),
        map((data) => ({ body: getComboSvc(ctx).login(data.body) }))
    ))
);

const getConfig$ = r.pipe(
    r.matchPath("/getConfig"),
    r.matchType("GET"),
    r.useEffect((req$, ctx) => req$.pipe(
        map(() => ({ body: getComboSvc(ctx).getConfig() }))
    ))
);

const postCmpProtoVer$ = r.pipe(
    r.matchPath("/compareProtocolVersion"),
    r.matchType("POST"),
    r.useEffect((req$, ctx) => req$.pipe(
        map(() => ({ body: getComboSvc(ctx).compareProtocolVersion() }))
    ))
);

const api$ = combineRoutes('/api', [
    getConfig$,
    postCmpProtoVer$
]);

export const combo$ = combineRoutes('/hk4e_global/combo/granter', [
    postLogin$,
    api$
]);