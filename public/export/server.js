const express = require("express");
const multer = require("multer");
const ExcelJS = require("exceljs");

const upload = multer();

const app = express();
const port = 3111;
app.use(express.json({}));

app.get("/", (req, res) => {
  res.send("Send Your 2d Matrix for Conversion to Excel");
});

app.get("/export/", upload.none(), async (req, res) => {
  /**
   * @type Array<Array<string>>;
   */

  const table = JSON.parse(req.query.table);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Test");

  sheet.columns = table[0].map((item) => ({
    header: item,
    key: item,
    width: item.length * 2,
  }));

  table.slice(1).forEach((items, index) => {
    const row = (sheet.getRow(index).values = items.map((item) => item));
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const file = new Blob([buffer]);

  res.send(file);
});

app.listen(port, () => {
  console.log(`App is live at http://localhost:${port}`);
});
