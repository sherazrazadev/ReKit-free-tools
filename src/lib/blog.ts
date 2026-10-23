export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  category: "Image" | "PDF" | "Text" | "Utility" | "Security";
  toolSlug?: string; // Connected live tool slug
  author: string;
  content: {
    problem: string;
    steps: { title: string; body: string }[];
    tips?: string[];
    faq: { q: string; a: string }[];
  };
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "convert-jpg-to-word-without-uploading",
    title: "How to Convert JPG to Word Without Uploading",
    description:
      "Convert scanned images and JPG photos into editable Word documents (DOCX) using client-side OCR. 100% private with zero server uploads.",
    date: "2026-10-23",
    minutes: 5,
    category: "Image",
    toolSlug: "jpg-to-word",
    author: "ReKit Team",
    content: {
      problem:
        "Converting images to editable text usually requires uploading sensitive personal documents, legal agreements, or receipts to third-party web servers. Many online converter websites store uploaded files on their servers, posing significant privacy and data leakage risks. Additionally, server queues often impose artificial file size limits or paywalls.",
      steps: [
        {
          title: "Select your JPG image",
          body: "Choose or drag and drop your JPG or JPEG file into the ReKit JPG to Word converter. Your image is loaded directly into browser memory; nothing is uploaded to the cloud.",
        },
        {
          title: "Run on-device OCR extraction",
          body: "Click Convert to run optical character recognition (OCR) via on-device WebAssembly. The browser engine parses character glyphs and reconstructs text blocks locally.",
        },
        {
          title: "Review the extracted text preview",
          body: "Inspect the recognized text in the live editor to ensure headings, numbers, and paragraphs were captured accurately.",
        },
        {
          title: "Download your editable DOCX document",
          body: "Click Download Word (.docx) to generate a native Microsoft Word document styled with proper paragraphs and layout formatting.",
        },
      ],
      tips: [
        "Use high-contrast, evenly lit images with clear text for maximum OCR accuracy.",
        "Straighten skewed photos before conversion to improve paragraph line detection.",
        "Keep file sizes under 20MB for optimal browser memory performance on mobile devices.",
      ],
      faq: [
        {
          q: "Are my documents uploaded to a remote server?",
          a: "No. ReKit uses on-device OCR powered by Tesseract.js and HTML5 Canvas running entirely in your browser. Files never leave your local device.",
        },
        {
          q: "Can I edit the converted file in Microsoft Word or Google Docs?",
          a: "Yes. The generated file is a standard DOCX document fully compatible with Microsoft Word, LibreOffice, and Google Docs.",
        },
        {
          q: "Is there a daily limit on how many images I can convert?",
          a: "No. Because processing is performed entirely by your device's browser, there are no artificial quotas, credits, or paywalls.",
        },
      ],
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function allBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function latestBlogPosts(n = 3): BlogPost[] {
  return allBlogPosts().slice(0, n);
}
