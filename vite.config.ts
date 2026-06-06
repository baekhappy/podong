import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'http'
import { handleTTS } from './api/tts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-routes',
      configureServer(server) {
        server.middlewares.use('/api/tts', (req: IncomingMessage, res: ServerResponse) => {
          handleTTS(req, res).catch((err: unknown) => {
            console.error('[api/tts] error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
          });
        });
      },
    },
  ],
})
