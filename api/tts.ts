import type { IncomingMessage, ServerResponse } from 'http';

export async function handleTTS(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'OPENAI_API_KEY not set' }));
    return;
  }

  const body = await new Promise<string>((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => { data += chunk.toString(); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  let text: string;
  let level: string;
  try {
    const parsed = JSON.parse(body) as { text: string; level: string };
    text = parsed.text;
    level = parsed.level;
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  const speedMap: Record<string, number> = {
    children: 0.7,
    beginner: 0.8,
    intermediate: 0.9,
    advanced: 1.0,
  };
  const speed = speedMap[level] ?? 1.0;

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice: 'nova',
      input: text,
      response_format: 'mp3',
      speed,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    res.writeHead(response.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: errText }));
    return;
  }

  const audioBuffer = await response.arrayBuffer();
  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': audioBuffer.byteLength.toString(),
  });
  res.end(Buffer.from(audioBuffer));
}
