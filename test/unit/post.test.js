import request from "supertest";
import app from "../../dist/app.js";
import mongodb from '../../dist/database/mongodb.js';

describe("Test Post Crud", () => {

  beforeAll(async () => {
    await mongodb.connect();
  });
  
  // list empty
  it("GET /api/v1/posts      should response EMPTY post list", async () => {
    const response = await request(app).get("/api/v1/posts");
    expect(response.statusCode).toBe(200);
    // expect(response.text).toEqual(jasmine.stringContaining("No direct access is allowed."));
  });

  // get empty
  it("GET /:postId   should response EMPTY post data", async () => {
    const response = await request(app).get("/api/v1/posts/00000-99999");
    expect(response.statusCode).toBe(200);
    // expect(response.text).toEqual(jasmine.stringContaining("Page not found."));
  });

  // // create
  // it("POST /   should response post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // list
  // it("GET /      should response post list", async () => {
  //   const response = await request(app).get("/");
  //   expect(response.statusCode).toBe(200);
  //   expect(response.text).toEqual(expect.stringContaining("No direct access is allowed."));
  // });

  // // get
  // it("GET /:postId   should response post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // update
  // it("PUT /   should response updated post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // update
  // it("POST /update/:postId   should response updated post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // delete
  // it("DELETE /:postId   should response deleted post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // delete
  // it("POST /delete/:postId   should response deleted post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // list : pagination
  // it("GET /      should response post list", async () => {
  //   const response = await request(app).get("/");
  //   expect(response.statusCode).toBe(200);
  //   expect(response.text).toEqual(expect.stringContaining("No direct access is allowed."));
  // });

  // // create : validation minimum success
  // it("POST /   should response post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // create : validation error
  // it("POST /   should response post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // update : validation error
  // it("POST /update/:postId   should response updated post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // delete : not exist 
  // it("POST /delete/:postId   should response updated post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });


  afterAll(() => {
    mongodb.disconnect();
  });

});