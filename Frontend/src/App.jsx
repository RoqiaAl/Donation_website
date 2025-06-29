// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LayoutPage from "./pages/LayoutPage";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import WelcomeRegistrationPage from "./pages/WelcomeRegistrationPage";
import LoginPage from "./pages/LoginPage";
import VerifyErrorPage from "./pages/VerifyErrorPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetails from "./pages/ProjectDetails";
import DonationSection from "./components/DonationSection";
import AboutSection from "./components/AboutSection";
import OurGoals from "./components/OurGoals";
import VisionSection from "./components/Vision";
import SubscribeForm from "./components/SubscribeForm";
import ContactForm from "./components/ContactForm";
import TestimonialCarousel from "./components/Testimonial";
import CreateReviewPage from "./pages/CreateReviewPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Home from "./components/dashboard/Home";
import Profile from "./components/dashboard/Profile";

import Recurring from "./components/dashboard/Recurring";
import Transactions from "./components/dashboard/Transactions";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth & misc */}
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/registration-welcome"
          element={<WelcomeRegistrationPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-error" element={<VerifyErrorPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* everything under LayoutPage will get Navbar + Footer */}
        <Route element={<LayoutPage />}>
          <Route path="/" element={<HomePage />} />

          {/* Donation & Projects */}
          <Route path="/donate" element={<DonationSection />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/:id/donate" element={<DonationSection />} />

          {/* About dropdown */}
          <Route path="/about" element={<AboutSection />} />
          <Route path="/about/goals" element={<OurGoals />} />
          <Route path="/about/vision" element={<VisionSection />} />

          {/* Contact dropdown */}
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/contact/subscribe" element={<SubscribeForm />} />

          {/* Testimonials dropdown */}
          <Route
            path="/testimonials/reviews"
            element={<TestimonialCarousel />}
          />
          <Route path="/testimonials/create" element={<CreateReviewPage />} />
        </Route>

        <Route path="/dashboard/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />

          <Route path="recurring" element={<Recurring />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
