const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { setup, teardown } = require('./setup');

let agent;
before(async () => {
  agent = request(await setup());
});
after(teardown);

test('health check reports the database', async () => {
  const res = await agent.get('/health').expect(200);
  assert.deepEqual(res.body, { status: 'ok', database: true });
});

test('API docs load Swagger UI with integrity hashes and serve the spec', async () => {
  await agent.get('/api-docs').expect(301);
  const page = await agent.get('/api-docs/').expect(200);
  assert.match(page.text, /integrity="sha384-/);
  const spec = await agent.get('/api-docs/openapi.json').expect(200);
  assert.equal(spec.body.openapi, '3.0.3');
});

test('unknown routes return a JSON 404', async () => {
  const res = await agent.get('/v1/api/nope').expect(404);
  assert.equal(res.body.success, false);
});

test('invalid JSON is a 400, not a server error', async () => {
  const res = await agent
    .post('/v1/api/anything')
    .set('Content-Type', 'application/json')
    .send('{bad');
  assert.equal(res.status, 400);
});

test('security headers are set', async () => {
  const res = await agent.get('/health');
  assert.equal(res.headers['x-content-type-options'], 'nosniff');
  assert.equal(res.headers['x-powered-by'], undefined);
});
