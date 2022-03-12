import { udpHandler } from "./app/udpHandler";
import { createDeps } from "./deps";
import { environment } from "./environments/environment";

(async () => {
    const deps = await createDeps();
    const server = udpHandler(deps, "127.0.0.1", environment.port);
    server.listen();
})()