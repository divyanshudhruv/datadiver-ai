"use client";
import "./text.css";
import { useState } from "react";

export function Text() {
  const [jsonData, setJsonData] = useState(null);
  const [url, setUrl] = useState("");

  const scrapeWebsite = async () => {
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to scrape");

      setJsonData(data);
    } catch (error: any) {
      console.error("Error scraping:", error.message);
    }
  };

  // Function to highlight JSON syntax
  const highlightJson = (json: any) => {
    if (!json) return "";
    return JSON.stringify(json, null, 2)
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:') // Keys
      .replace(/:\s*"([^"]+)"/g, (match, p1) => {
        return match.includes("{") || match.includes("[")
          ? `: <span class="json-sub-string">"${p1}"</span>` // Sub-key strings
          : `: <span class="json-string">"${p1}"</span>`; // Normal strings
      })
      .replace(/:\s*(\d+)/g, ': <span class="json-number">$1</span>') // Numbers
      .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>') // Boolean
      .replace(/:\s*null/g, ': <span class="json-null">null</span>') // Null
      .replace(/{/g, '<span class="json-sub-object">{</span>') // JSON Object Start
      .replace(/\[/g, '<span class="json-sub-array">[</span>') // JSON Array Start
      .replace(/}/g, '<span class="json-sub-object">}</span>') // JSON Object End
      .replace(/\]/g, '<span class="json-sub-array">]</span>') // JSON Array End
      .replace(/\n/g, ""); // Remove newlines
  };

  return (
    <div className="containerText">
      <div className="textTop">Dive Deep into Web Data</div>
      <div className="textBottom">
        Transform any webpage into structured JSON with precision. Extract full
        content or just what you need—clean, fast, and AI-powered.
      </div>
      <div className="inputContainer">
        https://
        <input
          className="websiteInput"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          spellCheck="false"
        />
        <button onClick={scrapeWebsite} className="diveButton">
          Scrape
        </button>
      </div>
      <div className="code-container">
        <pre dangerouslySetInnerHTML={{ __html: highlightJson(jsonData) }} />
      </div>
    </div>
  );
}
