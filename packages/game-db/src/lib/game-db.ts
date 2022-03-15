import { mockGameDb } from "./mock-game-db";

export * from "./mock-game-db";
export * as IdManager from "./id-manager";
export * from "./model";

export type GameDb = ReturnType<typeof mockGameDb>;