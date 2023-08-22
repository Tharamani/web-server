const { my_server } = require("./my_server");
const path = require("path");

const port = 4000;
const DIR = "public";
// const DIR = "dist";

const app = my_server();

app.static(path.join(__dirname, "/", DIR));

// Routing
app.get("/", (req, res) => {
  console.log("Home");
  // res.headers["Content-Type"] = "text/html";sss
  // return res.send("Hello WOrld");
});

app.get("/about", (req, res) => {
  res.headers["Content-Type"] = "text/html";
  // res.headers["Content-Type"] = "text/plain";
  // return res.send("Hello WOrld");
  return res.send(`${path.join(__dirname, "/", DIR)}/about.html`);
});

app.get("/contact", (req, res) => {
  res.headers["Content-Type"] = "text/html";
  return res.send(`${path.join(__dirname, "/", DIR)}/contact.html`);
});

app.post("/user", (req, res) => {
  res.headers["Content-Type"] = "application/json";
  return res.send(req.body);
});

app.put(`/user/1`, (req, res) => {
  res.headers["Content-Type"] = "application/json";
  return res.send(`Resource updated`);
});

// Starting a server
app.listen(port, (err) => {
  if (err) throw err;
  console.log("The server is running on port ....", port);
});
