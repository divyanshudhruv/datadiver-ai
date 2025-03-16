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

// Define the type for the optimize response
interface OptimizeResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export function Text() {
  const [jsonData, setJsonData] = useState<ScrapeResponse | OptimizeResponse | null | string>(
    "{}"
  );
  const [url, setUrl] = useState("");
  const [scrapeStatus, setScrapeStatus] = useState<string | null>(null);

  const scrapeWebsite = async () => {
    if (!url) return;

    try {
      // Set loading state
      setScrapeStatus("Scraping");

      // Step 1: Scrape the website
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const scrapeData = await scrapeResponse.json();
      if (!scrapeResponse.ok) throw new Error(scrapeData.error || "Failed to scrape");

      // Update status for optimization phase
      setScrapeStatus("Optimizing");

      // Step 2: Send the scraped data to the optimize endpoint
      try {
        const optimizeResponse = await fetch("/api/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scrapeData.data),
        });

        const optimizeData = await optimizeResponse.json();
        
        if (optimizeResponse.ok) {
          // Use the optimized data
          const finalData = {
            success: true,
            url: scrapeData.url,
            data: optimizeData.data,
          };
          setJsonData(finalData);
        } else {
          // Fallback to scraped data if optimization fails
          console.warn("Optimization failed, using scraped data instead:", optimizeData.error);
          setJsonData(scrapeData);
        }
      } catch (optimizeError) {
        // Fallback to scraped data if optimization fails
        console.warn("Optimization error, using scraped data instead:", optimizeError);
        setJsonData(scrapeData);
      }

      // Reset status and clear input
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
              document.activeElement instanceof HTMLElement &&
                document.activeElement.blur();
            }
          }}
        />
        <button onClick={scrapeWebsite} className="diveButton">
          {scrapeStatus === "Scraping" ? "Scraping..." : 
           scrapeStatus === "Optimizing" ? "Optimizing..." : "Scrape"}
        </button>
      </div>
      <div className="code-container">
        <button
          className="copy"
          onClick={() => {
            const textToCopy =
              typeof jsonData === "string"
                ? jsonData
                : jsonData === null
                ? "{}"
                : JSON.stringify(jsonData, null, 2);
            navigator.clipboard.writeText(textToCopy);
          }}
        >
          <Copy size={16} />
        </button>
        <pre dangerouslySetInnerHTML={{ __html: highlightJson(jsonData) }} />
      </div>
    </div>
  );
}
