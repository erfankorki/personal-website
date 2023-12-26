/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
  "index.js": {
    file: {
      contents: `
          import express from "express";
          import multer from "multer";
          import fs from "fs";
          import ExcelJS from "exceljs";

          const upload = multer();
          const port = 3111;
          const app = express();


          app.use("/static", express.static("static"));
          app.use(express.json({}));

          app.get("/", (req, res) => {
            res.send("Send Your 2d Matrix for Conversion to Excel");
          });

          app.get("/export/", upload.none(), async (req, res) => {
            const file = fs.readFileSync("table.json", { encoding: "utf-8" });
            const parsedFile = JSON.parse(file);
            const table = parsedFile.table;

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

            res.redirect('/static/file.xlsx');
          });

          app.listen(port, () => {
            console.log("App is live at http://localhost:\`${3111}\`");
          });
        `,
    },
  },
  "package.json": {
    file: {
      contents: `
      {
        "name": "export-server",
        "type": "module",
        "dependencies": {
          "express": "latest",
          "multer": "latest",
          "exceljs": "latest"
        },
        "scripts": {
          "start": "node --watch index.js"
        }
      }
      `,
    },
  },
  "table.json": {
    file: {
      contents: `{"table": "[[\"mathew\", \"mark\", \"luke\" ,\"john\"],[10, 20, 30, 40]]"}`,
    },
  },
  static: {
    directory: {},
  },
};
