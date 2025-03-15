import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const url2 = "https://" + url;
    console.log("🔍 Fetching URL:", url2);

    // Fetch the website
    const { data } = await axios.get(url2, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    console.log("✅ Page Loaded Successfully");

    const $ = cheerio.load(data);
    const scrapedData = {
      title: $("title").text(),
      headings: $("h1, h2, h3")
        .map((_, el) => $(el).text().trim())
        .get(),
      links: $("a")
        .map((_, el) => ({
          text: $(el).text().trim(),
          href: $(el).attr("href"),
        }))
        .get(),
      paragraphs: $("p")
        .map((_, el) => $(el).text().trim())
        .get(),
    };

    console.log("📌 Raw Data Extracted:", scrapedData);

    // Send data to Mistral AI for structuring
    const structuredData = scrapedData; // await sendToMistral(scrapedData);
    console.log("🤖 Mistral AI Response:", structuredData);

    return NextResponse.json(structuredData);
  } catch (error: any) {
    console.error("❌ Server Error:", error.message);
    return NextResponse.json(
      { error: "Error scraping website", details: error.message },
      { status: 500 }
    );
  }
}

// Function to send data to Mistral AI
// async function sendToMistral(data: any) {
//   const apiKey = process.env.MISTRAL_API_KEY;
//   if (!apiKey) {
//     console.error("❌ Error: Mistral API key is missing!");
//     throw new Error("Mistral API key is missing!");
//   }

//   try {
//     const response = await axios.post(
//       "https://api.mistral.ai/v1/chat/completions",
//       {
//         model: "mistral-medium",
//         messages: [
//           {
//             role: "system",
//             content:
//               "Structure this JSON properly without losing words. ALSO JUST GIVE NORMAL JSON WITHOUT CODEBLOCK AND DO NOT WRITE ANYTHING EXCEPT JSON IN SIMPLE TEXT. SEGRATE THE JSON INTO MORE SUBJSON AS POSSIBLE AND SEGREGATE IT ACCORDING TO YOU, IF THERE IS TEXT UNDER HEADING WHICH SEEMS LIKE PROJECT THEN SEGRATE IT INTO PROJECTS, SAME FOR NAVBARS,FOOTERS, AND GIVE RESPONSE IN ORDERED MANNER UNDER THE HEADING.",
//           },
//           {
//             role: "user",
//             content: `Format this JSON:\n${JSON.stringify(data)}`,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return structuredData;
//   } catch (mistralError: any) {
//     console.error(
//       "❌ Mistral API Error:",
//       mistralError.response?.data || mistralError.message
//     );
//     throw new Error("Mistral API request failed");
//   }

