import './css/LoginPage.css'
import Navbar from '../src/ui/navbar'
import { Activity, Play } from 'lucide-react'
import Footer from '../src/ui/footer'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate();

  const login = () => {
    localStorage.removeItem('demoMode');
    window.location.href = "/api/login-spotify";
  }

  return (
    <>
      <div className="login-page-container">
        <div className="mesh-gradient">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <Navbar />
        <div className="welcoming">
          <div className="activity fade-in">
            <Activity size={18} color="#00DA5A" /> <p>DEEP DIVE INTO YOUR MUSIC</p>
          </div>
          <h1 className="welcoming-title slide-up">
            <span className="title">Your Listening</span>
            <span className="title"><span className="dna">DNA</span> Revealed</span>
          </h1>
          <p className="welcoming-footer slide-up delay-1">Uncover your top tracks, favorite genres, and listening habits with beautiful,
            real-time analytics and visualizers.
          </p>
          <div className="button-group slide-up delay-2">
            <button className="bottom-button" onClick={() => login()}>
              <p>Get Started</p>
              <Play size={20} className="play-button" />
            </button>
            <button className="bottom-button demo-button" onClick={() => { localStorage.setItem('demoMode', 'true'); window.location.href = '/profile'; }}>
              <p>Try Demo Mode</p>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default LoginPage
