import React from "react";
import {
  FaHandHoldingMedical,
  FaShieldVirus,
  FaHeartbeat,
  FaUserMd,
  FaClinicMedical,
  FaAmbulance,
  FaBaby,
  FaGlobeAmericas,
  FaProcedures,
  FaLaptopMedical,
} from "react-icons/fa";
import { motion } from "framer-motion";

const OurGoals = () => {
  const goals = [
    {
      icon: <FaHandHoldingMedical />,
      title: "Emergency Response",
      description: "24/7 trauma care with 30-minute response guarantee",
      impact: "15,000+ emergency cases annually",
      color: "#FF6B6B",
    },
    {
      icon: <FaShieldVirus />,
      title: "Disease Prevention",
      description: "Mobile vaccination units reaching last-mile communities",
      impact: "2.5M+ immunizations delivered",
      color: "#4CAF50",
    },
    {
      icon: <FaHeartbeat />,
      title: "Cardiac Network",
      description: "Regional heart centers with tele-cardiology support",
      impact: "800+ life-saving surgeries yearly",
      color: "#E91E63",
    },
    {
      icon: <FaUserMd />,
      title: "Medical Education",
      description: "Residency programs & simulation training centers",
      impact: "3,000+ healthcare professionals trained",
      color: "#2196F3",
    },
    {
      icon: <FaClinicMedical />,
      title: "Rural Health",
      description: "Solar-powered clinics with diagnostic capabilities",
      impact: "75+ permanent facilities established",
      color: "#FF9800",
    },
    {
      icon: <FaAmbulance />,
      title: "Mobile Units",
      description: "All-terrain medical teams with telemedicine links",
      impact: "500+ remote villages served",
      color: "#9C27B0",
    },
    {
      icon: <FaBaby />,
      title: "Maternal Care",
      description: "Complete prenatal-to-postnatal care packages",
      impact: "30,000+ mothers supported",
      color: "#00BCD4",
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Global Partnerships",
      description: "Cross-border disease surveillance networks",
      impact: "8+ international collaborations",
      color: "#3F51B5",
    },
  ];

  // Stagger animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#F7F9FC] to-[#F0F4F8]">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1598D2] mb-4">
            Measurable Global Impact
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#F4B5AE] to-[#6BDCF6] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Data-driven initiatives delivering tangible healthcare
            transformation
          </p>
        </motion.div>

        {/* Optimized Grid with Motion */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {goals.map((goal, index) => (
            <motion.div
              key={index}
              variants={item}
              className="goal-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div
                className="h-2 w-full"
                style={{ backgroundColor: goal.color }}
              ></div>
              <div className="p-6 flex flex-col h-full">
                <div
                  className="w-16 h-16 flex items-center justify-center rounded-full mb-5 mx-auto"
                  style={{ backgroundColor: `${goal.color}20` }}
                >
                  {React.cloneElement(goal.icon, {
                    className: "text-2xl",
                    style: { color: goal.color },
                  })}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {goal.title}
                </h3>
                <p className="text-gray-600 mb-4 text-center flex-grow">
                  {goal.description}
                </p>
                <div
                  className="mt-auto text-sm font-medium px-4 py-2 rounded-lg text-center"
                  style={{
                    backgroundColor: `${goal.color}10`,
                    color: goal.color,
                  }}
                >
                  {goal.impact}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Performance Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16 bg-white p-6 rounded-xl shadow-sm max-w-3xl mx-auto border border-gray-200"
        >
          <p className="text-gray-700 font-medium">
            <span className="text-[#1598D2] font-semibold">
              Transparent Reporting:
            </span>{" "}
            All programs undergo third-party impact evaluation with public
            results
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default OurGoals;
