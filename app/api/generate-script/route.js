import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { idea } = await request.json();

    const formatGuide =
      idea.format === 'Reel'
        ? 'Reel = 30 to 60 second vertical Instagram video. Fast pace. Strong visual hook in the first 3 seconds. Short punchy lines.'
        : 'Long-form = 5 to 15 minute YouTube video. Deeper storytelling allowed. Intro to body to outro.';

    const prompt = `You are writing a production-ready content script for a premium aesthetic clinic in India.

Video details:
- Title: ${idea.title}
- Why this matters: ${idea.why_matters || 'N/A'}
- Format: ${idea.format}
- Platform: ${idea.platform}
- Format guide: ${formatGuide}

Write a clear, actionable script the doctor can shoot. Premium, calm, authoritative tone.

THE MOST IMPORTANT PART is the main_points — give 5 to 7 specific points the doctor MUST cover in the video. Each point should be one clear sentence. Write them as a numbered list.

Return ONLY valid JSON (no markdown, no preamble) in this exact structure:

{
  "hook": "The first 3 to 5 seconds. One or two strong sentences that grab attention immediately.",
  "main_points": "5 to 7 specific points the doctor must cover. Format exactly like this: 1. First point here. 2. Second point here. 3. Third point. 4. Fourth point. 5. Fifth point. (continue to 6 or 7 if useful)",
  "cta": "One clear call to action at the end. What should the viewer do next.",
  "scenes": "Visual and B-roll suggestions. Where to shoot, what to show, camera angles.",
  "important_lines": "Specific lines the doctor should say word-for-word for credibility.",
  "flow": "Complete video flow from intro to body to outro, as a short storyboard."
}

Return the JSON only. Start with { and end with }.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text;
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonText = text.slice(jsonStart, jsonEnd);
    const script = JSON.parse(jsonText);

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Generate script error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate script' },
      { status: 500 }
    );
  }
}