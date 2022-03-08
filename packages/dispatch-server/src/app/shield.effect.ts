import { combineRoutes, r } from "@marblejs/http";
import { requestValidator$ } from "@marblejs/middleware-io";
import { LoginData, TokenToVerify } from "@ysparadox/dispatch-ints";
import { map } from "rxjs";
import { genServiceGetter } from "./utils";

const getShieldSvc = genServiceGetter('shield');

const postVerify$ = r.pipe(
    r.matchPath("/verify"),
    r.matchType("POST"),
    r.useEffect((req$, ctx) => req$.pipe(
        requestValidator$({ body: TokenToVerify }),
        map((dat) => ({ body: getShieldSvc(ctx).verify(dat.body) }))
    ))
)

const postLogin$ = r.pipe(
    r.matchPath("/login"),
    r.matchType("POST"),
    r.useEffect((req$, ctx) => req$.pipe(
        requestValidator$({ body: LoginData }),
        map((dat) => ({ body: getShieldSvc(ctx).login(dat.body) }))
    ))
)

const getLoadConfig$ = r.pipe(
    r.matchPath("/loadConfig"),
    r.matchType("GET"),
    r.useEffect((req$, ctx) => req$.pipe(
        map(() => ({ body: getShieldSvc(ctx).loadConfig() }))
    ))
)

export const shield$ = combineRoutes("/h4ke_global/mdk/shield/api", [
    postVerify$,
    postLogin$,
    getLoadConfig$
]);