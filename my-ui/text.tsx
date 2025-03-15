"use client";
import { Copy } from "lucide-react";
import "./text.css";
import { useState } from "react";

// Define the type for the scrape response
interface ScrapeResponse {
  success: boolean;
  url: string;
  data?: any;
  status?: string;
  error?: string;
}

export function Text() {
  const [jsonData, setJsonData] = useState<ScrapeResponse | null | string>("{}");
  const [url, setUrl] = useState("");
  const [scrapeStatus, setScrapeStatus] = useState<string | null>(null);

  const scrapeWebsite = async () => {
    if (!url) return;

    try {
      // Set loading state
      setScrapeStatus("Scraping");

      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to scrape");

      // Update with the response data
      setJsonData(data);
      setScrapeStatus(null);
      setUrl("");
    } catch (error: any) {
      console.error("Error scraping:", error.message);
      setJsonData({ success: false, url, error: error.message });
      setScrapeStatus(null);
    }
  };

  // Function to highlight JSON syntax
  const highlightJson = (json: any) => {
    if (!json) return "";
    return JSON.stringify(json, null, 2)
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:') // Keys
      .replace(/:\s*"([^"]+)"/g, (match, p1) => {
        return match.includes("{") || match.includes("[")
          ? `: <span class="json-list-string">"${p1}"</span>` // Sub-key strings
          : `: <span class="json-string">"${p1}"</span>`; // Normal strings
      })
      .replace(/:\s*(\d+)/g, ': <span class="json-number">$1</span>') // Numbers
      .replace(/:\s*null/g, ': <span class="json-null">null</span>') // Null
      .replace(/{/g, '<span class="json-sub-object">{</span>') // JSON Object Start
      .replace(/\[/g, '<span class="json-sub-array">[</span>') // JSON Array Start
      .replace(/}/g, '<span class="json-sub-object">}</span>') // JSON Object End
      .replace(/\]/g, '<span class="json-sub-array">]</span>') // JSON Array End
      .replace(/\n/g, "<br>")
      .replace(/true/g, '<span class="json-boolean">true</span>')
      .replace(/false/g, '<span class="json-boolean">false</span>')
      .replace(/,/g, '<span class="json-coma">,</span>');

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
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              scrapeWebsite();
              document.activeElement instanceof HTMLElement && document.activeElement.blur();
              setScrapeStatus(null);
            }
          }}
        />
        <button onClick={scrapeWebsite} className="diveButton"  >
          {scrapeStatus ? (
            "Processing..."
          ) : (
            "Scrape"
          )}
        </button>
      </div>
      <div className="code-container"><div className="copy" onClick={() => {
        const textToCopy = typeof jsonData === 'string' 
          ? jsonData 
          : jsonData === null 
            ? "{}" 
            : JSON.stringify(jsonData, null, 2);
        navigator.clipboard.writeText(textToCopy);
      }}><Copy size={16} /></div>
        <pre dangerouslySetInnerHTML={{ __html: highlightJson(jsonData) }} />
      </div>
    </div>
  );
}
