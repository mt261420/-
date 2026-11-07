import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI client with required User-Agent
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    creator: '이정빈 (Lee Jeongbin)',
    hasGemini: !!process.env.GEMINI_API_KEY,
  });
});

// AI Species Classification Endpoint
app.post('/api/classify-species', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', speciesHint, location } = req.body;

    if (!imageBase64 && !speciesHint) {
      return res.status(400).json({ error: '이미지 데이터 또는 생물 힌트가 필요합니다.' });
    }

    if (!ai) {
      // Fallback if no API key is provided
      return res.json({
        fallback: true,
        name: speciesHint || '가시박 (Sicyos angulatus)',
        scientificName: 'Sicyos angulatus',
        category: 'invasive',
        designation: '환경부 지정 생태계교란 생물',
        confidence: 88,
        description: '하천변과 숲 가장자리를 뒤덮어 기존 수목을 고사시키는 대표적 외래 유해 덩굴 식물입니다.',
        threatLevel: 4,
        conservationPriority: 1,
        rpgHp: 280,
        rpgAtk: 45,
        weakness: '뿌리째 뽑기 및 덩굴 줄기 절단',
        ecologicalImpact: '햇빛을 차단하여 토종 버드나무와 물억새를 질식시키고 식생 다양성을 급감시킵니다.',
        tips: '개화 전 5~6월에 뿌리를 뽑아 건조 제거하는 것이 가장 효과적입니다.',
      });
    }

    const systemPrompt = `당신은 '이정빈 생태 연구소'의 수석 AI 생물 분석관입니다.
대한민국 환경부 및 국립생태원의 최신 생물 기준에 따라 업로드된 사진이나 생물 정보를 정밀 감정합니다.
특히 대한민국 '멸종위기 야생생물(I급/II급)' 또는 '생태계교란 생물(환경부 지정 38종+ 외래 유해종)' 여부를 엄격하게 판별하고,
RPG 게임 스탯(체력, 공격력, 약점, 정화/구조 방법)을 함께 부여합니다.

반드시 다음 JSON 형식만 순수하게 반환하세요:
{
  "name": "국명 (예: 가시박, 수달, 뉴트리아, 맹꽁이 등)",
  "scientificName": "학명 (예: Lutra lutra)",
  "category": "endangered" 또는 "invasive" 또는 "native",
  "designation": "멸종위기 야생생물 I급" 또는 "멸종위기 야생생물 II급" 또는 "생태계교란 생물" 또는 "일반 야생생물",
  "confidence": 95,
  "description": "생태적 특징, 크기, 서식 환경 설명 (한국어 2-3문장)",
  "threatLevel": 1부터 5까지의 숫자 (교란종의 경우 생태계 위협도, 멸종위기종의 경우 1),
  "conservationPriority": 1부터 5까지의 숫자 (멸종위기종의 경우 긴급 보호도 5, 교란종의 경우 1),
  "rpgHp": 150부터 500 사이의 체력 정수,
  "rpgAtk": 20부터 80 사이의 공격력 정수,
  "weakness": "정화/포획/물리퇴치 약점 (예: 개화 전 뿌리 뽑기, 천적 방제, 서식지 차단)",
  "ecologicalImpact": "우리 동네 생태계에 미치는 영향 상세 설명",
  "tips": "이정빈 연구단원을 위한 행동 가이드 (안전 수칙, 수호단 조치 요령)"
}`;

    const parts: any[] = [];
    if (imageBase64) {
      // Strip data:image/...;base64, prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    const promptText = `사진 속 생물을 분석해 주세요.${speciesHint ? ` (사용자 탐사 메모: ${speciesHint})` : ''}${location ? ` (발견 추정 위치: ${JSON.stringify(location)})` : ''}`;
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      ...parsed,
    });
  } catch (error: any) {
    console.error('Classification error:', error);
    return res.status(500).json({
      error: 'AI 생물 분석 중 오류가 발생했습니다.',
      details: error.message,
    });
  }
});

// Vite middleware in dev or static server in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`[Eco-Guardians Server] Produced by Lee Jeongbin (이정빈)`);
    console.log(`Server listening on port ${port} | dev/prod ready`);
  });
}

startServer();
