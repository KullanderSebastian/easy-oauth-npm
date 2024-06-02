import axios from "axios";
import { stringify } from "querystring";

interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token?: string;
    id_token: string;
}

async function getTokens(clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<TokenResponse> {
    try {
        const { data } = await axios.post("https://oauth2.googleapis.com/token", stringify({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code"
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to refresh access token: ${error.response ? error.response.data.error : error.message}`);
        } else {
            throw new Error(`Failed to refresh access token: ${String(error)}`);
        }
    }
}

export { getTokens, TokenResponse };