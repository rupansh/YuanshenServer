import { combineRoutes, r } from "@marblejs/http";
import { bodyParser$ } from "@marblejs/middleware-body";
import { requestValidator$ } from "@marblejs/middleware-io";
import { ActionToCheck } from "@ysparadox/dispatch-ints";
import { map } from "rxjs";
import { genServiceGetter } from "./utils";

const getRiskySvc = genServiceGetter('risky');

const postCheck$ = r.pipe(
    r.matchPath("/check"),
    r.matchType("POST"),
    r.useEffect((req$, ctx) => req$.pipe(
        requestValidator$({ body: ActionToCheck }),
        map((data) => ({ body: getRiskySvc(ctx).check(data.body) }))
    ))
)

export const risky$ = combineRoutes("/account/risky/api", {
    middlewares: [bodyParser$()],
    effects: [postCheck$]
});