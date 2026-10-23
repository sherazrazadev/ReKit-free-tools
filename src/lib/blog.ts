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
    slug: "merge-multiple-pdfs-in-browser-privately",
    title: "Merge Multiple PDFs Privately in Your Browser",
    description:
      "Combine multiple PDF files into one clean document directly in your browser. 100% private, client-side processing with zero server uploads.",
    date: "2026-10-23",
    minutes: 5,
    category: "PDF",
    toolSlug: "pdf-merge",
    author: "ReKit Team",
    content: {
      problem:
        "Merging confidential PDF documents—such as bank statements, contracts, tax returns, or medical records—using typical online converter tools creates significant security risks. Most web services silently upload your files to remote cloud servers, store them in temporary directories, and expose your private data to potential breaches. Furthermore, server-side tools often enforce file size limits, daily merge quotas, or mandatory paid subscriptions.",
      steps: [
        {
          title: "Select your PDF files",
          body: "Drag and drop two or more PDF documents into the ReKit PDF Merger drop zone, or browse from your device. Your files remain inside your local browser memory and are never uploaded.",
        },
        {
          title: "Verify your file order",
          body: "Ensure your documents are selected in the exact order you want them combined. The merger appends pages sequentially from the first document through to the last.",
        },
        {
          title: "Combine instantly via client-side processing",
          body: "Click Merge to combine all pages using in-memory PDF streams. The browser's local engine compiles the documents without network latency or server queues.",
        },
        {
          title: "Save your combined PDF",
          body: "Once processing completes, your merged document downloads automatically as merged.pdf, ready for archiving, printing, or sharing.",
        },
      ],
      tips: [
        "Ensure none of the source PDF files are password-protected before merging.",
        "Keep total combined file size within your device's available browser memory (typically up to 50MB-100MB works seamlessly).",
        "For legal or formal document packages, ensure page numbers and appendices match your target reading order before merging.",
      ],
      faq: [
        {
          q: "Are my sensitive PDF documents uploaded to your server?",
          a: "No. All PDF merging happens entirely inside your browser using client-side JavaScript (pdf-lib). No files are sent across the internet or stored on external servers.",
        },
        {
          q: "Is there a limit on how many PDF files I can merge at once?",
          a: "No. Because processing is performed entirely by your device's browser, there are no artificial quotas, limits, or paywalls.",
        },
        {
          q: "Does merging PDFs degrade page quality or vector text?",
          a: "No. ReKit performs binary stream page copying, preserving 100% of original vector fonts, high-resolution graphics, and metadata.",
        },
      ],
    },
  },
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
