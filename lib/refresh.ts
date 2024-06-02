import axios from "axios";
import { stringify } from "querystring";

interface TokenResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    refresh_token?: string;
}

async function refreshAccessToken(clientId: string, clientSecret: string, refreshToken:string): Promise<TokenResponse> {
    try {
        const { data } = await axios.post("https://oauth2.googleapis.com/token", stringify({
            client_secret: clientSecret,
            client_id: clientId,
            refresh_token: refreshToken,
            grant_type: "refresh_token"
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

export { refreshAccessToken };