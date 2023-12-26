const express = require("express");
const multer = require("multer");
const fs = require("fs");
const ExcelJS = require("exceljs");

const upload = multer();

const app = express();
const port = 3111;
app.use(`/static`, express.static("static"));
app.use(express.json({}));

app.get("/", (req, res) => {
  res.send("Send Your 2d Matrix for Conversion to Excel");
});

app.get("/export/", upload.none(), async (req, res) => {
  const file = fs.readFileSync("table.json", { encoding: "utf8" });
  const parsedFile = JSON.parse(file);
  const table = JSON.parse(parsedFile.table);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Test");

  sheet.columns = table[0].map((item) => ({
    header: item,
    key: item,
    width: item.length * 2,
  }));

  table.slice(1).forEach((items) => {
    sheet.addRow(items);
  });

  await workbook.xlsx.writeFile("static/file.xlsx");

  res.redirect("/static/file.xlsx");
});

app.listen(port, () => {
  console.log(`App is live at http://localhost:${port}`);
});
