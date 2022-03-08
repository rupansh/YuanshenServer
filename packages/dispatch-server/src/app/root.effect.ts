import { r } from "@marblejs/http";
import { map } from "rxjs";

export const root$ = r.pipe(
    r.matchPath('/'),
    r.matchType('GET'),
    r.useEffect(req$ => req$.pipe(
        map(() => ({}))
    ))
)