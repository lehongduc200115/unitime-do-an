// // import kafkaConsumer from '../common/kafkaConsumer';
// // import kafkaProducer from '../common/kafkaProducer';
// import logger from "../logger";
// import * as Server from "../server";

// jest.mock("../common/mongoDb", () => ({
//   connectMongo: jest.fn(),
// }));

// jest.mock("@hapi/hapi", () => {
//   const origin = jest.requireActual("@hapi/hapi");
//   class ServerMock extends origin.Server {
//     start = jest.fn();
//   }
//   return {
//     ...origin,
//     Server: ServerMock,
//   };
// });
// // jest.mock('../sampleResource/sampleResource.service');

// describe("Hapi server", () => {
//   beforeEach(() => {
//     // kafkaConsumer.connect = jest.fn().mockResolvedValueOnce({});
//     // kafkaProducer.connect = jest.fn().mockResolvedValueOnce({});
//   });
//   afterEach(() => {
//     jest.clearAllMocks();
//     expect.hasAssertions();
//   });
//   it("should create server", async () => {
//     const server = await Server.init();
//     expect(server).toBeDefined();
//   });

//   it("should not start server if it run on child module", async () => {
//     const spyInfo = jest.spyOn(logger, "info");
//     await Server.start({
//       parent: "having parent",
//     } as any);
//     expect(spyInfo).not.toBeCalled();
//   });

//   it("should start server if it run on main module", async () => {
//     const spyInfo = jest.spyOn(logger, "info");
//     await Server.start({
//       parent: null,
//     } as any);
//     expect(spyInfo).toBeCalled();
//   });

//   it("should log error if server start error", async () => {
//     const spyInfo = jest.spyOn(logger, "info");
//     const spyError = jest.spyOn(logger, "error");
//     const spyInit = jest.spyOn(Server, "init");
//     spyInit.mockRejectedValueOnce("error");
//     await Server.start({
//       parent: null,
//     } as any);
//     expect(spyInfo).not.toBeCalled();
//     expect(spyError).toBeCalled();
//   });
// });

describe("this is the first test set", () => {
  it("should return true when run dummy test", () => {
    expect(1 + 2).toBe(3);
  });
});
// test("dummy test", () => {
//   expect(1 + 2).toBe(3);
// });
