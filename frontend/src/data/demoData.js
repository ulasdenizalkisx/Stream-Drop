import topTracks from "./TopTracks.json";
import topAlbums from "./TopAlbums.json";
import topArtists from "./TopArtists.json";
import recentData from "./RecentTracks.json";

export const demoProfile = {
    display_name: "Demo User",
    images: [{ url: "/demo-avatar.svg" }],
    followers: { total: 1420 }
};

export const demoRecent = recentData || [];
export const demoTopTracks = topTracks || [];
export const demoTopAlbums = topAlbums || [];
export const demoTopArtists = topArtists || [];
