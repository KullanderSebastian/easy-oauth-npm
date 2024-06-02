import jwt, { JwtPayload as JWTJwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';

interface JwtPayload {
    sub: string;
    name: string;
    iat: number;
    aud: string;
}

interface JWK {
    kid: string;
    kty: string;
    n: string;
    e: string;
    d?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;
}

async function verifyIdToken(idToken: string, clientId: string): Promise<JwtPayload> {
    try {
        const { data: googleKeys } = await axios.get('https://www.googleapis.com/oauth2/v3/certs');
        const decoded = jwt.decode(idToken, { complete: true });
        
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }

        const header = decoded.header;

        if (!header || !header.kid) {
            throw new Error('Invalid token header');
        }

        const key = googleKeys.keys.find((k: JWK) => k.kid.toLowerCase() === header.kid!.toLowerCase());

        if (!key) {
            throw new Error('Key not found');
        }

        const publicKey = jwkToPem(key);

        const verifiedToken = jwt.verify(idToken, publicKey, { algorithms: ['RS256'], audience: clientId }) as JWTJwtPayload;

        const tokenAudience = verifiedToken.aud;

        if (tokenAudience !== clientId) {
            throw new Error('Token audience does not match client ID');
        }

        return verifiedToken as JwtPayload;
    } catch (error: any) {
        throw new Error(`Failed to verify ID token: ${error.message}`);
    }
}

export { verifyIdToken };