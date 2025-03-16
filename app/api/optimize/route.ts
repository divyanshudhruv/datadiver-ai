import { NextResponse } from "next/server";

// Define type interfaces for the data structure
interface ScrapeItem {
  type: string;
  text: string;
  [key: string]: any;
}

interface ContentSection {
  title: string;
  level?: number;
  items: ScrapeItem[];
}

interface ScrapedData {
  title: string;
  meta: Record<string, string>;
  content: Record<string, ContentSection>;
}

export async function POST(req: Request) {
  try {
    // Extract data from request
    const data = await req.json();
    
    if (!data) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    // Process with Mistral API to optimize the JSON
    const optimizedData = await optimizeWithMistral(data);

    return NextResponse.json({
      success: true,
      data: optimizedData,
    });
    
  } catch (error: unknown) {
    console.error("Optimization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to optimize data",
      },
      { status: 500 }
    );
  }
}

// Function to optimize JSON with Mistral API
async function optimizeWithMistral(data: ScrapedData) {
  try {
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

    if (!MISTRAL_API_KEY) {
      console.warn(
        "MISTRAL_API_KEY not found in environment variables. Returning unoptimized data."
      );
      return data;
    }

    const prompt = `
      You are a JSON optimization assistant specializing in web content structuring. I have a JSON object from a web scraping operation that needs to be refined.
      
      Please analyze this JSON and improve it with these specific guidelines:
      
      1. Rename keys to be more semantic and descriptive:
         - Use "projects" instead of generic section names if the content is about projects
         - Use "about" for sections describing people or companies
         - Use "services" for sections listing services offered
         - Use "features" for product features
         - Use "team" for team member sections
         - Use "contact" for contact information
         - Use "testimonials" for customer reviews
         - Use other intuitive names based on content
      
      2. Restructure the JSON to be more logical and hierarchical:
         - Group related sections together
         - Organize content by topic rather than just following the HTML structure
         - Create meaningful categories that reflect the actual content
      
      3. Remove any redundancy and duplication:
         - Consolidate duplicate content
         - Remove sections that repeat the same information
         - Keep only the most comprehensive version of duplicated content
      
      4. Simplify the structure where possible:
         - Flatten unnecessarily nested structures
         - Use arrays for lists of similar items
         - Use direct values instead of single-item objects when appropriate
      
      Here is the JSON to optimize:
      ${JSON.stringify(data, null, 2)}
      
      Please return only the optimized JSON object without any explanations.
    `;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mistral API error:", errorText);
      return data; // Return original data if Mistral API fails
    }

    const result = await response.json();

    // Check if the response content is valid JSON
    const responseContent = result.choices[0].message.content.trim();
    try {
      const optimizedJson = JSON.parse(responseContent);
      return optimizedJson;
    } catch (parseError) {
      console.error("Error parsing Mistral response as JSON:", parseError);
      console.error("Response content:", responseContent);
      return data; // Return original data if parsing fails
    }
  } catch (error) {
    console.error("Error in Mistral optimization:", error);
    return data; // Return original data if any error occurs
  }
}
