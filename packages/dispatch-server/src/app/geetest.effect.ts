import { combineRoutes, r } from "@marblejs/http";
import { requestValidator$ } from "@marblejs/middleware-io";
import { GeetestAjaxData, GeetestGetData, GeetestGetTypeData } from "@ysparadox/dispatch-ints";
import { map } from "rxjs";
import { genServiceGetter } from "./utils";

const getGeeTestSvc = genServiceGetter('geetest');

const get$ = r.pipe(
    r.matchPath("/get.php"),
    r.matchType("GET"),
    r.useEffect((req$, ctx) => req$.pipe(
        requestValidator$({ query: GeetestGetData }),
        map((data) => ({ body: getGeeTestSvc(ctx).get(data.query) }))
    ))
);

const getType$ = r.pipe(
    r.matchPath("/gettype.php"),
    r.matchType("GET"),
    r.useEffect((req$, ctx) => req$.pipe(
        requestValidator$({ query: GeetestGetTypeData }),
        map((data) => ({ body: getGeeTestSvc(ctx).getType(data.query) }))
    ))
);

const getAjax$ = r.pipe(
    r.matchPath("/ajax.php"),
    r.matchType("GET"),
    r.useEffect((req$, ctx) => req$.pipe(
        requestValidator$({ query: GeetestAjaxData }),
        map((data) => ({ body: getGeeTestSvc(ctx).ajaxGet(data.query) }))
    ))
);

const postAjax$ = r.pipe(
    r.matchPath("/ajax.php"),
    r.matchType("POST"),
    r.useEffect((req$, ctx) => req$.pipe(
        requestValidator$({ body: GeetestAjaxData }),
        map((data) => ({ body: getGeeTestSvc(ctx).ajaxPost(data.body) }))
    ))
);

export const geetest$ = combineRoutes("/", [
    get$,
    getType$,
    getAjax$,
    postAjax$
]);