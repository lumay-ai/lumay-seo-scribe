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
    const { topic, keywords, brandName, targetWordCount = 2000 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert SEO content writer. Generate comprehensive, high-quality blog content following these strict guidelines:

## Content Structure Requirements:
1. **Title**: Create an SEO-optimized, engaging title (60 chars max)
2. **Meta Description**: Write compelling meta description (155 chars max)
3. **TL;DR**: 2-3 sentence summary at the top
4. **Quick Summary**: Bullet points of key takeaways
5. **Direct Answer**: Brief answer to the main query in 2-3 sentences

## Content Sections (TOFU, MOFU, BOFU):
- **TOFU (Top of Funnel)**: Awareness content - explain the problem/topic broadly
- **MOFU (Middle of Funnel)**: Consideration content - compare options, provide insights
- **BOFU (Bottom of Funnel)**: Decision content - actionable advice, recommendations

## Writing Guidelines:
- Target ${targetWordCount}+ words total
- Keep paragraphs to 30-40 words each
- Maintain 1.5% keyword density for the primary keyword
- Include brand name "${brandName || 'our brand'}" naturally 2-3 times
- Use H2 and H3 headings strategically
- Add natural bullet points throughout
- Include comparison tables where relevant
- Add "Before & After" examples when applicable
- Include real-world examples and case studies

## Keyword Strategy:
Generate and use these keyword types naturally:
- Primary keyword: "${keywords}"
- LSI (Latent Semantic Indexing) keywords: Related conceptual terms
- Semantic keywords: Synonyms and related meanings  
- Related keywords: Associated topics
- Long-tail queries: Question-based searches users might make

## Output Format (JSON):
{
  "title": "SEO-optimized title",
  "metaDescription": "155 char meta description",
  "excerpt": "2-3 sentence excerpt for cards",
  "tldr": "TL;DR summary",
  "quickSummary": ["bullet 1", "bullet 2", "bullet 3"],
  "directAnswer": "Brief direct answer",
  "content": "Full HTML content with proper headings, paragraphs, lists, tables",
  "keywords": {
    "primary": "main keyword",
    "lsi": ["lsi1", "lsi2", "lsi3"],
    "semantic": ["sem1", "sem2", "sem3"],
    "related": ["rel1", "rel2", "rel3"],
    "longTail": ["question1", "question2", "question3"]
  },
  "faqs": [
    {"question": "FAQ 1", "answer": "Answer 1"},
    {"question": "FAQ 2", "answer": "Answer 2"},
    {"question": "FAQ 3", "answer": "Answer 3"}
  ],
  "tableOfContents": [
    {"id": "section-1", "title": "Section Title", "level": 2}
  ],
  "wordCount": 2000,
  "readingTime": 8
}`;

    const userPrompt = `Create a comprehensive blog post about: "${topic}"

Primary Keywords: ${keywords}
Brand Name: ${brandName || 'Not specified'}
Target Word Count: ${targetWordCount}+ words

Generate the complete blog post following all the guidelines. Make it informative, engaging, and optimized for both readers and search engines.`;

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
        max_tokens: 8000,
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
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return raw content if parsing fails
      parsedContent = {
        title: topic,
        content: content,
        metaDescription: topic.substring(0, 155),
        excerpt: topic,
        keywords: { primary: keywords, lsi: [], semantic: [], related: [], longTail: [] },
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
