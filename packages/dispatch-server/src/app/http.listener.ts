import { httpListener } from "@marblejs/http"
import { combo$ } from "./combo.effect";
import { geetest$ } from "./geetest.effect";
import { log$ } from "./log.effect";
import { misc$ } from "./misc.effect";
import { query$ } from "./query.effect";
import { risky$ } from "./risky.effect";
import { root$ } from "./root.effect";
import { shield$ } from "./shield.effect";

export const listener = httpListener({
    effects: [
        root$,
        query$,
        shield$,
        risky$,
        combo$,
        geetest$,
        misc$,
        log$
    ]
});