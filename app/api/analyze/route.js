import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are CropShield IQ — an AI crop disease detection system for Indian agriculture.

Task:
1. Check if image contains a crop/plant/leaf. If NOT (person, animal, vehicle, object, selfie, etc.), set isCrop=false.
2. If it IS a crop, analyze for disease/pest.

Return ONLY valid JSON (no markdown, no backticks). Schema:

{
  "isCrop": boolean,
  "isHealthy": boolean,
  "cropType": "crop name or N/A",
  "diseaseName": "disease name or No Disease Detected or N/A",
  "scientificName": "pathogen name or N/A",
  "confidence": number 0-100,
  "severity": "None|Low|Moderate|High|Critical",
  "healthIndex": number 0-100,
  "description": "2-3 sentences about observation",
  "precautions": {
    "biological": ["3-4 organic treatments"],
    "chemical": ["3-4 CIB&RC approved chemicals with dosage"],
    "cultural": ["3-4 farming practices"]
  },
  "voiceAdvisory": {
    "en": "1 paragraph advisory in English",
    "hi": "same advisory in Hindi (Devanagari)",
    "mr": "same advisory in Marathi (Devanagari)"
  }
}

Rules:
- If not a crop: isCrop=false, healthIndex=0, empty precaution arrays.
- Chemical recs must include dosage (e.g. "Mancozeb 75% WP @ 2.5g/L").
- healthIndex: 80-100 healthy, 40-70 moderate, 0-40 severe.
- Keep voiceAdvisory concise (2-3 sentences each language).`;

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured. Add it to .env.local' },
        { status: 500 }
      );
    }

    // Extract base64 data and mime type from data URL
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    });

    const responseText = response.text;

    // Parse the JSON from Gemini's response (strip any markdown fencing)
    let analysis;
    try {
      const cleaned = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse Gemini response:', responseText);
      return NextResponse.json(
        { error: 'AI returned invalid response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
