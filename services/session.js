const SECRET = process.env.secret || "foobar";
const md5 = require('md5');


const SessionService = {};


// Create a signed session ID from the
// user's email
SessionService.createSignedSessionId = (email) => {
  const signature = SessionService.createSignature(email);
  return `${ email }:${ signature }`;
}

// Create a signature
SessionService.createSignature = (email) => {
  return md5(`${ email }${ SECRET }`);
}




module.exports = SessionService;

