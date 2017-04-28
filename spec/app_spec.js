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

});
