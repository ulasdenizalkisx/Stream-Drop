import axios from "axios";
import { useState, useEffect } from "react";

function Profile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    const getUser = async () => {
        try {
            const res = await axios.get("/api/me");
            const { display_name, email, images } = res.data;
            setName(display_name);
            setEmail(email);
            setProfilePicture(images[0].url);
        } catch (e) {
            console.error("Failed to fetch profile", e);
            window.location.href = "/";
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <div className="alligner">
                <h1>Profile</h1>
                <p>Name: {name}</p>
                <p>Email: {email}</p>
                <img src={profilePicture} alt="Profile" />
            </div>
        </>
    )
}

export default Profile