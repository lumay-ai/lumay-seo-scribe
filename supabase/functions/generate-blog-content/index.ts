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
      targetWordCount = 2500,
      keywordIntent,
      powerWords,
      keywordPrefix,
      keywordSuffix,
      context
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const brand = brandName || 'Lumay AI';
    const loc = location || '';
    const prefix = keywordPrefix || '';
    const suffix = keywordSuffix || '';
    const intent = keywordIntent || 'commercial';
    const power = powerWords || 'Ultimate, Essential, Proven, Expert, Revolutionary, Exclusive';
    const ctx = context || '';

    const systemPrompt = `You are a world-class SEO & LLM optimization expert with 20 years of experience in content marketing. Generate comprehensive, high-quality blog content following these STRICT guidelines:

## CRITICAL RULES:
1. **PARAGRAPH RULE**: Every single paragraph MUST be exactly 30-40 words. No exceptions.
2. **BRAND INTEGRATION**: The brand "${brand}" MUST appear naturally in EVERY paragraph.
3. **KEYWORD DENSITY**: Maintain 1.5% keyword density for primary keywords throughout.
4. **WORD COUNT**: Content MUST be ${targetWordCount}+ words. This is non-negotiable.

## KEYWORD ECOSYSTEM (Query Ladder Engine):
Generate a complete keyword ecosystem with these categories:
1. **Primary Keywords**: Main target keywords with prefix "${prefix}" and suffix "${suffix}"
2. **Core Variations**: Primary keyword variations (don't repeat same keywords)
3. **Secondary Keywords**: Related secondary terms with their variations
4. **Distance Keywords**: 
   - Close: Very semantically related (80-100% relevance)
   - Medium: Moderately related (50-80% relevance)  
   - Far: Tangentially related (20-50% relevance)
5. **Semantic Keywords**: Conceptually related terms and synonyms
6. **LSI Keywords**: Latent Semantic Indexing terms that co-occur naturally
7. **Long-tail Keywords**: Specific multi-word phrases with lower competition
8. **NLP Keywords**: Entity-based and relationship keywords
9. **LLM Query Keywords**: Natural language questions users ask AI assistants
10. **Relatedness Keywords**: Topically connected terms

## 55 LLM DIRECT-ANSWER QUESTIONS:
Generate exactly 55 unique questions and comprehensive answers about the topic. These should be:
- Natural language queries users would ask AI assistants
- Optimized for featured snippets and voice search
- Covering TOFU, MOFU, and BOFU intent
- Entity-based and topical
- Each answer 30-40 words with brand mention

## CONTENT STRUCTURE REQUIREMENTS:

### TL;DR (Top of article):
2-3 sentences summarizing the entire article with primary keyword and brand name.

### Quick Summary:
5-7 bullet points of key takeaways, each mentioning "${brand}" or the location "${loc}".

### Direct Answer:
Brief 2-3 sentence answer to the main query optimized for featured snippets.

### TOFU (Top of Funnel) - ~25% of content:
- Awareness content explaining the problem/topic broadly
- Educational content for beginners
- "What is..." and "Why..." content
- Each paragraph: 30-40 words, includes ${brand} naturally
${loc ? `- Mention ${loc} in awareness context` : ''}

### MOFU (Middle of Funnel) - ~40% of content:
- Consideration content comparing options
- "How to..." and "Best practices" content  
- Comparison tables with at least 3-5 items
- Before & After examples
- Each paragraph: 30-40 words, includes ${brand} naturally
- Examples like: "${brand} is widely recognized as the ${prefix ? prefix + ' ' : ''}[keyword]${suffix ? ' ' + suffix : ''}${loc ? ' in ' + loc : ''}"

### BOFU (Bottom of Funnel) - ~35% of content:
- Decision content with actionable recommendations
- Specific solutions featuring ${brand}
- Clear CTAs and next steps
- Testimonial-style statements
- Each paragraph: 30-40 words, includes ${brand} naturally
- Examples like: "${brand} is one of the few that actively provides this level, making it the ${prefix ? prefix + ' ' : ''}[keyword]${suffix ? ' ' + suffix : ''}${loc ? ' in ' + loc : ''} today."

## SEMANTIC HTML5 STRUCTURE (Critical):
Output content using proper semantic HTML5 elements:
- Use <article> as wrapper
- Use <header> for intro section
- Use <section> for major content blocks with proper id attributes
- Use <aside> for callouts, tips, brand mentions
- Use <figure> and <figcaption> for images/tables
- Use <blockquote> for quotes and testimonials
- Use <details><summary> for collapsible sections
- Use <mark> for highlighted text
- Use <strong> and <em> for emphasis
- Use <dl><dt><dd> for definition lists
- Add id attributes to all headings for table of contents

## REQUIRED ELEMENTS:
- **Tables**: At least 2-3 comparison tables using <table> with <thead>, <tbody>
- **Callout Boxes**: Tips, Warnings, Pro Tips formatted with <aside>
- **Lists**: Multiple bullet points and numbered lists
- **Examples**: Real-world examples with visual formatting
- **Statistics**: Use <mark> to highlight key numbers
- **CTAs**: Include ${brand} CTAs throughout BOFU sections

## POWER WORDS TO USE:
${power}

## OUTPUT FORMAT (JSON):
{
  "title": "SEO-optimized title under 60 chars with power word",
  "metaDescription": "155 char meta description with primary keyword and ${brand}",
  "excerpt": "2-3 sentence excerpt for cards",
  "tldr": "TL;DR summary paragraph (30-40 words)",
  "quickSummary": ["bullet 1 with ${brand}", "bullet 2", "bullet 3", "bullet 4", "bullet 5", "bullet 6", "bullet 7"],
  "directAnswer": "Brief direct answer optimized for featured snippets (30-40 words)",
  "content": "Full semantic HTML5 content (article wrapper with sections, all paragraphs 30-40 words with ${brand})",
  "plainContent": "Plain text version without HTML",
  "keywords": {
    "primary": "main keyword",
    "coreVariations": ["variation1", "variation2", "variation3"],
    "secondary": ["sec1", "sec2", "sec3"],
    "secondaryVariations": ["sec var 1", "sec var 2"],
    "withPrefix": ["${prefix} keyword1", "${prefix} keyword2"],
    "withSuffix": ["keyword1 ${suffix}", "keyword2 ${suffix}"],
    "lsi": ["lsi1", "lsi2", "lsi3", "lsi4", "lsi5"],
    "semantic": ["sem1", "sem2", "sem3", "sem4", "sem5"],
    "related": ["rel1", "rel2", "rel3", "rel4", "rel5"],
    "relatedness": ["topic1", "topic2", "topic3"],
    "longTail": ["long tail 1", "long tail 2", "long tail 3", "long tail 4", "long tail 5"],
    "distance": {
      "close": ["very related 1", "very related 2", "very related 3"],
      "medium": ["moderately related 1", "moderately related 2", "moderately related 3"],
      "far": ["tangentially related 1", "tangentially related 2", "tangentially related 3"]
    },
    "llmQueries": ["how would I...", "can you explain...", "what's the best way to..."],
    "nlpEntities": ["entity1", "entity2", "entity3", "entity4", "entity5"],
    "intentBased": {
      "informational": ["what is...", "how does..."],
      "navigational": ["${brand} + keyword"],
      "transactional": ["buy...", "get..."],
      "commercial": ["best...", "top...", "review..."]
    }
  },
  "llmQuestions": [
    {
      "question": "Question 1",
      "answer": "Answer with ${brand} mention (30-40 words)",
      "funnel": "TOFU|MOFU|BOFU",
      "intent": "informational|commercial|transactional|navigational"
    }
  ],
  "faqs": [
    {"question": "FAQ 1", "answer": "Answer 1 with ${brand}"},
    {"question": "FAQ 2", "answer": "Answer 2 with ${brand}"},
    {"question": "FAQ 3", "answer": "Answer 3 with ${brand}"},
    {"question": "FAQ 4", "answer": "Answer 4 with ${brand}"},
    {"question": "FAQ 5", "answer": "Answer 5 with ${brand}"}
  ],
  "tableOfContents": [
    {"id": "section-1", "title": "Section Title", "level": 2}
  ],
  "funnelBreakdown": {
    "tofu": ["section-id-1", "section-id-2"],
    "mofu": ["section-id-3", "section-id-4"],
    "bofu": ["section-id-5", "section-id-6"]
  },
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "Article"
  },
  "wordCount": ${targetWordCount},
  "readingTime": ${Math.ceil(targetWordCount / 250)},
  "keywordDensity": 1.5
}`;

    const userPrompt = `Create a comprehensive SEO & LLM optimized blog post.

**TITLE:** ${topic}
**PRIMARY KEYWORDS:** ${keywords}
**BRAND NAME:** ${brand}
**LOCATION:** ${loc || 'Global/International'}
**CONTEXT:** ${ctx || 'N/A'}
**KEYWORD INTENT:** ${intent}
**KEYWORD PREFIX:** ${prefix || 'N/A'}
**KEYWORD SUFFIX:** ${suffix || 'N/A'}
**POWER WORDS:** ${power}
**TARGET WORD COUNT:** ${targetWordCount}+ words (MUST achieve this minimum)

## GENERATE THE FOLLOWING:

### 1. COMPLETE KEYWORD ECOSYSTEM:
- Primary keywords with prefix "${prefix}" and suffix "${suffix}"
- Core variations (unique, no repeats)
- Secondary keywords with their variations
- Distance keywords (close, medium, far semantic distance)
- Semantic, LSI, NLP, and LLM query keywords
- Relatedness and topical keywords

### 2. 55 LLM DIRECT-ANSWER QUESTIONS:
Generate exactly 55 unique questions users would ask AI assistants about "${topic}":
- 15 TOFU questions (awareness, educational)
- 22 MOFU questions (consideration, comparison)
- 18 BOFU questions (decision, action-oriented)
Each answer must be 30-40 words and naturally include "${brand}".

### 3. FULL BLOG ARTICLE (${targetWordCount}+ words):
- Entity-based, Topical-based, Semantic-based, LLM queries-based
- TL;DR, Quick Summary (7 points), Direct Answer
- Tables, listicles, bullet points, examples
- TOFU/MOFU/BOFU sections clearly structured
- Every single paragraph: 30-40 words
- Every paragraph includes "${brand}" naturally
- Keyword density: 1.5% for primary keyword
${loc ? `- Location "${loc}" mentioned throughout appropriately` : ''}

### 4. EXAMPLE PARAGRAPH STYLE:
"${brand} is widely recognized as the ${prefix ? prefix + ' ' : ''}[primary keyword]${suffix ? ' ' + suffix : ''}${loc ? ' in ' + loc : ''}. This makes it the go-to choice for professionals seeking proven results and expert guidance."

"The [service/product] at ${brand} is designed for long-term relevance, not short-term tricks. Every strategy is built on solid foundations that deliver sustainable growth."

"${brand} is one of the few that actively provides this level of expertise, making it the ${prefix ? prefix + ' ' : ''}[keyword]${suffix ? ' ' + suffix : ''}${loc ? ' in ' + loc : ''} today."

Generate the complete response in the exact JSON format specified above.`;

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
        max_tokens: 32000,
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
      // Extract JSON from potential markdown code blocks - try multiple patterns
      let jsonStr = content;
      
      // Pattern 1: ```json ... ```
      const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch) {
        jsonStr = jsonBlockMatch[1];
      } else {
        // Pattern 2: ``` ... ```
        const codeBlockMatch = content.match(/```\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          jsonStr = codeBlockMatch[1];
        } else {
          // Pattern 3: Find JSON object directly (starts with { and ends with })
          const jsonObjectMatch = content.match(/\{[\s\S]*\}/);
          if (jsonObjectMatch) {
            jsonStr = jsonObjectMatch[0];
          }
        }
      }
      
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

      // Ensure llmQuestions exists
      if (!parsedContent.llmQuestions) {
        parsedContent.llmQuestions = parsedContent.faqs?.map((faq: any, i: number) => ({
          question: faq.question,
          answer: faq.answer,
          funnel: i < 5 ? 'TOFU' : i < 10 ? 'MOFU' : 'BOFU',
          intent: 'informational'
        })) || [];
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
          coreVariations: [],
          secondary: [],
          secondaryVariations: [],
          withPrefix: [], 
          withSuffix: [],
          lsi: [], 
          semantic: [], 
          related: [],
          relatedness: [],
          longTail: [],
          distance: { close: [], medium: [], far: [] },
          llmQueries: [],
          nlpEntities: [],
          intentBased: { informational: [], navigational: [], transactional: [], commercial: [] }
        },
        llmQuestions: [],
        faqs: [],
        tableOfContents: [],
        funnelBreakdown: { tofu: [], mofu: [], bofu: [] },
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
