const request = require("supertest");
const app = require("../../src/app");
const { expect, describe, it } = require('@jest/globals')

describe("Test Page", () => {
  it("GET /      should response homepage", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(expect.stringContaining("No direct access is allowed."));
  });

  it("GET /404   should response 404", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });
});
