const express = require("express");
const app = express();

// ----------------------------------------
// Dotenv
// ----------------------------------------
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "aSg89Tc6lMpn8xwW1"]
  })
);
app.use(cookieParser());

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Method Override
// ----------------------------------------
app.use((req, res, next) => {
  let method;
  if (req.query._method) {
    method = req.query._method;
    delete req.query._method;
    for (let key in req.query) {
      req.body[key] = decodeURIComponent(req.query[key]);
    }
  } else if (typeof req.body === "object" && req.body._method) {
    method = req.body._method;
    delete req.body._method;
  }

  if (method) {
    method = method.toUpperCase();
    req.method = method;
  }

  next();
});

// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require("express-handlebars");
const helpers = require("./helpers");

const hbs = expressHandlebars.create({
  helpers: helpers.registered,
  extname: ".hbs",
  partialsDir: "views/",
  defaultLayout: "main"
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require('morgan');
const highlight = require('cli-highlight').highlight;

// Add :data format token
// to `tiny` format
let format = [
  ':separator',
  ':newline',
  ':method ',
  ':url ',
  ':status ',
  ':res[content-length] ',
  '- :response-time ms',
  ':newline', ':newline',
  ':data',
  ':newline',
  ':separator',
  ':newline', ':newline',
].join('');

// Use morgan middleware with
// custom format
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(format));
}

// Helper tokens
morgan.token('separator', () => '****');
morgan.token('newline', () => "\n");

// Set data token to output
// req query params and body
morgan.token('data', (req, res, next) => {
  if (/\.[\w]+$/.test(req.url)) {
    return '';
  }

  let data = [];
  ['query', 'params', 'body', 'session', 'user'].forEach((key) => {
    if (req[key]) {
      let capKey = key[0].toUpperCase() + key.substr(1);
      let value = JSON.stringify(req[key], null, 2);
      data.push(`${ capKey }: ${ value }`);
    }
  });
  data = highlight(data.join('\n'), {
    language: 'json',
    ignoreIllegals: true
  });
  return `${ data }`;
});

// ----------------------------------------
// Routes
// ----------------------------------------
const sessionsRouter = require("./routers/sessions");
app.use("/users", sessionsRouter);

const indexRouter = require("./routers/index");
app.use("/", indexRouter);

const usersRouter = require("./routers/users");
app.use("/users", usersRouter);



// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

// If we're running this file directly
// start up the server
if (require.main === module) {
  app.listen.apply(app, args);
}

// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) err = err.stack;
  res.status(500).render('errors/500', { error: err });
});

module.exports = app;
