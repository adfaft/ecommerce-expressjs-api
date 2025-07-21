import request from "supertest";
import app from "../../dist/app.js";
import util from 'util';
import { connect, currentdb } from '../../dist/database/mongodb.js';
import { randomBytes } from "crypto";
import { seed_default as admin_seed_default } from "../seed/admin.seed.js";
import { post_new, seed_new as post_seed_new } from "../seed/post.seed.js";
import { seed_default as post_category_seed_default } from "../seed/post_category.seed.js";
import { seed_default as post_seed_default } from "../seed/post.seed.js";
import omit from "lodash/omit.js";

util.inspect.defaultOptions.depth = 6;

describe("Posts => ", () => {

  beforeAll(async function(){
    await resetdb();
  });

  describe('EMPTY STATE', function () {

    // list empty
    it("GET /api/v1/posts, LIST EMPTY: should response EMPTY post list", async () => {

      await resetdb();

      const response = await request(app).get("/api/v1/posts");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ data: [] });
    });

    // get empty
    it("GET /:id, GET ID EMPTY: should response EMPTY post data", async () => {
      // id tidak ditemukan
      const response = await request(app).get("/api/v1/posts/01234567890123456789abcd");
      expect(response.statusCode).toBe(402);
      expect(response.body.message).toEqual("empty");

    });

  });


  describe('CRUD STATE', function () {

    it("POST /, CREATE: should response post data", async () => {

      const sample = post_new({
        slug: 'sample-post-create-' + randomBytes(8).toString('hex'),
        lang: 'en',
        type: 'post',
        translation: [{
          lang: 'id',
          postId:  '211111222222333333444442'
        }],
      });

      // create
      const post_response = await request(app).post("/api/v1/posts")
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(sample);

      expect(post_response.statusCode).toBe(200);
      expect(post_response.body._id).toBeTruthy();

      const sample_test = omit(sample, ["meta", "categories", "translation"]);
      expect(post_response.body).toEqual(jasmine.objectContaining(sample_test));
      expect(post_response.body.meta.seo).toEqual(jasmine.objectContaining(sample.meta.seo)); 
      expect(post_response.body?.categories?.map((x) => { 
        return {categoryId: x.categoryId, slug: x.slug} 
      })).toEqual(jasmine.objectContaining(sample.categories));
      expect(post_response.body?.translation?.map((x) => { 
        return {postId: x.postId, lang: x.lang} 
      })).toEqual(jasmine.objectContaining(sample.translation));

    });

    // create : validation error
    xit("POST /   should response post data with validation error", async () => {
      const response = await request(app).get("/404");
      expect(response.statusCode).toBe(404);
      expect(response.text).toEqual(expect.stringContaining("Page not found."));
    });


    // list
    it("GET /, GET LIST : should response post list", async () => {

      const { model, sample } = await create_post({
        slug: 'sample-post-list-' + randomBytes(8).toString('hex')
      });

      const response = await request(app).get("/api/v1/posts");
      expect(response.statusCode).toBe(200);

      const result = response.body.data.find((el) => el.slug === sample.slug);

      expect(result._id).toEqual(model._id.toHexString());

      const sample_test = omit(sample, ["meta", "categories"]);
      expect(result).toEqual(jasmine.objectContaining(sample_test));

    });

    // list find by field : search by lang, type, slug
    it("GET /, GET LIST FIND FIELD : should response post list", async () => {

      const { model, sample } = await create_post({
        slug: 'sample-post-list-' + randomBytes(8).toString('hex')
      });


      const response = await request(app).get("/api/v1/posts");
      expect(response.statusCode).toBe(200);

      const result = response.body.data.find((el) => el.slug === sample.slug);

      expect(result._id).toEqual(model._id.toHexString());

      const sample_test = omit(sample, ["meta", "categories"]);
      expect(result).toEqual(jasmine.objectContaining(sample_test));

    });

    // list search
    it("GET /, GET LIST SEARCH : should response post list", async () => {

      const { model, sample } = await create_post({
        slug: 'sample-post-list-' + randomBytes(8).toString('hex')
      });

      const response = await request(app).get("/api/v1/posts");
      expect(response.statusCode).toBe(200);

      const result = response.body.data.find((el) => el.slug === sample.slug);

      expect(result._id).toEqual(model._id.toHexString());

      const sample_test = omit(sample, ["meta", "categories"]);
      expect(result).toEqual(jasmine.objectContaining(sample_test));

    });


    // find by id
    it("GET /:id, GET BY ID : should response post data", async () => {

      const { model, sample } = await create_post({
        slug: 'sample-post-findbyid-' + randomBytes(8).toString('hex')
      });

      const response = await request(app).get("/api/v1/posts/" + model._id);
      expect(response.statusCode).toBe(200);
      expect(response.body._id).toEqual(model._id.toHexString());
      expect(response.body.title).toEqual(model.title);

      const sample_test = omit(sample, ["meta", "categories"]);
      expect(response.body).toEqual(jasmine.objectContaining(sample_test));
    });

    // get empty : error id
    it("GET /:id, GET ID INVALID, should response failed :id validation", async () => {
      const response = await request(app).get("/api/v1/posts/01234567890");

      expect(response.statusCode).toBe(400);
      expect(response.body.error?.fieldErrors.id).toContain("Not a valid ObjectId");
    });

    // update by put
    xit("PUT /:id   should response updated post data", async () => {
      const response = await request(app).get("/404");
      expect(response.statusCode).toBe(404);
      expect(response.text).toEqual(expect.stringContaining("Page not found."));
    });

    // update by post
    xit("POST /update/:id   should response updated post data", async () => {
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

    // delete by delete
    it("DELETE /:id   should response deleted post data", async () => {

      const { model, sample } = await create_post({
        slug: 'sample-post-deletebyid-' + randomBytes(8).toString('hex')
      });

      const response = await request(app).delete("/api/v1/posts/" + model._id.toHexString());

      expect(response.statusCode).toBe(200);
      expect(response.body._id).toEqual(model._id.toHexString());
      expect(response.body.slug).toEqual(model.slug);
    });

    // delete : not exist 
    it("DELETE /:id   should response post data error for not exist", async () => {
      const { model, sample } = await create_post({
        slug: 'sample-post-deletebyid-' + randomBytes(8).toString('hex')
      });

      const response = await request(app).delete("/api/v1/posts/" + model._id.toHexString());
      const response_next = await request(app).delete("/api/v1/posts/" + model._id.toHexString());

      expect(response.statusCode).toBe(200);
      expect(response.body._id).toEqual(model._id.toHexString());
      expect(response.body.slug).toEqual(model.slug);

      expect(response_next.statusCode).toBe(402);
      expect(response_next.body.message).toEqual("empty");

    });

    // delete by post
    it("POST /delete/:id   should response deleted post data", async () => {
      const { model, sample } = await create_post({
        slug: 'sample-post-deletebyid-' + randomBytes(8).toString('hex')
      });

      const response = await request(app).delete("/api/v1/posts/" + model._id.toHexString());

      expect(response.statusCode).toBe(200);
      expect(response.body._id).toEqual(model._id.toHexString());
      expect(response.body.slug).toEqual(model.slug);
    });

    // delete : not exist 
    it("POST /delete/:id   should response post data error for not exist", async () => {
      const { model, sample } = await create_post({
        slug: 'sample-post-deletebyid-' + randomBytes(8).toString('hex')
      });

      const response = await request(app).delete("/api/v1/posts/" + model._id.toHexString());

      const response_next = await request(app).delete("/api/v1/posts/" + model._id.toHexString());

      expect(response.statusCode).toBe(200);
      expect(response.body._id).toEqual(model._id.toHexString());
      expect(response.body.slug).toEqual(model.slug);

      expect(response_next.statusCode).toBe(402);
      expect(response_next.body.message).toEqual("empty");
    });


  });


  describe('PAGINATION STATE', function () {


    // list : pagination
    xit("GET /      should response post list with pagination", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.text).toEqual(expect.stringContaining("No direct access is allowed."));
    });


  });



});

async function create_post(replacer = {}) {
  
  const { model, sample } = await post_seed_new(replacer);
  return { model, sample };
}

async function resetdb() {

  try {

    await connect();

    const db = currentdb();
    if (!db) {
      return;
    }

    await db.dropCollection('admins');
    await db.dropCollection('posts');
    await db.dropCollection('post_categories');

    await admin_seed_default();
    await post_category_seed_default();
    await post_seed_default();

    console.log(`clear admin, posts & posts_categories collection + admin seed`);

  } catch (err) {
    console.log(err)
  }

}