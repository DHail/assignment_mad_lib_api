const app = require('../app');
const request = require('request');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const qs = require('qs');


describe('App', () => {
  const baseUrl = 'http://localhost:3000';
  const apiUrl = baseUrl + '/api/';
  let server;
  let user;
  const apiUrlFor = (type, params) => {
    params = params ? `&${ qs.stringify(params) }` : '';
    return `${ apiUrl }${ type }?token=${ user.token }${ params }`;
  };
  const j = (str) => JSON.parse(str);


  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });


  beforeEach((done) => {
    User.create({
      fname: 'Foo',
      lname: 'Bar',
      email: 'foobar@gmail',
      password: 'password'
    })
      .then((result) => {
        user = result;
        done();
      });
  });


  afterAll((done) => {
    server.close();
    server = null;
    done();
  });


  // ----------------------------------------
  // API
  // ----------------------------------------

  it('returns an array of nouns equal to count when count provided', (done) => {
    request.get(apiUrlFor('nouns', { count: 5 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(5);
      done();
    });
  });

  it('returns 10 nouns even if no count provided', (done) => {
    request.get(apiUrlFor('nouns'), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  it('returns an array of verbs equal to count when count provided', (done) => {
    request.get(apiUrlFor('verbs', { count: 5 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(5);
      done();
    });
  });

  it('returns 10 verbs even if no count provided', (done) => {
    request.get(apiUrlFor('verbs'), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  it('returns an array of adjectives equal to count when count provided', (done) => {
    request.get(apiUrlFor('adjectives', { count: 5 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(5);
      done();
    });
  });

  it('returns 10 adjectives even if no count provided', (done) => {
    request.get(apiUrlFor('adjectives'), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

  it('returns an array of adverbs equal to count when count provided', (done) => {
    request.get(apiUrlFor('adverbs', { count: 5 }), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(5);
      done();
    });
  });

  it('returns 10 adverbs even if no count provided', (done) => {
    request.get(apiUrlFor('adverbs'), (err, res, body) => {
      let result = j(body);
      expect(result.length).toEqual(10);
      done();
    });
  });

});
