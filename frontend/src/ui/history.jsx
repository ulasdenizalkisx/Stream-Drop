import "../css/overview.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, History as HistoryIcon, Music2, ChevronDown } from "lucide-react";

function History() {
    const [history, setHistory] = useState([]);
    const [visibleCount, setVisibleCount] = useState(20);

    const getHistory = async () => {
        try {
            const res = await axios.get("/api/recent", {
                params: {
                    limit: 50
                }
            });
            setHistory(res.data);
        } catch (e) {
            console.error("Failed to fetch history", e);
        }
    };

    useEffect(() => {
        getHistory();
    }, []);

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

    const handleSeeMore = () => {
        setVisibleCount(50);
    };

    return (
        <div className="overview-container">
            <div className="overview-header">
                <h1 className="overview-title">History</h1>
            </div>

            <section className="recent-section">
                <div className="recent-section-header">
                    <HistoryIcon size={16} className="recent-section-icon" />
                    <h2 className="recent-section-title">Listening History</h2>
                </div>

                <div className="recent-list">
                    {history.length === 0 ? (
                        <div className="recent-empty">
                            <Music2 size={32} className="recent-empty-icon" />
                            <p>Loading history…</p>
                        </div>
                    ) : (
                        <>
                            {history.slice(0, visibleCount).map((item, index) => (
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
                            ))}

                            {history.length > visibleCount && (
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

export default History;
