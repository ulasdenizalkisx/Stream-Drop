import "../css/overview.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Mic2, Music2, ChevronDown, Users } from "lucide-react";

function Artists({ artists = [], isLoading }) {
    const [visibleCount, setVisibleCount] = useState(20);

    const handleSeeMore = () => {
        setVisibleCount(50);
    };

    return (
        <div className="overview-container">
            <div className="overview-header">
                <h1 className="overview-title">Top Artists</h1>
            </div>

            <section className="recent-section">
                <div className="recent-section-header">
                    <Mic2 size={16} className="recent-section-icon" />
                    <h2 className="recent-section-title">Your Favorite Artists</h2>
                </div>

                <div className="recent-list">
                    {isLoading ? (
                        <div className="recent-empty">
                            <Music2 size={32} className="recent-empty-icon" />
                            <p>Loading artists…</p>
                        </div>
                    ) : artists.length === 0 ? (
                        <div className="recent-empty">
                            <Music2 size={32} className="recent-empty-icon" />
                            <p>No artists found.</p>
                        </div>
                    ) : (
                        <>
                            {artists.slice(0, visibleCount).map((artist, index) => (
                                <div key={index} className="recent-row">
                                    <span className="recent-index">{index + 1}</span>
                                    <img
                                        src={artist.images?.[1]?.url || artist.images?.[0]?.url}
                                        alt={artist.name}
                                        className="recent-album-art"
                                        style={{ borderRadius: '50%' }}
                                    />
                                    <div className="recent-info">
                                        <p className="recent-track-name">{artist.name}</p>
                                        <p className="recent-artist" style={{ textTransform: 'capitalize' }}>
                                            {artist.genres?.slice(0, 3).join(", ")}
                                        </p>
                                    </div>
                                    <div className="recent-album-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Users size={14} opacity={0.5} />
                                        <span>{artist.followers?.total?.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}

                            {artists.length > visibleCount && (
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

export default Artists;