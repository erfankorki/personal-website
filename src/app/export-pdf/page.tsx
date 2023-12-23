/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { WebContainer } from "@webcontainer/api";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { files } from "../../../public/export";
import { useImmer } from "use-immer";
import ky from "ky";

let webContainerInstance: WebContainer;

const useExportContainer = () => {
  const [loading, setLoading] = useState(false);
  const [url, setURL] = useState("http://localhost:3111");

  useEffect(() => {
    async function installDependencies() {
      const installProcess = await webContainerInstance.spawn("npm", [
        "install",
      ]);
      //   installProcess.output.pipeTo(
      //     new WritableStream({
      //       write(data) {
      //         console.log(data);
      //       },
      //     })
      //   );
      return installProcess.exit;
    }

    async function startServer() {
      const serverProcess = await webContainerInstance.spawn("npm", [
        "run",
        "start",
      ]);
      webContainerInstance.on("server-ready", (port, url) => {
        console.log(url);
        setURL(url);
        setLoading(false);
        webContainerInstance.on("error", ({ message }) => {
          console.log(message);
        });
      });
      return serverProcess.exit;
    }

    async function bootContainer() {
      webContainerInstance = await WebContainer.boot();
      await webContainerInstance.mount(files);
      const installExitCode = await installDependencies();
      console.log(installExitCode);
      if (installExitCode !== 0) {
        throw new Error("Installation failed");
      }
      const serverExitCode = await startServer();
      console.log(serverExitCode);
      if (serverExitCode !== 0) {
        throw new Error("Starting Server failed");
      }
    }
    // bootContainer();
  }, []);

  return { url, loading };
};

const ExportPDF = () => {
  const [table, setTable] = useImmer<Array<Array<string>>>([
    ["erfan", "parastoo"],
    ["hassan", "maryam"],
  ]);
  const { url, loading } = useExportContainer();

  const onExport = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      ky(`${url}/export/?table=${JSON.stringify(table)}`, {
        prefixUrl: "",
        method: "get",
        headers: {
          "content-type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      })
        .then((response) => response.blob())
        .then((data) => {
          const href = URL.createObjectURL(data);
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", "export.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          link.remove();
        });
    },
    [table, url]
  );

  return (
    <main>
      <article>
        <h1>EXPORT PDF</h1>
        {/* {loading ? (
          <p>Loading...</p>
        ) : (
          <iframe
            name="export-iframe"
            height={400}
            width={400}
            className="border-black border"
            src={url}
          />
        )} */}
        <form
          action={`${url}/export`}
          method="get"
          target="export-iframe"
          onSubmit={onExport}
        >
          <button
            type="submit"
            className="w-40 h-10 rounded-lg border border-neutral-500"
          >
            Export Button
          </button>
          <input value={JSON.stringify(table)} readOnly={true} name="table" />
        </form>
      </article>
    </main>
  );
};

export default ExportPDF;
