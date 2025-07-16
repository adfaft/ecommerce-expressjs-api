import request from "supertest";
import app from "../../dist/app.js";
import mongodb from '../../dist/database/mongodb.js';

describe("Test Posts Crud", () => {

  beforeAll(async () => {
    await mongodb.connect();
  });
  
  // list empty
  it("GET /api/v1/posts      should response EMPTY post list", async () => {
    const response = await request(app).get("/api/v1/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({data:[]});
  });

  // get empty
  it("GET /:postId   should response EMPTY post data", async () => {
    const response = await request(app).get("/api/v1/posts/00000-99999");
    console.log(response.text);
    expect(response.statusCode).toBe(404);
    // expect(response.text).toEqual(jasmine.stringContaining("Page not found."));
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
  xit("GET /:postId   should response post data", async () => {
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
  xit("POST /update/:postId   should response updated post data", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // delete
  xit("DELETE /:postId   should response deleted post data", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // delete
  xit("POST /delete/:postId   should response deleted post data", async () => {
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
  xit("POST /update/:postId   should response updated post data with validation error", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });

  // delete : not exist 
  xit("POST /delete/:postId   should response post data error for not exist", async () => {
    const response = await request(app).get("/404");
    expect(response.statusCode).toBe(404);
    expect(response.text).toEqual(expect.stringContaining("Page not found."));
  });


  afterAll(() => {
    mongodb.disconnect();
  });

});