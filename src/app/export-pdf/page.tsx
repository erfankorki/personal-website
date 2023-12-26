/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { WebContainer } from "@webcontainer/api";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { files } from "../../../public/export";
import { useImmer } from "use-immer";
import ky from "ky";

let webContainerInstance: WebContainer;

const useExportContainer = () => {
  const [loading, setLoading] = useState(true);
  const [url, setURL] = useState("");
  const [defaultURL, setDefaultURL] = useState("");

  useEffect(() => {
    async function installDependencies() {
      const installProcess = await webContainerInstance.spawn("npm", [
        "install",
      ]);
      // installProcess.output.pipeTo(
      //   new WritableStream({
      //     write(data) {
      //       console.log(data);
      //     },
      //   })
      // );
      return installProcess.exit;
    }

    async function startServer() {
      const serverProcess = await webContainerInstance.spawn("npm", [
        "run",
        "start",
      ]);

      serverProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
          },
        })
      );
      webContainerInstance.on("server-ready", (port, url) => {
        setURL(url);
        setDefaultURL(url);
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
    bootContainer();
  }, []);

  return { url, setURL, loading, webContainerInstance, defaultURL };
};

const ExportPDF = () => {
  const [table, updateTable] = useImmer<Array<Array<string>>>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const { url, setURL, loading, webContainerInstance, defaultURL } =
    useExportContainer();

  const onExport = async () => {
    setURL(defaultURL);
    await webContainerInstance.fs.writeFile(
      "table.json",
      JSON.stringify({
        table,
      }),
      {
        encoding: "utf-8",
      }
    );
    setURL(`${defaultURL}/export`);
  };

  return (
    <main>
      <article className="flex flex-col justify-center items-center gap-4">
        <h1 className="font-bold mt-4">EXPORT PDF</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <iframe
            name="export-iframe"
            height={400}
            width={400}
            className="border-black border"
            src={url}
          />
        )}
        <form
          target="export-iframe"
          onSubmit={onExport}
          className="flex flex-col items-center justify-center"
        >
          <button
            disabled={loading}
            type="submit"
            className="w-40 h-10 rounded-lg border border-neutral-500 my-4 m-auto"
          >
            Export Button
          </button>
          <ul className="grid grid-cols-12 gap-2 w-[500px]">
            {table.map((row, rowIndex) =>
              row.map((column, columnIndex) => {
                return (
                  <input
                    className="border-black h-10 w-40 border col-span-4 text-center"
                    key={`${rowIndex} ${columnIndex}`}
                    value={table[rowIndex][columnIndex]}
                    onChange={(event) => {
                      updateTable((draft) => {
                        draft[rowIndex][columnIndex] = event.target.value;
                      });
                    }}
                  />
                );
              })
            )}
          </ul>
        </form>
      </article>
    </main>
  );
};

export default ExportPDF;
