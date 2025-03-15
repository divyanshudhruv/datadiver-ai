// import "./text.css";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import { useState } from "react";

// export default function CodeBlock() {
//   const [jsonData, setJsonData] = useState<{
//     title: string;
//     headings: string[];
//     links: { text: string; href: string | undefined }[];
//     paragraphs: string[];
//   } | null>(null);
//   const [url, setUrl] = useState("");

//   // Function to scrape website data using Cheerio
//   const scrapeWebsite = async () => {
//     try {
//       const { data } = await axios.get(url);
//       const $ = cheerio.load(data);

//       const scrapedData: {
//         title: string;
//         headings: string[];
//         links: { text: string; href: string | undefined }[];
//         paragraphs: string[];
//       } = {
//         title: $("title").text(),
//         headings: [],
//         links: [],
//         paragraphs: [],
//       };

//       $("h1, h2, h3").each((_, el) => {
//         scrapedData.headings.push($(el).text().trim());
//       });

//       $("a").each((_, el) => {
//         scrapedData.links.push({ text: $(el).text().trim(), href: $(el).attr("href") });
//       });

//       $("p").each((_, el) => {
//         scrapedData.paragraphs.push($(el).text().trim());
//       });

//       setJsonData(scrapedData);
//     } catch (error: any) {
//       console.error("Error scraping:", error.message);
//     }
//   };
//   // Function to highlight JSON syntax
//   const highlightJson = (json:any) => {
//     if (!json) return "";
//     return JSON.stringify(json, null, 2)
//       .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:') // Keys
//       .replace(/:\s*"([^"]+)"/g, (match, p1) => {
//         return match.includes("{") || match.includes("[")
//           ? `: <span class="json-sub-string">"${p1}"</span>` // Sub-key strings
//           : `: <span class="json-string">"${p1}"</span>`; // Normal strings
//       })
//       .replace(/:\s*(\d+)/g, ': <span class="json-number">$1</span>') // Numbers
//       .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>') // Boolean
//       .replace(/:\s*null/g, ': <span class="json-null">null</span>') // Null
//       .replace(/{/g, '<span class="json-sub-object">{</span>') // JSON Object Start
//       .replace(/\[/g, '<span class="json-sub-array">[</span>') // JSON Array Start
//       .replace(/}/g, '<span class="json-sub-object">}</span>') // JSON Object End
//       .replace(/\]/g, '<span class="json-sub-array">]</span>'); // JSON Array End
//   };

//   return (
   
// }
