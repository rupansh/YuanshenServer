import { spawnGameServer } from "./app/game-server-spawner";
import { udpHandler } from "./app/udpHandler";
import { createDeps } from "./deps";
import { environment } from "./environments/environment";

(async () => {
    const deps = await createDeps();

    const server = udpHandler(deps, "0.0.0.0", environment.port);
    server.listen();
    spawnGameServer(deps.packetHandler);
})()