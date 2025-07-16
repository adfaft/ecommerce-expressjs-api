import request from "supertest";
import app from "../../dist/app.js";

describe("Test Posts Crud", () => {
  
  // list empty
  it("GET /api/v1/posts      should response EMPTY post list", async () => {
    const response = await request(app).get("/api/v1/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({data:[]});
  });

  // get empty
  it("GET /:id   should response EMPTY post data", async () => {
    const response = await request(app).get("/api/v1/posts/01234567890123456789abcd");
    expect(response.statusCode).toBe(402);
    expect(response.body.message).toEqual("empty");
  });

  // get empty
  it("GET /:id   should response failed :id validation", async () => {
    const response = await request(app).get("/api/v1/posts/01234567890");
    expect(response.statusCode).toBe(400);
    expect(response.body.errors?.[0]?.message).toEqual("Not a valid ObjectId");
  });

  // create
  xit("POST /   should response post data", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // list
  xit("GET /      should response post list", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(expect.stringContaining("No direct access is allowed."));
  });

  // get
  xit("GET /:id   should response post data", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // update
  xit("PUT /   should response updated post data", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // update
  xit("POST /update/:id   should response updated post data", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // delete
  xit("DELETE /:id   should response deleted post data", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // delete
  xit("POST /delete/:id   should response deleted post data", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // list : pagination
  xit("GET /      should response post list with pagination", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(expect.stringContaining("No direct access is allowed."));
  });

  // create : validation minimum success
  xit("POST /   should response post data with validation success", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // create : validation error
  xit("POST /   should response post data with validation error", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // update : validation error
  xit("POST /update/:id   should response updated post data with validation error", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // delete : not exist 
  xit("POST /delete/:id   should response post data error for not exist", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

});