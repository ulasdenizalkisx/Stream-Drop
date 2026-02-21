import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./css/Profile.css";
import Sidebar from "./ui/sidebar";
import Overview from "./ui/overview";
import History from "./ui/history";
import Music from "./ui/music";
import Artists from "./ui/artists";
import Albums from "./ui/albums";
import { demoProfile, demoRecent, demoTopTracks, demoTopAlbums, demoTopArtists } from "./data/demoData";
function Profile() {
    const [searchParams] = useSearchParams();
    const initialPage = searchParams.get("page") || "overview";

    const [name, setName] = useState("Mock User");
    const [topTrackItems, setTopTrackItems] = useState([]);
    const [topAlbumItems, setTopAlbumItems] = useState([]);
    const [topArtistItems, setTopArtistItems] = useState([]);
    const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/150");
    const [follower, setFollower] = useState("0");
    const [recentTracks, setRecentTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeItem, setActiveItem] = useState(initialPage);

    const [timeRange, setTimeRange] = useState("long_term");

    const getUser = async () => {
        if (localStorage.getItem("demoMode") === "true") {
            setName(demoProfile.display_name);
            setProfilePicture(demoProfile.images?.[0]?.url);
            setFollower(demoProfile.followers?.total?.toString());
            return;
        }
        try {
            const res = await axios.get("/api/me", { withCredentials: true });
            setName(res.data?.display_name || "User");
            setProfilePicture(res.data?.images?.[1]?.url || res.data?.images?.[0]?.url || "https://via.placeholder.com/150");
            setFollower(res.data?.followers?.total ?? "0");
        } catch (e) {
            console.error("Failed to fetch profile", e);
            throw e;
        }
    }

    const getRecent = async () => {
        if (localStorage.getItem("demoMode") === "true") {
            setRecentTracks(demoRecent);
            return;
        }
        try {
            const res = await axios.get("/api/recent", {
                params: { limit: 50 },
                withCredentials: true
            });
            setRecentTracks(res.data || []);
            console.log("Recent tracks: ", JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.error("Failed to fetch recent", e);
            throw e;
        }
    }

    const getTop = async () => {
        setIsLoading(true);
        if (localStorage.getItem("demoMode") === "true") {
            let tTracks = [...demoTopTracks];
            let tAlbums = [...demoTopAlbums];
            let tArtists = [...demoTopArtists];

            // Mix up the array depending on the time range to simulate real behavior updates
            if (timeRange === "short_term") {
                tTracks.reverse();
                tAlbums.reverse();
                tArtists.reverse();
            } else if (timeRange === "medium_term") {
                tTracks = [...tTracks.slice(5), ...tTracks.slice(0, 5)];
                tAlbums = [...tAlbums.slice(3), ...tAlbums.slice(0, 3)];
                tArtists = [...tArtists.slice(4), ...tArtists.slice(0, 4)];
            }

            setTopTrackItems(tTracks);
            setTopAlbumItems(tAlbums);
            setTopArtistItems(tArtists);
            setIsLoading(false);
            return;
        }
        try {
            const res = await axios.get("/api/top", {
                params: {
                    time_range: timeRange,
                    t: new Date().getTime()
                },
                withCredentials: true,
            });
            const { topTrackItems, topAlbumItems, topArtistItems } = res.data;
            setTopTrackItems(topTrackItems || []);
            setTopAlbumItems(topAlbumItems || []);
            setTopArtistItems(topArtistItems || []);
            console.log("Top tracks: ", JSON.stringify(topTrackItems, null, 2));
            console.log("Top albums: ", JSON.stringify(topAlbumItems, null, 2));
            console.log("Top artists: ", JSON.stringify(topArtistItems, null, 2));
        }
        catch (e) {
            console.error("Failed to fetch top", e);
        } finally {
            setIsLoading(false);
        }
    }

    const loadData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([getUser(), getRecent()]);
        } catch (e) {
            console.error("Failed to load initial data", e);
            localStorage.setItem("demoMode", "true");
            window.location.reload();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        getTop();
    }, [timeRange]);

    return (
        <div className="container">
            <Sidebar
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                userName={name}
                profilePicture={profilePicture}
                follower={follower}
            />
            <div className="content">
                <div className="top-bar">
                    <div className="title-div">
                        <h1>Welcome Back, {name}</h1>
                    </div>

                    <div className="buttons">
                        <input value="short_term" checked={timeRange === "short_term"} onChange={(e) => setTimeRange(e.target.value)} className="radio" type="radio" name="duration" id="short" />
                        <label className={`radio-label ${timeRange === "short_term" ? "active-radio" : ""}`} htmlFor="short">Short</label>
                        <input value="medium_term" checked={timeRange === "medium_term"} onChange={(e) => setTimeRange(e.target.value)} className="radio" type="radio" name="duration" id="medium" />
                        <label className={`radio-label ${timeRange === "medium_term" ? "active-radio" : ""}`} htmlFor="medium">Medium</label>
                        <input value="long_term" checked={timeRange === "long_term"} onChange={(e) => setTimeRange(e.target.value)} className="radio" type="radio" name="duration" id="long" />
                        <label className={`radio-label ${timeRange === "long_term" ? "active-radio" : ""}`} htmlFor="long">Long</label>
                    </div>

                    <div className="cards">
                        <div className="card">
                            <p className="card-title">Top Track</p>
                            <img src={topTrackItems?.[0]?.album?.images?.[0]?.url} alt="track-img" />
                            <p className="card-title2">{topTrackItems?.[0]?.name}</p>
                        </div>

                        <div className="card">
                            <p className="card-title">Top Album</p>
                            <img src={topAlbumItems?.[0]?.albumImage} alt="album-img" />
                            <p className="card-title2">{topAlbumItems?.[0]?.albumName}</p>
                        </div>

                        <div className="card">
                            <p className="card-title">Top Artist</p>
                            <img src={topArtistItems?.[0]?.images?.[0]?.url} alt="artist-img" />
                            <p className="card-title2">{topArtistItems?.[0]?.name}</p>
                        </div>
                    </div>
                </div>
                {activeItem === "overview" ? (
                    <Overview recent={recentTracks.slice(0, 5)} isLoading={isLoading} />
                ) : activeItem === "history" ? (
                    <History history={recentTracks} isLoading={isLoading} />
                ) : activeItem === "music" ? (
                    <Music tracks={topTrackItems} isLoading={isLoading} />
                ) : activeItem === "artists" ? (
                    <Artists artists={topArtistItems} isLoading={isLoading} />
                ) : activeItem === "albums" ? (
                    <Albums albums={topAlbumItems} isLoading={isLoading} />
                ) : null}
            </div>
        </div>
    )
}

export default Profile