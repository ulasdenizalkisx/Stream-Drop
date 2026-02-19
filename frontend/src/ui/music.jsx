import "../css/overview.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Music as MusicIcon, Music2, ChevronDown } from "lucide-react";

function Music({ tracks = [], isLoading }) {
    const [visibleCount, setVisibleCount] = useState(20);

    const handleSeeMore = () => {
        setVisibleCount(50);
    };

    return (
        <div className="overview-container">
            <div className="overview-header">
                <h1 className="overview-title">Top Tracks</h1>
            </div>

            <section className="recent-section">
                <div className="recent-section-header">
                    <MusicIcon size={16} className="recent-section-icon" />
                    <h2 className="recent-section-title">Your Favorite Tracks</h2>
                </div>

                <div className="recent-list">
                    {isLoading ? (
                        <div className="recent-empty">
                            <Music2 size={32} className="recent-empty-icon" />
                            <p>Loading tracks…</p>
                        </div>
                    ) : tracks.length === 0 ? (
                        <div className="recent-empty">
                            <Music2 size={32} className="recent-empty-icon" />
                            <p>No tracks found.</p>
                        </div>
                    ) : (
                        <>
                            {tracks.slice(0, visibleCount).map((track, index) => (
                                <div key={index} className="recent-row">
                                    <span className="recent-index">{index + 1}</span>
                                    <img
                                        src={track.album?.images?.[1]?.url || track.album?.images?.[0]?.url}
                                        alt={track.name}
                                        className="recent-album-art"
                                    />
                                    <div className="recent-info">
                                        <p className="recent-track-name">{track.name}</p>
                                        <p className="recent-artist">
                                            {track.artists?.map(a => a.name).join(", ")}
                                        </p>
                                    </div>
                                    <p className="recent-album-name">{track.album?.name}</p>
                                    <span className="recent-time">
                                        {Math.floor(track.duration_ms / 60000)}:
                                        {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                                    </span>
                                </div>
                            ))}

                            {tracks.length > visibleCount && (
                                <div className="see-more-container">
                                    <button className="see-more-button" onClick={handleSeeMore}>
                                        <span>See More</span>
                                        <ChevronDown size={18} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Music;
