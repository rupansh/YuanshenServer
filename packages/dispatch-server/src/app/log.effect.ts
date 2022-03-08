import { combineRoutes, r } from "@marblejs/http";
import { bodyParser$, rawParser } from "@marblejs/middleware-body";
import { map } from "rxjs";
import { genServiceGetter } from "./utils";

const getLogSvc = genServiceGetter('loggerSvc');

const rawBodyParser$ = bodyParser$({
    parser: rawParser,
    type: ['application/octet-stream']
});

const postLogSdk$ = r.pipe(
    r.matchPath("/log/sdk/upload"),
    r.matchType("POST"),
    r.useEffect((req$, ctx) => req$.pipe(
        map((data) => ({ body: getLogSvc(ctx).logSdk(data.body as Buffer) }))
    ))
);

const postSdk$ = r.pipe(
    r.matchPath("/sdk/dataUpload"),
    r.matchType("POST"),
    r.useEffect((req$, ctx) => req$.pipe(
        map((data) => ({ body: getLogSvc(ctx).sdk(data.body as Buffer) }))
    ))
);

const postCrash$ = r.pipe(
    r.matchPath("/crash/dataUpload"),
    r.matchType("POST"),
    r.useEffect((req$, ctx) => req$.pipe(
        map((data) => ({ body: getLogSvc(ctx).crash(data.body as Buffer) }))
    ))
);

export const log$ = combineRoutes("/", {
    middlewares: [rawBodyParser$],
    effects: [postLogSdk$, postSdk$, postCrash$]
})