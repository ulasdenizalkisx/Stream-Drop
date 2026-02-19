import "../css/sidebar.css";
import axios from "axios";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { LayoutDashboard, History, Music, Mic2, Disc } from "lucide-react";

function Sidebar({ activeItem, setActiveItem, userName, profilePicture, follower }) {

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
                    <p className="profile-name">{userName}</p>
                    <p className="profile-follower">{follower} followers</p>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
