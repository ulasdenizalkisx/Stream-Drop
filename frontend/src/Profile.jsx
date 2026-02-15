import axios from "axios";
import { useState, useEffect } from "react";
import "./css/Profile.css";

function Profile() {
    const [name, setName] = useState("Mock User");
    const [email, setEmail] = useState("mock@example.com");
    const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/150");
    const [follower, setFollower] = useState("1234");

    const getUser = async () => {
        try {
            const res = await axios.get("/api/me");
            const { display_name, email, images, followers } = res.data;
            setName(display_name);
            setEmail(email);
            setProfilePicture(images[0].url);
            setFollower(followers.total);
        } catch (e) {
            console.error("Failed to fetch profile", e);
            // window.location.href = "/";
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <div className="profile">
                <div className="profile-photo">
                    <img src={profilePicture} alt="Profile" />
                </div>
                <div className="profile-info">
                    <h1>{name}</h1>
                    <p>{email}</p>
                    <p>{follower}</p>
                </div>
                <div className="logo">

                </div>
            </div>
        </>
    )
}

export default Profile