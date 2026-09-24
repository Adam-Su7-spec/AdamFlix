import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { 
  authenticateGoogleUser, 
  verifyUserOtp, 
  resendUserOtp, 
  inspectLatestEmail,
  isValidGmail 
} from './src/server/authLogic';
import { getEmailAuditLog } from './src/server/emailService';
import { parseVideoSource } from './src/utils/videoUtils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON Body Parser
  app.use(express.json());

  // -------------------------------------------------------------
  // 1. AUTHENTICATION & GOOGLE OAUTH 2.0 API ROUTES
  // -------------------------------------------------------------

  /**
   * Google OAuth 2.0 Login / Registration Endpoint
   * Enforces strict @gmail.com domain check
   */
  app.post('/api/auth/google/verify', async (req: Request, res: Response) => {
    try {
      const { email, name, avatar, googleIdToken } = req.body;
      const result = await authenticateGoogleUser({ email, name, avatar, googleIdToken });
      return res.status(result.status).json(result.body);
    } catch (error: any) {
      console.error('[API /api/auth/google/verify] Error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error during authentication.' 
      });
    }
  });

  /**
   * 6-Digit OTP Verification Endpoint for New Users
   */
  app.post('/api/auth/otp/verify', async (req: Request, res: Response) => {
    try {
      const { email, code, tempSessionId } = req.body;
      const result = await verifyUserOtp({ email, code, tempSessionId });
      return res.status(result.status).json(result.body);
    } catch (error: any) {
      console.error('[API /api/auth/otp/verify] Error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error during OTP verification.' 
      });
    }
  });

  /**
   * Resend Verification Code Endpoint
   */
  app.post('/api/auth/otp/resend', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await resendUserOtp({ email });
      return res.status(result.status).json(result.body);
    } catch (error: any) {
      console.error('[API /api/auth/otp/resend] Error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to resend verification code.' 
      });
    }
  });

  /**
   * Inspect Dispatched Email (Developer & Tester verification preview)
   */
  app.get('/api/auth/otp/inspect', (req: Request, res: Response) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ error: 'Email parameter required.' });
      }
      const record = inspectLatestEmail(email);
      return res.json({ record });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  /**
   * Audit log for all emails
   */
  app.get('/api/email/audit', (_req: Request, res: Response) => {
    return res.json({ logs: getEmailAuditLog() });
  });

  // -------------------------------------------------------------
  // 2. VIDEO STREAM RESOLUTION API
  // -------------------------------------------------------------
  /**
   * Accepts direct link, .m3u8, external server, or iframe code and returns parsed stream info
   */
  app.post('/api/video/resolve', (req: Request, res: Response) => {
    try {
      const { input } = req.body;
      const parsed = parseVideoSource(input || '');
      return res.json({ success: true, ...parsed });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  });

  // Direct ZIP download endpoint for Visual Studio package
  app.get('/api/download/project-zip', (_req: Request, res: Response) => {
    const zipPath = path.resolve(__dirname, 'AdamFlix_VisualStudio_Package.zip');
    return res.download(zipPath, 'AdamFlix_VisualStudio_Package.zip');
  });

  // -------------------------------------------------------------
  // 3. VITE MIDDLEWARES / STATIC ASSETS
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Mount Vite dev server in middleware mode
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AdamFlix Server] Listening on http://0.0.0.0:${PORT}`);
    console.log(`[AdamFlix Server] Strict Security: Gmail-Only (@gmail.com) Access Control Active.`);
  });
}

startServer().catch(err => {
  console.error('[AdamFlix Server] Startup failure:', err);
  process.exit(1);
});
