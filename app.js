const { my_server } = require("./my_server");
const path = require("path");

const port = 4000;

const app = my_server();

// Routing
app.get("/", (req, res) => {
  console.log("Home");
  // return res.write("Hello WOrld");
});

app.get("/about", (req, res) => {
  // return res.write("Hello WOrld");
  return res.send("./public/about.html");
});

app.get("/contact", (req, res) => {
  return res.send("./public/contact.html");
});

// Starting a server
app.listen(port, (err) => {
  if (err) throw err;
  console.log("The server is running on port ....", port);
});
