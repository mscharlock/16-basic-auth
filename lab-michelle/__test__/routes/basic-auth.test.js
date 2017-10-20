'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');

describe('Testing basic auth routes', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(mocks.user.removeAll);


  //POST
  describe('POST to /api/signup', function() {
    beforeAll(() => {
      this.mockUserData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      return superagent.post(':4414/api/signup')
        .send(this.mockUserData)
        .then(res => this.res = res)
        .catch(console.error);
    });

    describe('Valid Requests', () => {
      test('should respond with a token', () => {
        expect(this.res.text).toBeTruthy();
        expect(this.res.text.length > 1).toBeTruthy();
      });
      test('should return a status of 201', () => {
        expect(this.res.status).toBe(201);
      });
    });
  });


  //GET
  describe('GET to /api/signin', function() {
    beforeAll(() => {
      return mocks.user.createOne()
        .then(userData => {
          this.tempUser = userData.user;
          return superagent.get(':4414/api/signin')
            .auth(userData.user.username, userData.password)
            .then(res => this.res = res);
        });
    });
    describe('Valid Requests', () => {
      test('should return a token', () => {
        expect(this.res.text).toBeTtoBeTruthy();
        expect(this.res.text.length > 1).toBeTruthy();
      });
      test('should return a token', () => {
        expect(this.res.text).toBeTruthy();
        expect(this.res.text.length > 1).toBeTruthy();
      });
    });
    describe('Invalid Requests', () => {
      test('should return a status of 401', () => {
        expect(this.res.status).toBe(401);
      });
    });
  });
});
