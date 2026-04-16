import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import GameModes from './components/GameModes';
import Footer from './components/Footer';
import ControlRoomBG from '../../ControlRoomBG';

export default function HomeContainer() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ControlRoomBG />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <GameModes />
        <Footer />
      </div>
    </div>
  );
}