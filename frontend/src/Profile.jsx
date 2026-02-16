import axios from "axios";
import { useState, useEffect } from "react";
import "./css/Profile.css";
import Sidebar from "./ui/sidebar";

function Profile() {
    const [name, setName] = useState("Mock User");
    const [email, setEmail] = useState("mock@example.com");
    const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/150");
    const [follower, setFollower] = useState("1234");

    const getUser = async () => {
        try {
            const res = await axios.get("/api/me");
            const { display_name } = res.data;
            setName(display_name);
        } catch (e) {
            console.error("Failed to fetch profile", e);
            // window.location.href = "/";
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="container">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="content">
                <div className="top-bar">
                    <h1>Welcome Back, {name}</h1>
                </div>
            </div>
        </div>
    )
}

export default Profile