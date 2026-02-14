const express = require("express");
const app = express();
const session = require("express-session");
const crypto = require("crypto");
const path = require("path");
const axios = require("axios");
require("dotenv").config({ path: './config/.env' });


function base64url(buf) {
    return buf
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 60 * 60,
        },
    })
);

app.get("/api/login-spotify", (req, res) => {
    const state = base64url(crypto.randomBytes(16));
    req.session.spotify_oauth_state = state;
    req.session.save(() => {
        const scope = ["user-read-email", "user-read-private", "user-top-read"].join(" ");
        const params = new URLSearchParams({
            response_type: "code",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            state,
            show_dialog: "true",
        });

        res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
    });
});

app.get("/api/auth/spotify/callback", async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).send(`Spotify auth error: ${error}`);
    }

    if (req.query.state !== req.session.spotify_oauth_state) {
        return res.status(403).send("State mismatch");
    }

    delete req.session.spotify_oauth_state;

    try {
        const tokenRes = await axios.post("https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Basic " + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
                },
            }
        );

        const { access_token, refresh_token } = tokenRes.data;

        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;
    }

    catch (e) {
        console.error(e);
        res.status(500).send("Token error: " + (e.response ? JSON.stringify(e.response.data) : e.message));
    }
    res.redirect("/profile");

});

app.get("/api/me", async (req, res) => {
    const { access_token } = req.session;
    if (!access_token) {
        return res.status(401).send("Unauthorized");
    }
    const user = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    const { display_name, email, images } = user.data;
    res.json({ display_name, email, images });
});


app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});