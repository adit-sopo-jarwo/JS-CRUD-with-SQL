const express = require("express");
const mysql = require("mysql");
const BodyParser = require("body-parser");

const app = express();
app.use(BodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "views");

const db = mysql.createConnection({
  host: "localhost",
  database: "uts_pemrograman2",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected....");

  //get data
  app.get("/", (req, res) => {
    const sql = "SELECT * FROM mahasiswa";
    db.query(sql, (err, result) => {
      const mahasiswa = JSON.parse(JSON.stringify(result));
      res.render("index", { mahasiswa: mahasiswa, title: "Daftar Mahasiswa" });
    });
  });

  // Insert data
  app.post("/tambah", (req, res) => {
    const insertSql =
      "INSERT INTO mahasiswa (NIM, Nama, Kelas, Prodi) VALUES (?, ?, ?, ?)";
    const { NIM, Nama, Kelas, Prodi } = req.body;

    db.query(insertSql, [NIM, Nama, Kelas, Prodi], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        throw err;
      }
      res.redirect("/");
    });
  });

  // Update data
  app.post("/edit/:NIM", (req, res) => {
    const { Nama, Kelas, Prodi } = req.body;
    const { NIM } = req.params;

    const updateSql = `UPDATE mahasiswa SET Nama=?, Kelas=?, Prodi=? WHERE NIM=?;`;

    db.query(updateSql, [Nama, Kelas, Prodi, NIM], (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        throw err;
      }
      res.redirect("/");
    });
  });

  // Delete
  app.post("/hapus/:NIM", (req, res) => {
    const { NIM } = req.params;
    const deleteSql = `DELETE FROM mahasiswa WHERE NIM=?;`;
    db.query(deleteSql, [NIM], (err, result) => {
      if (err) {
        console.error("Error deleting:", err);
        throw err;
      }
      res.redirect("/");
    });
  });
});

app.listen(8000, () => {
  console.log("server ready....");
});
