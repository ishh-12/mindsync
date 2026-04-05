import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import GameModes from './components/GameModes';
import Footer from './components/Footer';

export default function HomeContainer() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <GameModes />
      <Footer />
    </div>
  );
}