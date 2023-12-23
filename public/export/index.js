/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export const files = {
  "index.js": {
    file: {
      contents: `
      import express from "express";
      import multer from "multer";
      
      const upload = multer();
      
      const app = express();
      const port = 3111;
      app.use(express.json({}));
      
      app.get("/", (req, res) => {
        res.send("Send Your 2d Matrix for Conversion to Excel");
      });
      
      app.get("/export", upload.none(), (req, res) => {
        console.log(req.body);
        res.json(req.query);
      });
      
      app.listen(port, () => {
        console.log(\`App is live\`);
      });`,
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
          "nodemon": "latest",
          "multer": "latest"
        },
        "scripts": {
          "start": "node --watch index.js"
        }
      }
      `,
    },
  },
};
