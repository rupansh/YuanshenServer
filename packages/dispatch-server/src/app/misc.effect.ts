import { combineRoutes, r } from "@marblejs/http";
import { bodyParser$ } from "@marblejs/middleware-body";
import { requestValidator$ } from "@marblejs/middleware-io";
import { MinorApiLogData } from "@ysparadox/dispatch-ints";
import { map } from "rxjs";
import { genServiceGetter } from "./utils";

const getMiscSvc = genServiceGetter('misc');


const getAgreementInfo$ = r.pipe(
    r.matchPath("/hk4e_global/mdk/agreement/api/getAgreementInfo"),
    r.matchType("GET"),
    r.useEffect((req$, ctx) => req$.pipe(
        map(() => ({ body: getMiscSvc(ctx).getAgreementInfos() }))
    ))
);

const getVersionData$ = r.pipe(
    r.matchPath("/admin/mi18n/plat_oversea/m2020030410/m2020030410-version.json"),
    r.matchType("GET"),
    r.useEffect((req$, ctx) => req$.pipe(
        map(() => ({ body: getMiscSvc(ctx).versionData }))
    ))
);

const postH5Log$ = r.pipe(
    r.matchPath("/common/h5log/log/batch"),
    r.matchType("POST"),
    r.useEffect((req$, ctx) => req$.pipe(
        requestValidator$({ body: MinorApiLogData }),
        map(({ body }) => ({ body: getMiscSvc(ctx).h5LogBatch(body) }))
    ))
);

export const misc$ = combineRoutes("/", {
    middlewares: [bodyParser$()],
    effects: [
        getAgreementInfo$,
        getVersionData$,
        postH5Log$
    ]
});