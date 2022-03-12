import { networkServer } from "./app";
import { environment } from "./environments/environment";

const server = networkServer("127.0.0.1", environment.port);
server.listen();