// src/pages/HomePage.jsx
import React from "react";

import DonationHero from "../components/DonationHero";
import StatisticsSection from "../components/StatisticsSection";
import PartnersShowcase from "../components/PartnersShowcase";
import OurGoals from "../components/OurGoals";
import VisionSection from "../components/Vision";
import TestimonialCarousel from "../components/Testimonial";
import SubscribeForm from "../components/SubscribeForm";
import AboutSection from "../components/AboutSection";
import DonationSection from "../components/DonationSection";
import ProjectsSection from "../components/ProjectsSection";
import ContactForm from "../components/ContactForm";

const HomePage = () => (
  <>
    <DonationHero />
    <DonationSection />
    <StatisticsSection />
    <VisionSection />
    <ProjectsSection isLanding={true} />
   
    
    <OurGoals />
    
    <TestimonialCarousel />
    <PartnersShowcase />
    <AboutSection />
    <SubscribeForm />
   
    
    
    <ContactForm />
   
  </>
);

export default HomePage;
