"use client";

import { useState } from "react";
import { csvToJson, detectDelimiter, jsonToCsv } from "@/lib/workshop/csv";
import { baseName, triggerDownload } from "@/lib/workshop/files";
import { CopyButton, DropZone, ErrorNote, ExportButton, Label, Segmented, btnPrimary, textareaClass } from "./ui";

type Direction = "csv2json" | "json2csv";
type Delim = "auto" | "," | ";" | "\t" | "|";

const DELIMS: { value: Delim; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: ",", label: "Comma" },
  { value: ";", label: "Semicolon" },
  { value: "\t", label: "Tab" },
  { value: "|", label: "Pipe" },
];

export function CsvJsonTool() {
  const [dir, setDir] = useState<Direction>("csv2json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delim, setDelim] = useState<Delim>("auto");
  const [header, setHeader] = useState(true);
  const [infer, setInfer] = useState(true);
  const [error, setError] = useState("");
  const [sourceName, setSourceName] = useState("data");

  const convert = (text = input) => {
    setError("");
    try {
      if (dir === "csv2json") {
        const d = delim === "auto" ? detectDelimiter(text) : delim;
        setOutput(JSON.stringify(csvToJson(text, { delimiter: d, header, infer }), null, 2));
      } else {
        setOutput(jsonToCsv(text, delim === "auto" ? "," : delim));
      }
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Conversion failed.");
    }
  };

  const onFile = async (files: File[]) => {
    const f = files[0];
    const text = await f.text();
    setSourceName(baseName(f.name));
    setInput(text);
    convert(text);
  };

  const outExt = dir === "csv2json" ? "json" : "csv";

  return (
    <div className="flex flex-col gap-5">
      <Segmented<Direction>
        label="Direction"
        value={dir}
        onChange={(d) => {
          setDir(d);
          setOutput("");
          setError("");
        }}
        options={[
          { value: "csv2json", label: "CSV → JSON" },
          { value: "json2csv", label: "JSON → CSV" },
        ]}
      />
      <DropZone
        accept={dir === "csv2json" ? ".csv,.tsv,.txt,text/csv" : ".json,application/json"}
        onFiles={onFile}
        title={`Drop a ${dir === "csv2json" ? "CSV" : "JSON"} file, or paste below`}
        hint="Converted on your device. Your data is never uploaded."
      />
      <label className="flex flex-col gap-2.5">
        <Label>{dir === "csv2json" ? "CSV INPUT" : "JSON INPUT"}</Label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
          className={textareaClass}
          placeholder={dir === "csv2json" ? "name,email,city\nAva,ava@example.com,Oslo" : '[{"name":"Ava","email":"ava@example.com"}]'}
        />
      </label>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10.5px] tracking-[0.14em] text-grey">DELIMITER</span>
          <Segmented<Delim> label="Delimiter" value={delim} onChange={setDelim} options={dir === "json2csv" ? DELIMS.map((d) => (d.value === "auto" ? { ...d, label: "Comma (default)" } : d)).filter((d) => d.value !== ",") : DELIMS} />
        </div>
        {dir === "csv2json" && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-bone-dim">
            <label className="flex items-center gap-2"><input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} className="accent-signal" /> First row is headers</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={infer} onChange={(e) => setInfer(e.target.checked)} className="accent-signal" /> Detect numbers &amp; true/false</label>
          </div>
        )}
        <div><button type="button" onClick={() => convert()} disabled={!input.trim()} className={btnPrimary}>CONVERT →</button></div>
      </div>
      <ErrorNote>{error}</ErrorNote>
      {output && (
        <div className="flex flex-col gap-2.5">
          <Label aside={`${output.split("\n").length} lines`}>OUTPUT</Label>
          <pre className="m-0 max-h-[420px] overflow-auto border border-hairline bg-ink-raised p-4 text-[12.5px] leading-[1.7] text-bone-bright">{output.length > 200_000 ? output.slice(0, 200_000) + "\n… (preview truncated, download for the full file)" : output}</pre>
          <div className="flex flex-wrap gap-2">
            <ExportButton
              action={{ tool: "csv-to-json", action: "download" }}
              onExport={() =>
                triggerDownload(
                  // Excel needs a BOM to open UTF-8 CSVs with accents correctly.
                  new Blob([outExt === "csv" ? "\uFEFF" + output : output], { type: outExt === "csv" ? "text/csv;charset=utf-8" : "application/json" }),
                  `${sourceName}.${outExt}`,
                )
              }
            >
              DOWNLOAD .{outExt.toUpperCase()} →
            </ExportButton>
            <CopyButton text={output} label="COPY OUTPUT" />
          </div>
        </div>
      )}
    </div>
  );
}
