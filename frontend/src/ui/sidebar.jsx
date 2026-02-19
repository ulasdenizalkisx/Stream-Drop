import "../css/sidebar.css";
import axios from "axios";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { LayoutDashboard, History, Music, Mic2, Disc } from "lucide-react";

function Sidebar({ activeItem, setActiveItem }) {
    const [name, setName] = useState("Mock User");
    const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/150");
    const [follower, setFollower] = useState("1234");

    const getUser = async () => {
        try {
            const res = await axios.get("/api/me", { withCredentials: true });
            const { display_name, images, followers } = res.data;
            setName(display_name);
            setProfilePicture(images?.[1]?.url || "https://via.placeholder.com/150");
            setFollower(followers?.total ?? "0");
        } catch (e) {
            console.error("Failed to fetch profile", e);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const isActive = (key) => activeItem === key;

    return (
        <div className="sidebar">
            <div className="logo">
                <img className="logo-img" src={logo} alt="Logo" />
                <a href="/profile" className="logo-text">Stream Drop</a>
            </div>

            <div className="pages">
                <button
                    className={`pages-button ${isActive("overview") ? "active" : ""}`}
                    onClick={() => setActiveItem("overview")}
                >
                    <LayoutDashboard /> <span>Overview</span>
                </button>

                <button
                    className={`pages-button ${isActive("history") ? "active" : ""}`}
                    onClick={() => setActiveItem("history")}
                >
                    <History /> <span>History</span>
                </button>

                <button
                    className={`pages-button ${isActive("music") ? "active" : ""}`}
                    onClick={() => setActiveItem("music")}
                >
                    <Music /> <span>Music</span>
                </button>

                <button
                    className={`pages-button ${isActive("artists") ? "active" : ""}`}
                    onClick={() => setActiveItem("artists")}
                >
                    <Mic2 /> <span>Artists</span>
                </button>

                <button
                    className={`pages-button ${isActive("albums") ? "active" : ""}`}
                    onClick={() => setActiveItem("albums")}
                >
                    <Disc /> <span>Albums</span>
                </button>
            </div>

            <div className="profile">
                <img className="profile-picture" src={profilePicture} alt="Profile" />
                <div className="profile-info">
                    <p className="profile-name">{name}</p>
                    <p className="profile-follower">{follower} followers</p>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
