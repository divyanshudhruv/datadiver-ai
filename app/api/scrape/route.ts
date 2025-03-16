import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize URL
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    // Fetch the HTML content
    const response = await fetch(fullUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch website: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    // Parse HTML using JSDOM
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Function to extract structured data based on HTML hierarchy
    const extractStructuredData = () => {
      // Extract page title
      const pageTitle = document.title || "Untitled Page";

      // Initialize result object

      const result: {
        title: string;
        meta: { [key: string]: string };
        content: {
          [key: string]: {
            title: string;
            level?: number;
            items: Array<
              | { type: "paragraph"; text: string }
              | { type: "link"; url: string; text: string }
              | { type: "image"; src: string; alt: string }
              | {
                  type: "list";
                  listType: "unordered" | "ordered";
                  items: string[];
                }
            >;
          };
        };
      } = {
        title: pageTitle,
        meta: {},
        content: {},
      };

      // Extract meta information (keeping it minimal)
      const metaTags = document.querySelectorAll(
        'meta[name="description"], meta[property="og:description"]'
      );
      metaTags.forEach((meta) => {
        const name =
          meta.getAttribute("name") || meta.getAttribute("property") || "";
        const content = meta.getAttribute("content");
        if (name && content) {
          const key = name.replace("og:", "");
          result.meta[key] = content;
        }
      });

      // Helper function to clean text
      const cleanText = (text: string): string => {
        // Remove extra whitespace
        return text.replace(/\s+/g, " ").trim();
      };

      // Helper function to check if an element is likely to contain important content
      const isContentRich = (element: Element): boolean => {
        // Skip elements with minimal text content
        const text = element.textContent?.trim() || "";
        if (text.length < 20) return false;

        // Skip navigation, footer, header elements
        const id = element.id?.toLowerCase() || "";
        const className = (
          typeof element.className === "string" ? element.className : ""
        ).toLowerCase();

        // Skip common non-content elements
        const skipPatterns = [
          "nav",
          "navigation",
          "menu",
          "footer",
          "header",
          "banner",
          "cookie",
          "popup",
          "modal",
          "sidebar",
          "widget",
          "ad-",
          "advertisement",
          "social",
          "share",
          "comment",
        ];

        for (const pattern of skipPatterns) {
          if (id.includes(pattern) || className.includes(pattern)) {
            return false;
          }
        }

        // Check for content indicators
        const contentPatterns = [
          "content",
          "article",
          "post",
          "main",
          "body",
          "text",
          "story",
          "entry",
          "blog",
          "news",
          "description",
          "info",
        ];

        for (const pattern of contentPatterns) {
          if (id.includes(pattern) || className.includes(pattern)) {
            return true;
          }
        }

        // Check for content-rich elements
        const contentElements = element.querySelectorAll(
          "p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote"
        );
        if (contentElements.length >= 2) {
          return true;
        }

        return false;
      };

      // Track processed headings to avoid duplication
      const processedHeadingTexts = new Set<string>();

      // Process headings and create a structured content map
      const processHeadings = () => {
        // Find all heading elements
        const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        const processedElements = new Set<Element>();

        headings.forEach((heading, index) => {
          const headingText =
            heading.textContent?.trim() || `Section ${index + 1}`;

          // Skip if we've already processed this heading text to avoid duplication
          if (processedHeadingTexts.has(headingText)) return;
          processedHeadingTexts.add(headingText);

          const headingLevel = parseInt(heading.tagName.substring(1));

          // Create a section key based on heading text
          const sectionKey = headingText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "")
            .substring(0, 30);

          // Skip if the section already exists
          if (result.content[sectionKey]) return;

          // Initialize section with basic info
          result.content[sectionKey] = {
            title: headingText,
            level: headingLevel,
            items: [],
          };

          processedElements.add(heading);

          // Find content between this heading and the next heading of same or higher level
          let currentNode = heading.nextElementSibling;

          while (currentNode && !processedElements.has(currentNode)) {
            const nodeName = currentNode.nodeName.toLowerCase();

            // Stop if we hit another heading of same or higher level
            if (/^h[1-6]$/.test(nodeName)) {
              const nextLevel = parseInt(nodeName.substring(1));
              if (nextLevel <= headingLevel) break;
            }

            // Process based on element type
            if (["p"].includes(nodeName)) {
              const text = currentNode.textContent?.trim();
              if (text && text.length > 10) {
                // Only include meaningful text
                result.content[sectionKey].items.push({
                  type: "paragraph",
                  text: cleanText(text),
                });
              }
            } else if (
              nodeName === "a" &&
              !currentNode.parentElement?.closest("li")
            ) {
              // Only include standalone links (not in lists)
              const href = currentNode.getAttribute("href");
              const text = currentNode.textContent?.trim();
              if (href && text && text.length > 3) {
                result.content[sectionKey].items.push({
                  type: "link",
                  url: href,
                  text: cleanText(text),
                });
              }
            } else if (nodeName === "img") {
              const src = currentNode.getAttribute("src");
              const alt = currentNode.getAttribute("alt") || "";
              if (src) {
                result.content[sectionKey].items.push({
                  type: "image",
                  src,
                  alt,
                });
              }
            } else if (["ul", "ol"].includes(nodeName)) {
              const listItems = Array.from(currentNode.querySelectorAll("li"))
                .map((li) => cleanText(li.textContent || ""))
                .filter((text) => text.length > 0);

              if (listItems.length > 0) {
                result.content[sectionKey].items.push({
                  type: "list",
                  listType: nodeName === "ul" ? "unordered" : "ordered",
                  items: listItems,
                });
              }
            } else if (nodeName === "div" && isContentRich(currentNode)) {
              // Process content-rich divs
              const paragraphs = currentNode.querySelectorAll("p");
              if (paragraphs.length > 0) {
                Array.from(paragraphs).forEach((p) => {
                  const text = p.textContent?.trim();
                  if (text && text.length > 10) {
                    result.content[sectionKey].items.push({
                      type: "paragraph",
                      text: cleanText(text),
                    });
                  }
                });
              }
            }

            processedElements.add(currentNode);
            currentNode = currentNode.nextElementSibling;
          }

          // Remove section if it has no items
          if (result.content[sectionKey].items.length === 0) {
            delete result.content[sectionKey];
          }
        });

        return processedElements;
      };

      // Process headings first
      const processedElements = processHeadings();

      // Process remaining important content not under headings
      const processRemainingContent = () => {
        // Find major content sections not already processed
        const contentSections = Array.from(
          document.querySelectorAll(
            'article, section, main, [role="main"], [class*="content"], [id*="content"]'
          )
        ).filter(
          (section) => isContentRich(section) && !processedElements.has(section)
        );

        if (contentSections.length > 0) {
          contentSections.forEach((section) => {
            // Skip if already processed or contains processed elements
            let hasProcessedChild = false;
            for (const child of Array.from(section.children)) {
              if (processedElements.has(child)) {
                hasProcessedChild = true;
                break;
              }
            }
            if (hasProcessedChild) return;

            // Try to find a title for this section
            let sectionTitle = "";
            const potentialTitle = section.querySelector(
              "h1, h2, h3, h4, h5, h6"
            );
            if (potentialTitle) {
              sectionTitle = potentialTitle.textContent?.trim() || "";

              // Skip if we've already processed this heading text
              if (processedHeadingTexts.has(sectionTitle)) return;
              processedHeadingTexts.add(sectionTitle);
            }

            // If no heading, try to use id or class
            if (!sectionTitle) {
              const id = section.id;
              if (id && !id.match(/^\d+$/)) {
                sectionTitle = id
                  .replace(/[_-]/g, " ")
                  .replace(/([A-Z])/g, " $1")
                  .trim();
                sectionTitle =
                  sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1);
              }
            }

            // Fallback to a generic title
            if (!sectionTitle) {
              sectionTitle = "Additional Content";
            }

            // Create a section key
            const sectionKey = sectionTitle
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "_")
              .replace(/^_+|_+$/g, "")
              .substring(0, 30);

            // Skip if the section already exists
            if (result.content[sectionKey]) return;

            // Initialize the section
            result.content[sectionKey] = {
              title: sectionTitle,
              items: [],
            };

            // Process paragraphs
            const paragraphs = section.querySelectorAll("p");
            if (paragraphs.length > 0) {
              Array.from(paragraphs).forEach((p) => {
                const text = p.textContent?.trim();
                if (text && text.length > 10) {
                  result.content[sectionKey].items.push({
                    type: "paragraph",
                    text: cleanText(text),
                  });
                }
              });
            }

            // Process lists
            const lists = section.querySelectorAll("ul, ol");
            lists.forEach((list) => {
              const listItems = Array.from(list.querySelectorAll("li"))
                .map((li) => cleanText(li.textContent || ""))
                .filter((text) => text.length > 0);

              if (listItems.length > 0) {
                result.content[sectionKey].items.push({
                  type: "list",
                  listType:
                    list.nodeName.toLowerCase() === "ul"
                      ? "unordered"
                      : "ordered",
                  items: listItems,
                });
              }
            });

            // Remove section if it has no items
            if (result.content[sectionKey].items.length === 0) {
              delete result.content[sectionKey];
            }
          });
        }
      };

      processRemainingContent();

      // Remove content object if empty
      if (Object.keys(result.content).length === 0) {
        result.content = {}; // Works without type issues
      }

      return result;
    };

    // Extract structured data
    const structuredData = extractStructuredData();

    // Return structured data directly without Mistral optimization
    return NextResponse.json({
      success: true,
      url: fullUrl,
      data: structuredData,
    });

    /* Commented out Mistral API optimization to reduce API latency and prevent timeouts
    // Process with Mistral API to optimize the JSON
    const optimizedData = await optimizeWithMistral(structuredData);

    return NextResponse.json({
      success: true,
      url: fullUrl,
      data: optimizedData,
    });
    */
  } catch (error: unknown) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to scrape website",
      },
      { status: 500 }
    );
  }
}
