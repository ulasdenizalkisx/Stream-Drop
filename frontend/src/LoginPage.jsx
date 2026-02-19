import './css/LoginPage.css'
import Navbar from '../src/ui/navbar'
import { Activity, Play } from 'lucide-react'
import Footer from '../src/ui/footer'

function LoginPage() {

  const login = () => {
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
          <button className="bottom-button slide-up delay-2" onClick={() => login()}>
            <p>Get Started</p>
            <Play size={20} className="play-button" />
          </button>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default LoginPage
