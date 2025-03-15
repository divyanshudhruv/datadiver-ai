
# 🌊 DataDiver AI

**`datadiver-ai`** is the ultimate tool for 📊 web scraping, transforming 🕸️ unstructured websites into ✨ clean JSON. Easily extract 📝 paragraphs, 📋 lists, 🔗 links, and 🖼️ images with our 🧠 AI-powered processing.

<br>

> [!IMPORTANT]<br>
> Extract **`structured data`** from any website with a simple **`API`**!🚀

<br>

## 🔍 Overview

DataDiver AI is an intelligent web scraping tool that transforms unstructured web pages into **`clean`**, **`organized`** JSON data. Perfect for **`research`**, **`data analysis`**, **`content aggregation`**, and more!

<br>

## ✨ Features

- 🌐 **`Universal Scraping`** - Works with virtually any website
- 🧠 **`AI-Powered`** - Uses Mistral AI for intelligent data processing
- 🧩 **`Structured Output`** - Converts messy HTML into clean, consistent JSON
- 🔄 **`Content Categorization`** - Automatically organizes content by section
- 📊 **`Rich Content Support`** - Extracts paragraphs, lists, links, and images
- 💻 **`Simple API`** - Easy-to-use interface for quick integration

<br>

## 🛠️ Tech Stack

- `⚛️` Next.js + React
- `📘` TypeScript
- `🔍` JSDOM for HTML parsing
- `🧠` Mistral API for optimization
- `🎨` Custom CSS for beautiful UI

<br>

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/divyanshudhruv/datadiver-ai.git

# Navigate to project directory
cd datadiver-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Mistral API key to .env file
```

<br>

## 🚀 Getting Started

```bash
# Start the development server
npm run dev

# Open your browser and navigate to
http://localhost:3000
```

<br>

## 📋 Usage

### Web Interface

1. Enter the **`URL`** you want to scrape
2. Click **`"Scrape"`**
3. View the structured **`JSON`** output

### API Example

```typescript
// Fetch data from a URL
const response = await fetch("/api/scrape", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com" })
});

const data = await response.json();
console.log(data);
```

<br>

## 📊 Example Response

```json
{
  "success": true,
  "url": "https://example.com",
  "data": {
    "title": "Example Website",
    "meta": {
      "description": "This is an example website"
    },
    "content": {
      "about_us": {
        "title": "About Us",
        "items": [
          {
            "type": "paragraph",
            "text": "We are a sample company demonstrating DataDiver AI"
          },
          {
            "type": "list",
            "listType": "unordered",
            "items": ["Feature 1", "Feature 2", "Feature 3"]
          }
        ]
      }
    }
  }
}
```


<br>

## 🤝 Contributing

Contributions are **`welcome`**! Please feel free to submit a **`Pull Request`**.

```bash
# Create a new branch
git checkout -b feature/amazing-feature

# Make your changes and commit them
git commit -m 'Add some amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

<br>

## 📄 License

This project is licensed under the **`MIT License`** - see the **`LICENSE`** file for details.