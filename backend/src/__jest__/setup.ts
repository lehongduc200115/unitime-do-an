import { createNamespace, destroyNamespace } from "cls-hooked";
// import { Tracing } from '@swat/hapi-common';

// no type definitions available for expose-gc. Hence require
const garbageCollector = require("expose-gc/function");
afterEach(() => {
  expect.hasAssertions();
});
const session = "Tracing.TRACER_SESSION";
beforeAll(() => {
  createNamespace(session);
});
afterAll(() => {
  try {
    garbageCollector();
    destroyNamespace(session);
  } catch {}
});
