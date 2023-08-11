const { my_server } = require("./my_server");
const port = 4000;

const app = my_server();

// app.use(static(__dirname + "/public"));

// Routing
app.get("/", (req, res) => {
  // res.sendFile("./public/index.html");
  console.log("Home");
  // res.send("Hello WOrld");
});

app.get("/about", (req, res) => {
  // res["content-type"] = "text/html";
  // res.send("Hello WOrld");
  return res.sendFile("./public/about.html");
});

app.get("/contact", (req, res) => {
  return res.sendFile("./public/contact.html");
});

// Starting a server
app.listen(port, (err) => {
  if (err) throw err;
  console.log("The server is running on port ....", port);
});
