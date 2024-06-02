declare module 'jwk-to-pem' {
    interface JWK {
        kty: string;
        n?: string;
        e?: string;
        d?: string;
        p?: string;
        q?: string;
        dp?: string;
        dq?: string;
        qi?: string;
    }

    function jwkToPem(jwk: JWK, options?: { private: boolean }): string;

    export = jwkToPem;
}