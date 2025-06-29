import React from "react";
import { Link } from "react-router-dom";
import lungs from "../assets/static_men_heart_only_pulsing.gif";
const LungsHero = () => {
  return (
    <div className="relative bg-gradient-to-b from-[#1598D2] to-[#2DC5F2] overflow-hidden">
      {/* Decorative bubbles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-48 h-48 rounded-full bg-[#F4B5AE] opacity-20 mix-blend-overlay filter blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[#F7CDC7] opacity-15 mix-blend-overlay filter blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              <span className="block">Breathe Life Into</span>
              <span className="block text-[#F4B5AE]">Healthcare</span>
            </h1>
            <p className="mt-6 text-xl text-white opacity-90 max-w-lg">
              Your support helps provide respiratory care to those in need.
              Every donation helps someone breathe easier.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/donate"
                className="px-8 py-3 bg-[#F4B5AE] hover:bg-[#F7CDC7] text-[#1598D2] text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 inline-block"
              >
                Donate Now
              </Link>
            </div>
          </div>

          {/* Right side - Lungs image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Your lung image with glow effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={lungs} // <-- updated image path
                  alt="Yemen map in lung shape with province veins"
                  className="w-full h-full object-contain drop-shadow-lg filter brightness-110 contrast-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden transform rotate-180">
        <svg
          className="relative block w-full h-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-current text-[#F7CDC7]"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-current text-[#F4B5AE]"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-current text-white"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default LungsHero;
