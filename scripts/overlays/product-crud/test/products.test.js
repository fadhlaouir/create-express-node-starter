const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { setup, teardown } = require('./setup');

let agent;
before(async () => {
  agent = request(await setup());
});
after(teardown);

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

test('create, list, search, update and delete a product', async () => {
  const created = await agent
    .post('/v1/api/products')
    .send({
      name: 'Blue mug',
      description: 'Ceramic',
      price: 12.5,
      quantity: 3,
    })
    .expect(201);
  const id = created.body.product._id;

  await agent
    .post('/v1/api/products')
    .send({ name: 'Red chair', price: 80, quantity: 1 })
    .expect(201);

  const list = await agent.get('/v1/api/products?limit=1').expect(200);
  assert.equal(list.body.products.length, 1);
  assert.equal(list.body.pagination.total, 2);

  const search = await agent.get('/v1/api/products?q=mug').expect(200);
  assert.deepEqual(
    search.body.products.map((p) => p.name),
    ['Blue mug'],
  );

  const updated = await agent
    .put(`/v1/api/products/${id}`)
    .send({ price: '15' })
    .expect(200);
  assert.equal(updated.body.product.price, 15);
  assert.equal(updated.body.product.name, 'Blue mug');

  await agent.delete(`/v1/api/products/${id}`).expect(200);
  await agent.get(`/v1/api/products/${id}`).expect(404);
});

test('search text is matched literally, not as a regular expression', async () => {
  const res = await agent.get('/v1/api/products?q=.*').expect(200);
  assert.equal(res.body.pagination.total, 0);
});

test('prices and quantities are validated', async () => {
  await agent
    .post('/v1/api/products')
    .send({ name: 'Bad', price: -1, quantity: 1 })
    .expect(422);
  await agent
    .post('/v1/api/products')
    .send({ name: 'Bad', price: { $gt: 0 }, quantity: 1 })
    .expect(422);
  await agent
    .post('/v1/api/products')
    .send({ description: 'No name', price: 1 })
    .expect(422);
});

test('a product photo is stored under a random name and replaced on update', async () => {
  const created = await agent
    .post('/v1/api/products')
    .field('name', 'Lamp')
    .field('price', '20')
    .field('quantity', '2')
    .attach('photo', png, {
      filename: '../../lamp.png',
      contentType: 'image/png',
    })
    .expect(201);
  const first = created.body.product.photo;
  assert.match(first, /^uploads\/[0-9a-f-]{36}\.png$/);
  await agent.get(`/${first}`).expect(200);

  const updated = await agent
    .put(`/v1/api/products/${created.body.product._id}`)
    .attach('photo', png, { filename: 'new.png', contentType: 'image/png' })
    .expect(200);
  assert.notEqual(updated.body.product.photo, first);
  await agent.get(`/${first}`).expect(404);

  await agent
    .delete(`/v1/api/products/${created.body.product._id}`)
    .expect(200);
  await agent.get(`/${updated.body.product.photo}`).expect(404);
});

test('only images can be uploaded', async () => {
  const res = await agent
    .post('/v1/api/products')
    .field('name', 'Evil')
    .field('price', '1')
    .attach('photo', Buffer.from('<script>alert(1)</script>'), {
      filename: 'evil.html',
      contentType: 'text/html',
    });
  assert.equal(res.status, 422);
});

test('uploads cannot read files outside the upload folder', async () => {
  const res = await agent.get('/uploads/..%2Fpackage.json');
  assert.notEqual(res.status, 200);
});
