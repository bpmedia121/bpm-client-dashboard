import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { clientContext, format } = await request.json();

    const formatSection =
      format === 'Reel'
        ? `Generate exactly 6 viral Reel ideas (Instagram short-form, 30-60 seconds each). Every single idea must have "format": "Reel" and "platform": "Instagram".`
        : format === 'Long-form'
        ? `Generate exactly 6 viral Long-form ideas (YouTube, 5-15 minutes each). Every single idea must have "format": "Long-form" and "platform": "YouTube".`
        : `Generate exactly 6 ideas: 4 Reels (Instagram) + 2 Long-form (YouTube). Each idea must specify its format.`;

    const prompt = `You are a viral content strategist for premium aesthetic clinics.

Client context:
${clientContext || 'Premium aesthetic clinic in India. Services: Botox, fillers, HydraFacial, dermal treatments. Audience: women 25-45, upper-middle class.'}

${formatSection}

For each idea return this exact JSON structure:
{
  "title": "compelling title under 10 words",
  "why_matters": "1 sentence explaining why this will perform well",
  "format": "Reel" or "Long-form",
  "platform": "Instagram" or "YouTube",
  "viral_score": number between 75 and 95,
  "inspiration_source": "brief note on current trend or insight"
}

Return ONLY a valid JSON array of 6 objects. No preamble, no explanation, no markdown. Just the JSON array starting with [ and ending with ].

Focus themes: Common mistakes, myth-busting, price transparency, behind-the-scenes, doctor authority, patient trust-building, trending procedures (without naming brands).`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text;
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;
    const jsonText = text.slice(jsonStart, jsonEnd);
    const ideas = JSON.parse(jsonText);

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Generate ideas error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate ideas' },
      { status: 500 }
    );
  }
}