import { Application, Request, Response, NextFunction } from "express";
import passport from "passport";
import { UserProfile } from "./passport-setup";

export function setupAuthRoutes(app: Application) {
    //Google auth
    app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
    app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req: Request, res: Response) => {
        res.redirect("/");
    });

    //Facebook auth
    app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
    app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req: Request, res: Response) => {
        res.redirect("/");
    });

    //Twitter auth
    app.get("/auth/twitter", passport.authenticate("twitter"));
    app.get("/auth/twitter/callback", passport.authenticate("twitter", { failureRedirect: "/login" }), (req: Request, res: Response) => {
        res.redirect("/");
    });

    //Facebook auth
    app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
    app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), (req: Request, res: Response) => {
        res.redirect("/");
    });

    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as UserProfile;
        res.send(`Hello, ${user ? user.displayName : 'Guest'}!`);
    });

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send(`Internal Server Error: ${err.message}`);
    });
}