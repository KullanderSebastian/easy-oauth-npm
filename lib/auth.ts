import { stringify } from "querystring";

function getAuthUrl(clientId: string, redirectUri: string, scope: string[]): string {
    const authUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: scope.join(" "),
        access_type: "offline",
        prompt: "consent"
    };

    return `${authUrl}?${stringify(params)}`;
}

export { getAuthUrl };