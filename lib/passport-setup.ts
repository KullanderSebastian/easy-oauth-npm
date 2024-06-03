import passport from "passport";
import { Strategy as GoogleStrategy} from "passport-google-oauth20";
import { Strategy as FacebookStrategy} from "passport-facebook";
import { Strategy as TwitterStrategy} from "passport-twitter";
import { Strategy as GitHubStrategy} from "passport-github2";
import { Application } from "express";

interface CommonOAuthProviderConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}

interface TwitterOAuthProviderConfig {
    consumerKey: string;
    consumerSecret: string;
    callbackURL: string;
}

export interface UserProfile {
    id: string;
    displayName: string;
    emails?: { value: string }[];
    photos?: { value: string }[];
}

passport.serializeUser((user: any, done) => {
    try {
        done(null, user);
    } catch (error) {
        done(error);
    }
});

passport.deserializeUser((obj: any, done) => {
    try {
        done(null, obj);
    } catch (error) {
        done(error);
    }
});

function setupStrategy(
    provider: string, 
    config: CommonOAuthProviderConfig | TwitterOAuthProviderConfig, 
    verifyCallback: (
        accessToken: string, 
        refreshToken: string, 
        profile: UserProfile, 
        done: (error: any, user?: any) => void
    ) => void
) {
    try {
        switch (provider) {
            case "google":
                passport.use(new GoogleStrategy(config as CommonOAuthProviderConfig, verifyCallback));
                break;
            case "facebook":
                passport.use(new FacebookStrategy(config as CommonOAuthProviderConfig, verifyCallback));
                break;
            case "twitter":
                passport.use(new TwitterStrategy(config as TwitterOAuthProviderConfig, verifyCallback));
                break;
            case "github":
                passport.use(new GitHubStrategy(config as CommonOAuthProviderConfig, verifyCallback));
                break;
            default:
                throw new Error("Unsupported provider");
        }
    } catch (error) {
        console.error(`Error setting up ${provider} strategy:`, error);
    }
}

export function initializePassport(app: Application, providers: { [key: string]: CommonOAuthProviderConfig | TwitterOAuthProviderConfig }) {
    app.use(passport.initialize());
    app.use(passport.session());

    for (const provider in providers) {
        if (providers.hasOwnProperty(provider)) {
            try {
                setupStrategy(provider, providers[provider], (accessToken, refreshToken, profile, done) => {
                    //here can save to db
                    return done(null, profile);
                });
            } catch (error) {
                console.error(`Error initializing strategy for ${provider}:`, error);
            }
        }
    }
}