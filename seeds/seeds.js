

module.exports = () => {
  let users = [];

  // ----------------------------------------
  // Creating Users
  // ----------------------------------------
  let p = User.create({
    fname: 'Foo',
    lname: 'Bar',
    email: 'foobar@gmail.com',
    password: 'password'
  });


  // ----------------------------------------
  // Finish
  // ----------------------------------------
  const promises = [p];
  return Promise.all(promises)
    .then(() => console.log())
    .catch((e) => { throw e; });
};
















