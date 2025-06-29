import React from "react";
import {
  FaHeartbeat,
  FaGlobeAmericas,
  FaUsers,
  FaClinicMedical,
  FaSyringe,
  FaProcedures,
  FaMicroscope,
  FaUserMd,
  FaAmbulance,
  FaHeart,
  FaLaptopMedical,
} from "react-icons/fa";
import { motion } from "framer-motion";

const VisionSection = () => {
  const visionPillars = [
    {
      icon: <FaHeartbeat />,
      title: "Health Equity",
      description:
        "Eliminating healthcare disparities to ensure quality medical attention for all, regardless of geography or economic status through our network of 500+ partner clinics.",
      color: "#F4B5AE",
      stat: "500+ clinics",
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Global Impact",
      description:
        "Establishing sustainable healthcare solutions across 50 developing nations by 2030 with our $200M Global Health Initiative fund.",
      color: "#2DC5F2",
      stat: "50 nations",
    },
    {
      icon: <FaUsers />,
      title: "Community Empowerment",
      description:
        "Training 10,000 community health workers annually to build self-sufficient healthcare networks in underserved regions.",
      color: "#1598D2",
      stat: "10,000 workers",
    },
    {
      icon: <FaClinicMedical />,
      title: "Innovation in Care",
      description:
        "Deploying 1,000 mobile clinics with telemedicine capabilities to serve remote populations by 2025.",
      color: "#6BDCF6",
      stat: "1,000 units",
    },
    {
      icon: <FaSyringe />,
      title: "Preventive Medicine",
      description:
        "Vaccinating 5 million children annually against preventable diseases through our immunization programs.",
      color: "#9BD4A4",
      stat: "5M children",
    },
    {
      icon: <FaProcedures />,
      title: "Surgical Access",
      description:
        "Providing life-saving surgical interventions to 1 million patients in low-resource settings by 2030.",
      color: "#F6D55C",
      stat: "1M surgeries",
    },
    {
      icon: <FaMicroscope />,
      title: "Research Excellence",
      description:
        "Investing $50M annually in tropical disease research to develop affordable treatments for global distribution.",
      color: "#ED553B",
      stat: "$50M funding",
    },
    {
      icon: <FaUserMd />,
      title: "Medical Education",
      description:
        "Establishing 20 regional medical training centers to graduate 5,000 healthcare professionals yearly.",
      color: "#A05EB5",
      stat: "5,000 graduates",
    },
  ];

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
    <section className="relative py-20 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1598D2] mb-4">
            Transforming Global Healthcare
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#F4B5AE] to-[#6BDCF6] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our vision for a world where exceptional healthcare transcends
            borders and economic barriers
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {visionPillars.map((pillar, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5 }}
              className="relative h-80 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: pillar.color }}
              ></div>

              <div className="h-full flex flex-col p-6">
                <div
                  className="w-16 h-16 flex items-center justify-center rounded-full mb-5 mx-auto"
                  style={{ backgroundColor: `${pillar.color}20` }}
                >
                  {React.cloneElement(pillar.icon, {
                    className: "text-2xl",
                    style: { color: pillar.color },
                  })}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  {pillar.title}
                </h3>

                <motion.div
                  initial={{ opacity: 1 }}
                  whileHover={{ opacity: 0 }}
                  className="flex-grow flex flex-col justify-center"
                >
                  <div
                    className="text-2xl font-bold mb-3 text-center"
                    style={{ color: pillar.color }}
                  >
                    {pillar.stat}
                  </div>
                  <div className="h-1 w-12 bg-gray-200 mx-auto mb-4"></div>
                  <p className="text-gray-500 text-center text-sm">
                    Tap to learn more
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 p-6 flex items-center justify-center bg-white"
                  style={{
                    color: pillar.color,
                    borderTop: `4px solid ${pillar.color}`,
                  }}
                >
                  <p className="text-center text-gray-700">
                    {pillar.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VisionSection;
