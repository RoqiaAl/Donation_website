require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const path = require("path");

// Route imports
const roleRoutes = require("./routes/roleRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const rolePermissionRoutes = require("./routes/rolePermissionRoutes");
const recurringDonationRoutes = require("./routes/recurringDonationRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const referenceDataRoutes = require("./routes/referenceDataRoutes");
const projectRoutes = require("./routes/projectRoutes");
const donateWithoutAccountRoutes = require("./routes/donateWithoutAccountRoutes");
const donorRegisterationRoutes = require("./routes/authentication/donorRegisterationRoutes");
const donorLoginRoutes = require("./routes/authentication/donorLoginRoutes");
const adminRegistrationRoutes = require("./routes/authentication/adminRegistrationRoutes");
const adminLoginRoutes = require("./routes/authentication/adminLoginRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const projectPartnerRoutes = require("./routes/projectPartnerRoutes");
const projectMediaRoutes = require("./routes/projectMediaRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes.js");
const donateWithAccountRoutes = require("./routes/donateWithAccountRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const contactFormRoutes = require("./routes/contactRoutes.js");
const donorDashboardRoutes = require("./routes/donorDashboardRoutes.js");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes.js");

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

// Import the authentication middleware
const authMiddleware = require("./utils/authMiddleware");

require("./utils/recurringDonationJob.js");

const BaseURL = process.env.BASE_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/testimonials",
  express.static(path.join(__dirname, "public", "testimonials"))
);
app.use(
  "/partners",
  express.static(path.join(__dirname, "public", "partners"))
);
app.use(
  "/projectMedia",
  express.static(path.join(__dirname, "public", "projectMedia"))
);
// Protected routes: these routes require a valid JWT (checked by authMiddleware)
app.use("/roles", roleRoutes);
app.use("/permissions", authMiddleware, permissionRoutes);
app.use("/role-permissions", authMiddleware, rolePermissionRoutes);
app.use("/recurring-donations",  recurringDonationRoutes);
app.use("/transactions", transactionRoutes);
app.use("/reference-data", referenceDataRoutes);
app.use("/projects", projectRoutes);

app.use("/donate-without-account", donateWithoutAccountRoutes);
app.use("/donate", donateWithAccountRoutes);

// Authentication routes (registration and login) remain unprotected
app.use("/auth/donor", donorRegisterationRoutes);
app.use("/auth/donor", donorLoginRoutes);
app.use("/auth/admin", adminRegistrationRoutes);
app.use("/auth/admin", adminLoginRoutes);

app.use("/api/testimonials", testimonialRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/project-partners", projectPartnerRoutes);
app.use("/api/project-media", projectMediaRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/donor-dashboard", donorDashboardRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);

app.use("/api", subscriptionRoutes);
app.use("/api", contactFormRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
