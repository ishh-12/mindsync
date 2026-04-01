import React from "react";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import GamePreview from "./components/GamePreview";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import GameModes from "./components/GameModes";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

function HomeContainer() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <GamePreview />
      <HowItWorks />
      <Features />
      <GameModes />
      <CTASection />
      <Footer />
    </div>
  );
}

export default HomeContainer;