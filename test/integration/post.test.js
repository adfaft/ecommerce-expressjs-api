import request from "supertest";
import app from "../../dist/app.js";
import util from 'util';
import { connect, disconnect, currentdb } from '../../dist/database/mongodb.js';
import { getRandomValues, randomBytes } from "crypto";

util.inspect.defaultOptions.depth = 6;

describe("Posts => ", () => {

  async function create_post(replacer = {}) {
    const sample = Object.assign({}, {
      title: "Sample Post",
      slug: "sample-post",
      type: "post",
      lang: "id",
      status: "publish",
    }, replacer);

    // create
    const post_response = await request(app).post("/api/v1/posts")
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(sample);

    return { post_response, sample };
  }

  async function resetdb() {

    try {

      await connect();

      const db = currentdb();
      if (!db) {
        return;
      }

      await db.dropCollection('posts');
      await db.dropCollection('post_categories');

      console.log(`clear posts & posts_categories collection`);

    } catch (err) {
      console.log(err)
    }

  }

  // list empty
  it("GET /api/v1/posts      should response EMPTY post list", async () => {

    await resetdb();

    const response = await request(app).get("/api/v1/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ data: [] });
  });

  // get empty
  it("GET /:id   should response EMPTY post data", async () => {
    const response = await request(app).get("/api/v1/posts/01234567890123456789abcd");
    expect(response.statusCode).toBe(402);
    expect(response.body.message).toEqual("empty");
  });

  // get empty : error id
  it("GET /:id   should response failed :id validation", async () => {
    const response = await request(app).get("/api/v1/posts/01234567890");

    expect(response.statusCode).toBe(400);
    expect(response.body.error?.fieldErrors.id).toContain("Not a valid ObjectId");
  });

  it("POST /   created, should response post data", async () => {

    const { post_response, sample } = await create_post({
      slug: 'sample-post-create-' + randomBytes(8).toString('hex')
    });

    expect(post_response.statusCode).toBe(200);
    expect(post_response.body._id).toBeTruthy();
    expect(post_response.body).toEqual(jasmine.objectContaining(sample));

  });

  // list
  it("GET /      should response post list", async () => {

    const { post_response, sample } = await create_post({
      slug: 'sample-post-list-' + randomBytes(8).toString('hex')
    });

    console.log(post_response.body)

    const response = await request(app).get("/api/v1/posts");
    expect(response.statusCode).toBe(200);

    console.log(response.body)

    const result = response.body.data.find((el) => el.slug === sample.slug);

    expect(result._id).toEqual(post_response.body._id);
    expect(result).toEqual(jasmine.objectContaining(sample));

  });

  // find by id
  it("GET /:id   should response post data", async () => {

    const { post_response, sample } = await create_post({
      slug: 'sample-post-findbyid-' + randomBytes(8).toString('hex')
    });

    const response = await request(app).get("/api/v1/posts/" + post_response.body._id);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toEqual(post_response.body._id);
    expect(response.body.title).toEqual(post_response.body.title);
    expect(response.body).toEqual(jasmine.objectContaining(sample));
  });

  // search by lang, type, slug

  // 




  // // update
  // xit("PUT /   should response updated post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // update
  // xit("POST /update/:id   should response updated post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // delete
  // xit("DELETE /:id   should response deleted post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // delete
  // xit("POST /delete/:id   should response deleted post data", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // list : pagination
  // xit("GET /      should response post list with pagination", async () => {
  //   const response = await request(app).get("/");
  //   expect(response.statusCode).toBe(200);
  //   expect(response.text).toEqual(expect.stringContaining("No direct access is allowed."));
  // });

  // // create : validation minimum success
  // xit("POST /   should response post data with validation success", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // create : validation error
  // xit("POST /   should response post data with validation error", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // update : validation error
  // xit("POST /update/:id   should response updated post data with validation error", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

  // // delete : not exist 
  // xit("POST /delete/:id   should response post data error for not exist", async () => {
  //   const response = await request(app).get("/404");
  //   expect(response.statusCode).toBe(404);
  //   expect(response.text).toEqual(expect.stringContaining("Page not found."));
  // });

});