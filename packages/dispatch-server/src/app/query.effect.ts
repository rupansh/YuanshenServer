import { combineRoutes, r } from "@marblejs/http";
import { map } from "rxjs";
import { genServiceGetter } from "./utils";

const getQuerySvc = genServiceGetter('query');

const getSecurityFile$ = r.pipe(
    r.matchPath("/query_security_file"),
    r.matchType("GET"),
    r.useEffect((req$, ctx) => req$.pipe(
        map(() => ({ body: getQuerySvc(ctx).querySecurityFile() }))
    ))
);

const getRegionList$ = r.pipe(
    r.matchPath("/query_region_list"),
    r.matchType("GET"),
    r.useEffect((req$, ctx) => req$.pipe(
        map(() => ({ body: getQuerySvc(ctx).queryRegionList() }))
    ))
);

const getCurRegion$ = r.pipe(
    r.matchPath("/query_cur_region"),
    r.matchType("GET"),
    r.useEffect((req$, ctx) => req$.pipe(
        map(() => ({ body: getQuerySvc(ctx).queryCurRegion() }))
    ))
);

export const query$ = combineRoutes('/', [
    getSecurityFile$,
    getRegionList$,
    getCurRegion$
]);