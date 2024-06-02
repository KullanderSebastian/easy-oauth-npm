import { Application, Request, Response } from "express";
import { getAuthUrl } from './auth';
import { getTokens, TokenResponse } from './tokens';
import { verifyIdToken } from './verify';
import { refreshAccessToken } from './refresh';

interface OAuthOptions {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope: string[];
}

function setupGoogleOAuth(app: Application, options: OAuthOptions): void {
    const { clientId, clientSecret, redirectUri, scope } = options;

    app.get("/auth/google", async (req: Request, res: Response) => {
        try {
            const authUrl = getAuthUrl(clientId, redirectUri, scope);
            res.redirect(authUrl);
        } catch (error: any) {
            console.error("Error generating auth URL:", error.message);
            res.status(500).json({ error: "Failed to generate auth URL" });
        }
    });

    app.get('/auth/google/callback', async (req: Request, res: Response) => {
        const code = req.query.code as string;

        try {
            const tokens: TokenResponse = await getTokens(clientId, clientSecret, code, redirectUri);
            const userInfo = await verifyIdToken(tokens.id_token, clientId);

            console.log('Access Token:', tokens.access_token);
            console.log('Refresh Token:', tokens.refresh_token);
            console.log('User Info:', userInfo);

            res.json({ userInfo, tokens });
        } catch (error: any) {
            console.error('Error during authentication:', error.message);
            res.status(500).json({ error: 'Failed to authenticate' });
        }
    });

    app.get('/refresh-token', async (req: Request, res: Response) => {
        const refreshToken = req.query.refresh_token as string;

        try {
            const newTokens = await refreshAccessToken(clientId, clientSecret, refreshToken);
            console.log('New Tokens:', newTokens);

            res.json(newTokens);
        } catch (error: any) {
            console.error('Error during token refresh:', error.message);
            res.status(500).json({ error: 'Failed to refresh token' });
        }
    });
}

export default setupGoogleOAuth;