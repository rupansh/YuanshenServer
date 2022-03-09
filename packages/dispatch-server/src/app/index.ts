import { createServer } from "@marblejs/http"
import { bindEagerlyTo, createContextToken } from "@marblejs/core";
import { listener } from "./http.listener";
import { deps, Deps } from "../deps";
import { environment } from "../environments/environment";

export const SvcsToken = createContextToken<Deps>('Deps');

export const main = async () =>  {
    const server = await createServer({
        port: environment.port,
        listener,
        dependencies: [
            bindEagerlyTo(SvcsToken)(async () => await deps())
        ]
    })

    await server();
};