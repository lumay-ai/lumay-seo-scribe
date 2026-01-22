import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      topic, 
      keywords, 
      brandName, 
      location,
      targetWordCount = 2000,
      keywordIntent,
      powerWords,
      keywordPrefix,
      keywordSuffix
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const brandInfo = brandName ? `Brand: ${brandName}` : 'Brand: Lumay AI';
    const locationInfo = location ? `Target Location: ${location}` : '';
    const prefixInfo = keywordPrefix ? `Keyword Prefix: ${keywordPrefix}` : '';
    const suffixInfo = keywordSuffix ? `Keyword Suffix: ${keywordSuffix}` : '';
    const intentInfo = keywordIntent ? `Keyword Intent: ${keywordIntent}` : '';
    const powerWordsInfo = powerWords ? `Power Words to Include: ${powerWords}` : '';

    const systemPrompt = `You are an expert SEO content writer and keyword strategist. Generate comprehensive, high-quality blog content with advanced keyword research following these strict guidelines:

## QUERY LADDER KEYWORD ENGINE:
Generate a complete keyword ecosystem using these strategies:
1. **Primary Keywords**: Main target keywords with prefix "${keywordPrefix || ''}" and suffix "${keywordSuffix || ''}"
2. **Distance Keywords**: Related keywords at varying semantic distances (close, medium, far)
3. **Semantic Keywords**: Conceptually related terms and synonyms
4. **LSI Keywords**: Latent Semantic Indexing terms that co-occur naturally
5. **Long-tail Keywords**: Specific multi-word phrases with lower competition
6. **LLM Query Keywords**: Natural language questions users ask AI assistants
7. **NLP Keywords**: Entity-based and relationship keywords
8. **Intent-based Keywords**: Informational, navigational, transactional, commercial

## Content Structure Requirements:
1. **Title**: SEO-optimized, engaging title (60 chars max) with power words
2. **Meta Description**: Compelling meta description (155 chars max)
3. **TL;DR**: 2-3 sentence summary at the very top
4. **Quick Summary**: 5-7 bullet points of key takeaways
5. **Direct Answer**: Brief answer to the main query in 2-3 sentences (for featured snippets)

## SEMANTIC HTML STRUCTURE (Critical):
Output content using proper semantic HTML5 elements:
- Use <article> as wrapper
- Use <header> for intro section
- Use <section> for major content blocks with proper aria-labels
- Use <aside> for callouts, tips, brand mentions
- Use <figure> and <figcaption> for images/tables
- Use <blockquote> for quotes and testimonials
- Use <details><summary> for collapsible sections
- Use <mark> for highlighted text
- Use <strong> and <em> for emphasis (not just <b> and <i>)
- Use <dl><dt><dd> for definition lists
- Add id attributes to all headings for table of contents

## Content Sections (TOFU, MOFU, BOFU):
### TOFU (Top of Funnel) - ~30% of content:
- Awareness content explaining the problem/topic broadly
- Educational content for beginners
- "What is..." and "Why..." content

### MOFU (Middle of Funnel) - ~40% of content:
- Consideration content comparing options
- "How to..." and "Best practices" content
- Comparison tables with at least 3-5 items
- Before & After examples

### BOFU (Bottom of Funnel) - ~30% of content:
- Decision content with actionable recommendations
- Specific solutions featuring ${brandInfo}
- Clear CTAs and next steps

## Writing Guidelines:
- Target ${targetWordCount}+ words total (CRITICAL: must meet this)
- **PARAGRAPH RULE**: Each paragraph MUST be 30-40 words, then break
- Maintain 1.5% keyword density for primary keyword
- Include ${brandInfo} naturally in EACH major section (minimum 5 mentions)
- ${locationInfo ? `Mention ${locationInfo} in 2-3 relevant places` : ''}
- Use H2 for major sections, H3 for subsections
- Every section MUST have bullet points or numbered lists
- Include at least 2 comparison tables
- Add 2-3 "Before & After" examples with visual formatting
- Include real-world examples and mini case studies
- Use power words: ${powerWordsInfo || 'Ultimate, Essential, Proven, Expert, Exclusive, Revolutionary'}

## Special Elements to Include:
- **Callout Boxes**: Tips, Warnings, Pro Tips formatted with <aside>
- **Comparison Tables**: At least 2 tables using <table> with <thead>, <tbody>
- **Examples**: Real-world examples with <blockquote> or styled boxes
- **Statistics**: Use <mark> to highlight key numbers
- **CTAs**: Include ${brandInfo} CTAs in BOFU sections

## Output Format (JSON):
{
  "title": "SEO-optimized title with power word",
  "metaDescription": "155 char meta description",
  "excerpt": "2-3 sentence excerpt for cards",
  "tldr": "TL;DR summary paragraph",
  "quickSummary": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"],
  "directAnswer": "Brief direct answer optimized for featured snippets",
  "content": "Full semantic HTML content (article wrapper with sections)",
  "plainContent": "Plain text version without HTML for copying",
  "keywords": {
    "primary": "main keyword",
    "withPrefix": ["prefixed keywords"],
    "withSuffix": ["suffixed keywords"],
    "lsi": ["lsi1", "lsi2", "lsi3", "lsi4", "lsi5"],
    "semantic": ["sem1", "sem2", "sem3", "sem4", "sem5"],
    "related": ["rel1", "rel2", "rel3", "rel4", "rel5"],
    "longTail": ["long tail 1", "long tail 2", "long tail 3"],
    "distance": {
      "close": ["very related term 1", "very related term 2"],
      "medium": ["moderately related 1", "moderately related 2"],
      "far": ["tangentially related 1", "tangentially related 2"]
    },
    "llmQueries": ["how would I...", "can you explain...", "what's the best way to..."],
    "nlpEntities": ["entity1", "entity2", "entity3"],
    "intentBased": {
      "informational": ["what is...", "how does..."],
      "navigational": ["brand + keyword"],
      "transactional": ["buy...", "get..."],
      "commercial": ["best...", "top...", "review..."]
    }
  },
  "faqs": [
    {"question": "FAQ 1", "answer": "Answer 1"},
    {"question": "FAQ 2", "answer": "Answer 2"},
    {"question": "FAQ 3", "answer": "Answer 3"},
    {"question": "FAQ 4", "answer": "Answer 4"},
    {"question": "FAQ 5", "answer": "Answer 5"}
  ],
  "tableOfContents": [
    {"id": "section-1", "title": "Section Title", "level": 2}
  ],
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "Article"
  },
  "wordCount": 2000,
  "readingTime": 8,
  "keywordDensity": 1.5
}`;

    const userPrompt = `Create a comprehensive blog post about: "${topic}"

Primary Keywords: ${keywords}
${intentInfo}
${prefixInfo}
${suffixInfo}
${powerWordsInfo}
${brandInfo}
${locationInfo}
Target Word Count: ${targetWordCount}+ words (MUST achieve this minimum)

Generate the complete blog post with:
1. Full query ladder keyword research
2. Semantic HTML5 structure
3. TOFU/MOFU/BOFU sections clearly defined
4. Multiple comparison tables
5. Before & After examples
6. Short paragraphs (30-40 words each)
7. Brand mentions in each section
8. Plain text version for easy copying

Make it informative, engaging, and optimized for both readers, search engines, and LLM-based search.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    // Parse the JSON response from AI
    let parsedContent;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsedContent = JSON.parse(jsonStr.trim());
      
      // Generate plain text version if not provided
      if (!parsedContent.plainContent && parsedContent.content) {
        parsedContent.plainContent = parsedContent.content
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }
      
      // Auto-generate table of contents from content if not provided
      if (!parsedContent.tableOfContents || parsedContent.tableOfContents.length === 0) {
        const headingRegex = /<h([23])[^>]*id="([^"]+)"[^>]*>([^<]+)<\/h[23]>/gi;
        const tocItems: { level: number; id: string; title: string }[] = [];
        let headingMatch;
        while ((headingMatch = headingRegex.exec(parsedContent.content)) !== null) {
          tocItems.push({
            level: parseInt(headingMatch[1]),
            id: headingMatch[2],
            title: headingMatch[3].replace(/<[^>]*>/g, '').trim()
          });
        }
        parsedContent.tableOfContents = tocItems;
      }
      
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return raw content if parsing fails
      parsedContent = {
        title: topic,
        content: content,
        plainContent: content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(),
        metaDescription: topic.substring(0, 155),
        excerpt: topic,
        keywords: { 
          primary: keywords, 
          withPrefix: [], 
          withSuffix: [],
          lsi: [], 
          semantic: [], 
          related: [], 
          longTail: [],
          distance: { close: [], medium: [], far: [] },
          llmQueries: [],
          nlpEntities: [],
          intentBased: { informational: [], navigational: [], transactional: [], commercial: [] }
        },
        faqs: [],
        tableOfContents: [],
        wordCount: content.split(/\s+/).length,
        readingTime: Math.ceil(content.split(/\s+/).length / 250)
      };
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate content" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
