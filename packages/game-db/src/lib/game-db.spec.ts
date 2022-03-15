import { gameDb } from "./game-db";

describe("gameDb", () => {
    it("should work", () => {
        expect(gameDb()).toEqual("game-db");
    });
});
