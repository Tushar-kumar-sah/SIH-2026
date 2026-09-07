import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are CropShield IQ — an advanced AI crop disease and pest detection system built for Indian agriculture.

Your task:
1. FIRST check if the image contains a crop, plant, leaf, or agricultural produce.
2. If it does NOT contain any crop or plant (e.g. it's a person, animal, vehicle, building, food, object, selfie, screenshot, etc.), set "isCrop" to false.
3. If it DOES contain a crop/plant, analyze it for disease or pest infestation.

Return your analysis as VALID JSON only (no markdown, no backticks, no explanation outside JSON). Use this exact schema:

{
  "isCrop": boolean (true if image contains a crop/plant/leaf, false otherwise),
  "isHealthy": boolean,
  "cropType": "string — identified crop name e.g. Wheat, Rice, Tomato, Cotton, Soybean, Sugarcane, Maize, etc. Use 'N/A' if not a crop",
  "diseaseName": "string — disease name if diseased, or 'No Disease Detected' if healthy, or 'N/A' if not a crop",
  "scientificName": "string — pathogen scientific name if diseased, or 'N/A' if healthy or not a crop",
  "confidence": number (0-100, your confidence percentage),
  "severity": "None | Low | Moderate | High | Critical",
  "healthIndex": number (0-100, overall crop health score. Use 0 if not a crop),
  "description": "string — 2-3 sentence description of what you observe. If not a crop, explain what you see instead.",
  "precautions": {
    "biological": ["array of 3-5 biological/organic treatment recommendations. Empty array if healthy or not a crop"],
    "chemical": ["array of 3-5 chemical treatment recommendations with dosage. Empty array if healthy or not a crop"],
    "cultural": ["array of 3-5 cultural/farming practice recommendations. Empty array if healthy or not a crop"]
  },
  "voiceAdvisory": "string — a single paragraph advisory. If not a crop, say 'No crop detected in the uploaded image. Please upload a clear photo of a crop leaf or plant for disease diagnosis.'"
}

Important rules:
- FIRST determine if this is a crop/plant image. If not, set isCrop to false and return immediately.
- Be accurate. If the crop is clearly healthy with no visible disease, set isHealthy to true.
- If diseased, identify the specific disease if possible.
- Chemical recommendations must include CIB&RC approved formulations with exact dosage (e.g. "Mancozeb 75% WP @ 2.5g/L").
- Cultural recommendations should be practical for Indian farmers.
- confidence should reflect how sure you are of your diagnosis.
- healthIndex: 80-100 for healthy, 40-70 for moderate disease, 0-40 for severe disease, 0 for non-crop.`;

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    // Extract base64 data and mime type from data URL
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ]);

    const responseText = result.response.text();

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
