import { Server } from "@hapi/hapi";
import pingController from "../ping.controller";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
// import { describe } from "node:test";

describe("ping.controller", () => {
  // let server;
  let server: Server;
  beforeAll(async () => {
    server = new Server();
    await server.register([Inert, Vision]);
    server.route(pingController);
  });

  it("should responds with success for ping", async () => {
    const options = {
      method: "GET",
      url: `/ping`,
    };

    const response = await server.inject(options);
    expect(response.statusCode).toEqual(204);
  });
});

// describe("sum module", () => {
//   test("adds 1 + 2 to equal 3", () => {
//     expect(sum(1, 2)).toBe(3);
//   });
// });
