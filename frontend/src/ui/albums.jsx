import "../css/overview.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Disc, Music2, ChevronDown, Calendar } from "lucide-react";

function Albums({ albums = [], isLoading }) {
    const [visibleCount, setVisibleCount] = useState(20);

    const handleSeeMore = () => {
        setVisibleCount(50);
    };

    return (
        <div className="overview-container">
            <div className="overview-header">
                <h1 className="overview-title">Top Albums</h1>
            </div>

            <section className="recent-section">
                <div className="recent-section-header">
                    <Disc size={16} className="recent-section-icon" />
                    <h2 className="recent-section-title">Your Favorite Albums</h2>
                </div>

                <div className="recent-list">
                    {isLoading ? (
                        <div className="recent-empty">
                            <Music2 size={32} className="recent-empty-icon" />
                            <p>Loading albums…</p>
                        </div>
                    ) : albums.length === 0 ? (
                        <div className="recent-empty">
                            <Music2 size={32} className="recent-empty-icon" />
                            <p>No albums found.</p>
                        </div>
                    ) : (
                        <>
                            {albums.slice(0, visibleCount).map((album, index) => (
                                <div key={index} className="recent-row">
                                    <span className="recent-index">{index + 1}</span>
                                    <img
                                        src={album.albumImage}
                                        alt={album.albumName}
                                        className="recent-album-art"
                                    />
                                    <div className="recent-info">
                                        <p className="recent-track-name">{album.albumName}</p>
                                        <p className="recent-artist">
                                            {album.albumArtists}
                                        </p>
                                    </div>
                                    <div className="recent-album-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Calendar size={14} opacity={0.5} />
                                        <span>{album.albumReleaseDate?.split("-")[0]}</span>
                                    </div>
                                    <span className="recent-time">
                                        {album.trackCount} tracks
                                    </span>
                                </div>
                            ))}

                            {albums.length > visibleCount && (
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

export default Albums;