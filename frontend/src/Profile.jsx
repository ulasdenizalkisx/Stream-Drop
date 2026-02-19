import axios from "axios";
import { useState, useEffect } from "react";
import "./css/Profile.css";
import Sidebar from "./ui/sidebar";
import Overview from "./ui/overview";
import History from "./ui/history";
import Music from "./ui/music";
import Artists from "./ui/artists";
import Albums from "./ui/albums";
import deneme from "./assets/deneme.jpg";
import deneme2 from "./assets/deneme2.jpg";

function Profile() {
    const [name, setName] = useState("Mock User");
    const [topTrackItems, setTopTrackItems] = useState([]);
    const [topAlbumItems, setTopAlbumItems] = useState(null);
    const [topArtistItems, setTopArtistItems] = useState([]);
    const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/150");
    const [follower, setFollower] = useState("0");
    const [isLoading, setIsLoading] = useState(false);
    const [activeItem, setActiveItem] = useState("overview");

    const [timeRange, setTimeRange] = useState("long_term");

    const getUser = async () => {
        try {
            const res = await axios.get("/api/me", { withCredentials: true });
            setName(res.data?.display_name || "Mock User");
            setProfilePicture(res.data?.images?.[1]?.url || res.data?.images?.[0]?.url || "https://via.placeholder.com/150");
            setFollower(res.data?.followers?.total ?? "0");
        } catch (e) {
            console.error("Failed to fetch profile", e);
            if (e.response && e.response.status === 401) {
                window.location.href = "/";
            }
        }
    }

    const getTop = async () => {
        setIsLoading(true);
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
            setTopAlbumItems(topAlbumItems || null);
            setTopArtistItems(topArtistItems || []);
        }
        catch (e) {
            console.error("Failed to fetch top", e);
            //if (e.response && e.response.status === 401) {
            //    window.location.href = "/";
            //}
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        getTop();
    }, [timeRange]);

    return (
        <div className="container">
            <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
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
                            <img src={topTrackItems?.[0]?.album?.images?.[0]?.url ?? deneme} alt="track-img" />
                            <p className="card-title2">{topTrackItems?.[0]?.name ?? "Track Name"}</p>
                        </div>

                        <div className="card">
                            <p className="card-title">Top Album</p>
                            <img src={topAlbumItems?.albumImage ?? deneme} alt="album-img" />
                            <p className="card-title2">{topAlbumItems?.albumName ?? "Album Name"}</p>
                        </div>

                        <div className="card">
                            <p className="card-title">Top Artist</p>
                            <img src={topArtistItems?.[0]?.images?.[0]?.url ?? deneme2} alt="artist-img" />
                            <p className="card-title2">{topArtistItems?.[0]?.name ?? "Artist Name"}</p>
                        </div>
                    </div>
                </div>
                {activeItem === "overview" ? (
                    <Overview timeRange={timeRange} setTimeRange={setTimeRange} />
                ) : activeItem === "history" ? (
                    <History timeRange={timeRange} setTimeRange={setTimeRange} />
                ) : activeItem === "music" ? (
                    <Music timeRange={timeRange} setTimeRange={setTimeRange} />
                ) : activeItem === "artists" ? (
                    <Artists timeRange={timeRange} setTimeRange={setTimeRange} />
                ) : activeItem === "albums" ? (
                    <Albums timeRange={timeRange} setTimeRange={setTimeRange} />
                ) : null}
            </div>
        </div>
    )
}

export default Profile