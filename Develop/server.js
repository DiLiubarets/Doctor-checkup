// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
const exphbs = require("express-handlebars");
// Requiring passport as we've configured it
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// // Index route
app.get("/", (req, res) => res.render("landing", { layout: "main" }));
app.get("/login", (req, res) => res.render("login", { layout: "main" }));
app.get("/members", (req, res) => res.render("members", { layout: "main" }));
app.get("/signup", (req, res) => res.render("signup", { layout: "main" }));
app.get("/tracker", (req, res) => res.render("tracker", { layout: "main" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Set static folder
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    let schedule = createSchedule();

    create(
      "admin@gmail.com",
      "admin",
      "admin",
      "Admin",
      "Female",
      "QC",
      "123456789",
      null
    );

    create(
      "client@gmail.com",
      "12345",
      "patient",
      "Dina Liu",
      "Female",
      "QC",
      "123456789",
      null
    );
    create(
      "liam.mackinnon@gmail.com",
      "12345",
      "patient",
      "Liam Mackinnon",
      "Male",
      "ON",
      "123456789",
      null
    );
    create(
      "Aisling.mccaffrey@gmail.com",
      "12345",
      "patient",
      "Aisling McCaffrey",
      "Female",
      "ON",
      "123456789",
      null
    );
    create(
      "pushpi.sardana@gmail.com",
      "12345",
      "patient",
      "Pushpi Sardana",
      "Female",
      "ON",
      "123456789",
      null
    );
    create(
      "iqbal.sian@hotmail.com",
      "12345",
      "doctor",
      "Dr. Iqbal Sian",
      "Male",
      "QC",
      "123456789",
      schedule
    );
    create(
      "doctor@gmail.com",
      "12345",
      "doctor",
      "Dr. Morne Smit",
      "Male",
      "British Columbia",
      "7783983080",
      schedule
    );
    create(
      "nolanjansen@outlook.com",
      "12345",
      "doctor",
      "Dr Nolan Jansen",
      "Male",
      "Quebec",
      "8193456792",
      schedule
    );
    create(
      "drhui@drhui.com",
      "12345",
      "doctor",
      "Dr. Fred Hui",
      "Male",
      "Ontario",
      "4169204209",
      schedule
    );
    create(
      "k.brien@gmail.com",
      "12345",
      "doctor",
      "Dr. Kevin O`Brien",
      "Male",
      "Ontario",
      "6473490053",
      schedule
    );
    create(
      "dr.john@hotmail.com",
      "12345",
      "doctor",
      "Dr. Gary Weinstein",
      "Male",
      "Ontario",
      "4164859044",
      schedule
    );
    create(
      "lesliehousefather@hotmail.com",
      "12345",
      "doctor",
      "Dr Leslie Housefather",
      "Male",
      "Ontario",
      "4162226160",
      schedule
    );

    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

function createSchedule() {
  let doctorSchedule = [];
  let workingHours = [
    { name: "9am", hour: 9, avail: true },
    { name: "10am", hour: 10, avail: true },
    { name: "11am", hour: 11, avail: true },
    { name: "12am", hour: 12 },
    { name: "2pm", hour: 14 },
    { name: "3pm", hour: 15, avail: true },
    { name: "4pm", hour: 16 },
  ];
  let workingDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (day of workingDays) {
    let obj = {
      day: day,
      hours: workingHours,
    };
    doctorSchedule.push(JSON.parse(JSON.stringify(obj)));
  }
  return JSON.stringify(doctorSchedule);
}

function create(
  email,
  password,
  role,
  name,
  gender,
  province,
  phone,
  doctorSchedule
) {
  db.User.create({
    email: email,
    password: password,
    role: role,
    name: name,
    gender: gender,
    province: province,
    phone: phone,
    doctorSchedule: doctorSchedule,
  })
    .then(function () {
      res.redirect(307, "/api/login");
    })
    .catch(function (err) {
      //console.log(err)
      //res.status(401).json(err);
    });
}
