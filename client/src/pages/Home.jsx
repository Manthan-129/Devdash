import React from 'react'
import Hero from '../components/HomeComponents/Hero.jsx'
import Description from '../components/HomeComponents/Description.jsx'
import CodeDescription from '../components/HomeComponents/CodeDescription.jsx'
import TeamCollaboration from '../components/HomeComponents/TeamCollaboration.jsx'
import ProgressTracking from '../components/HomeComponents/ProgressTracking.jsx'
import LowerSection from '../components/HomeComponents/LowerSection.jsx'
import Footer from '../components/Footer.jsx'

const Home = () => {
  return (
    <div>
        <Hero />
        <Description />
        <CodeDescription />
        <TeamCollaboration />
        <ProgressTracking />
        <LowerSection />
        <Footer />
    </div>
  )
}

export default Home