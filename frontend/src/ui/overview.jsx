import "../css/overview.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Music2 } from "lucide-react";

function Overview({ recent = [], isLoading }) {

    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return "Just now";
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr}h ago`;
        return `${Math.floor(diffHr / 24)}d ago`;
    };

    return (
        <div className="overview-container">
            <div className="overview-header">
                <h1 className="overview-title">Overview</h1>
            </div>

            <section className="recent-section">
                <div className="recent-section-header">
                    <Clock size={16} className="recent-section-icon" />
                    <h2 className="recent-section-title">Recently Played</h2>
                </div>

                <div className="recent-list">
                    {isLoading ? (
                        <div className="recent-empty">
                            <Music2 size={32} className="recent-empty-icon" />
                            <p>Loading tracks…</p>
                        </div>
                    ) : (
                        recent.map((item, index) => (
                            <div key={index} className="recent-row">
                                <span className="recent-index">{index + 1}</span>
                                <img
                                    src={item.track?.album?.images?.[1]?.url || item.track?.album?.images?.[0]?.url}
                                    alt={item.track?.name}
                                    className="recent-album-art"
                                />
                                <div className="recent-info">
                                    <p className="recent-track-name">{item.track?.name}</p>
                                    <p className="recent-artist">
                                        {item.track?.artists?.map(a => a.name).join(", ")}
                                    </p>
                                </div>
                                <p className="recent-album-name">{item.track?.album?.name}</p>
                                <span className="recent-time">{formatTime(item.played_at)}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default Overview;