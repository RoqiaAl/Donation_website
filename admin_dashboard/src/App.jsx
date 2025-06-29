import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminLoginForm } from "./components/Login";
import DashboardLayout from "./components/Layout";
import Home from "./components/Home";
import UserHome from "./components/UserHome";
import Donors from "./components/Donors";
import Partners from "./components/Partners";
import Projects from "./components/Project";
import Donations from "./components/Donations";
import Transactions from "./components/Transactions";
import ReccuringDonations from "./components/ReccuringDonations";
import Reviews from "./components/Reviews";
import Media from "./components/Media";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginForm />} />

        <Route path="/dashboard/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard/users" element={<UserHome />} />
          <Route path="/dashboard/donors" element={<Donors />} />
          <Route path="/dashboard/partners" element={<Partners />} />
          <Route path="/dashboard/projects" element={<Projects />} />
          <Route path="/dashboard/donations" element={<Donations />} />
          <Route path="/dashboard/transactions" element={<Transactions />} />
          <Route
            path="/dashboard/recurring-donations"
            element={<ReccuringDonations />}
          />
          <Route path="/dashboard/reviews" element={<Reviews />} />
          <Route path="/dashboard/media" element={<Media />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
