const port = process.env.PORT || 1300;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
  host: "35.220.157.219",
  port: "3306",
  user: "root",
  password: "12345", //empty for window
  database: "learning",
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("start");
});

con.connect(function (error) {
  if (error) console.log(error);
  else console.log("connected");
});
// Information APP
//du lieu Home
app.get("/getDataApp_Home", function (req, res) {
  con.query("select * from category", function (error, rows, fields) {
    if (error) console.log(error);
    else {
      console.log(rows);
      res.send(rows);
    }
  });
});
app.get("/he", function (req, res) {
  res.send("helo");
});
// du lieu config
app.post("/getConfig", function (req, res) {
  var user = req.body;
  var query =
    "select * from overview where id_user=" +
    user.id_user +
    " and type='" +
    user.type +
    "'";
  con.query(query, [user.id_user, user.type], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
// lay ten bai hoc va cac link lien ket toi bai hoc
app.post("/getLession", function (req, res) {
  var category = req.body;
  var query =
    "select l.id, l.id_category, l.link, l.name,l.image,l.imageCheck from lession l JOIN category c on l.id_category = c.id where c.id=" +
    category.id +
    " and c.isActive=1 and l.isActive=1";

  con.query(query, [category.id], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
app.get("/getPartRead", function (req, res) {
  con.query('select * from part where type="read"', function (
    error,
    rows,
    fields
  ) {
    if (error) console.log(error);
    else {
      console.log(rows);
      res.send(rows);
    }
  });
});
app.get("/getPartListening", function (req, res) {
  con.query('select * from part where type="listening"', function (
    error,
    rows,
    fields
  ) {
    if (error) console.log(error);
    else {
      console.log(rows);
      res.send(rows);
    }
  });
});

//danh sach cau hoi trong tung part trong tung de thi
app.post("/getQuestionPart", function (req, res) {
  var category = req.body;
  var query =
    "select q.id,q.id_part,q.id_lession,q.question,q.dapanA,q.dapanB,q.dapanC,q.dapanD,q.answer,q.image,q.sound\
  from question as q,lession as l,category as c, part as p, (SELECT q.sound as ss\
  from question q where q.id_part= " +
    category.id_part +
    " GROUP BY q.sound ORDER BY RAND() LIMIT 5) as q2 \
   WHERE c.id=l.id_category and l.id=q.id_lession and c.id=" +
    category.id +
    " and p.id=q.id_part and l.id=" +
    category.id_lession +
    " and q.sound=q2.ss;";
  con.query(
    query,
    [category.id, category.id_part, category.id_lession],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});
// Information USER
app.get("/getData", function (req, res) {
  con.query("select * from user", function (error, rows, fields) {
    if (error) console.log(error);
    else {
      console.log(rows);
      res.send(rows);
    }
  });
});

app.post("/sendData", function (req, res) {
  var query =
    "INSERT INTO user (username, email, password)  VALUES ('" +
    req.body.username +
    "', '" +
    req.body.email +
    "','" +
    req.body.password +
    "')";
  con.query(query, function (error, rows, fields) {
    if (error) console.log(error);
    else {
      res.send(rows);
    }
  });
});

app.post("/checkLogin", function (req, res) {
  var user = req.body;
  //   var query = "CALL login ('" + user.username + "','" + user.password + "')";
  var query = "select * from user where username='" + user.username + "'";
  con.query(query, [user.username], (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});
