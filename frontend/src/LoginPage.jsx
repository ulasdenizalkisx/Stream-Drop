import './css/LoginPage.css'
import Navbar from '../src/ui/navbar'
import { Activity, Play } from 'lucide-react'
import Footer from '../src/ui/footer'

function LoginPage() {

  return (
    <>
      <Navbar />
      <div className="welcoming">
        <div className="activity">
          <Activity size={18} color="#00DA5A" /> <p>DEEP DIVE INTO YOUR MUSIC</p>
        </div>
        <h1 className="welcoming-title">
          <span className="title">Your Listening</span>
          <span className="title"><span className="dna">DNA</span> Revealed</span>
        </h1>
        <p className="welcoming-footer">Uncover your top tracks, favorite genres, and listening habits with beautiful,
          real-time analytics and visualizers.
        </p>
        <button className="bottom-button">
          <p>Get Started</p>
          <Play size={20} className="play-button" />
        </button>
      </div>
      <Footer />
    </>
  )
}

export default LoginPage
