const express = require("express");
const app = express();
const session = require("express-session");
const crypto = require("crypto");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

const envPath = path.join(__dirname, "config/.env");
dotenv.config({ path: envPath });

function base64url(buf) {
    return buf
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function computeTopAlbumFromTracks(tracks) {
    const albumMap = new Map();

    const limit = tracks.length;

    tracks.forEach((t, index) => {
        const album = t.album;
        if (!album?.id) return;

        const weight = (limit - index);
        const entry = albumMap.get(album.id) || {
            albumId: album.id,
            albumName: album.name,
            albumImage: album.images?.[0]?.url,
            score: 0,
            trackCount: 0,
            albumArtists: album.artists.map((artist) => artist.name).join(", "),
            albumReleaseDate: album.release_date,
        };

        entry.score += weight;
        entry.trackCount += 1;

        albumMap.set(album.id, entry);
    });

    const albums = Array.from(albumMap.values());
    albums.sort((a, b) => b.score - a.score);

    return albums;
}

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        },
    })
);

app.get("/api/login-spotify", (req, res) => {
    const state = base64url(crypto.randomBytes(16));
    const next = req.query.next;
    req.session.spotify_oauth_state = state;
    if (next) {
        req.session.next = next;
    }
    req.session.save(() => {
        const scope = ["user-read-email", "user-read-private", "user-top-read", "user-read-recently-played"].join(" ");
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
    console.log("Callback hit. Code:", !!code, "State:", state, "Error:", error);

    if (error) {
        return res.status(400).send(`Spotify auth error: ${error}`);
    }

    if (req.query.state !== req.session.spotify_oauth_state) {
        return res.status(403).send("State mismatch");
    }

    delete req.session.spotify_oauth_state;

    try {
        console.log("Exchanging code for token with redirect_uri:", process.env.SPOTIFY_REDIRECT_URI);
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
    req.session.save(() => {
        const next = req.session.next;
        delete req.session.next;
        if (next) {
            res.redirect(`/profile?page=${next}`);
        } else {
            res.redirect("/profile");
        }
    });
});

app.get("/api/me", async (req, res) => {
    const { access_token } = req.session;
    if (!access_token) {
        return res.status(401).send("Unauthorized");
    }
    if (req.session.user) {
        return res.json(req.session.user);
    }
    try {
        const user = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const { display_name, email, images, followers } = user.data;
        const userData = { display_name, email, images, followers };
        req.session.user = userData;
        res.json(userData);
    } catch (e) {
        res.status(500).send("Error fetching user info");
    }
});

app.get("/api/top", async (req, res) => {
    const { time_range } = req.query;
    const { access_token } = req.session;
    if (!access_token) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const [topTrack, topArtist] = await Promise.all([
            axios.get("https://api.spotify.com/v1/me/top/tracks", {
                headers: { Authorization: `Bearer ${access_token}` },
                params: { time_range: time_range, limit: 50 },
            }),
            axios.get("https://api.spotify.com/v1/me/top/artists", {
                headers: { Authorization: `Bearer ${access_token}` },
                params: { time_range: time_range, limit: 50 },
            })
        ]);

        const topAlbumItems = computeTopAlbumFromTracks(topTrack.data.items);
        const topTrackItems = topTrack.data.items;
        const topArtistItems = topArtist.data.items;


        res.json({ topTrackItems, topArtistItems, topAlbumItems });
    }
    catch (e) {
        if (e.response && (e.response.status === 401 || e.response.status === 429)) {
            return res.status(e.response.status).send(e.response.status === 401 ? "Unauthorized" : "Too Many Requests");
        }
        return res.status(500).send("Error: " + (e.response ? JSON.stringify(e.response.data) : e.message));
    }

});

app.get("/api/recent", async (req, res) => {
    const limit = req.query.limit;
    const { access_token } = req.session;
    if (!access_token) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const recentTracks = await axios.get("https://api.spotify.com/v1/me/player/recently-played", {
            headers: { Authorization: `Bearer ${access_token}` },
            params: { limit: limit },
        });
        res.json(recentTracks.data.items);
    }
    catch (e) {
        if (e.response && (e.response.status === 401 || e.response.status === 429)) {
            return res.status(e.response.status).send(e.response.status === 401 ? "Unauthorized" : "Too Many Requests");
        }
        res.status(500).send("Error: " + (e.response ? JSON.stringify(e.response.data) : e.message));
    }
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});