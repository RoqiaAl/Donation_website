import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient"; // or axios
import { FaSpinner } from "react-icons/fa";

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/api/partners");
        if (data.success && Array.isArray(data.partners)) {
          setPartners(data.partners);
        } else {
          throw new Error("Invalid response shape");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load partners.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-100  py-16">
        <div className="container mx-auto px-4 text-center">
          <FaSpinner className="animate-spin mx-auto text-3xl text-gray-400" />
          <p className="mt-4 text-gray-600">Loading partners…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-100  py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100  py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1598D2]">
            Trusted Partners
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We’re proud to collaborate with these innovative organizations who
            share our vision for excellence and transformative solutions.
          </p>
        </header>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center mb-16">
          {partners.map((p) => (
            <a
              key={p.id}
              href={p.partner_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${p.partner_name}`}
              className="flex flex-col items-center group transform hover:scale-105 transition-transform"
            >
              {p.partner_logo ? (
                <img
                  src={apiClient.defaults.baseURL + p.partner_logo}
                  alt={`${p.partner_name} logo`}
                  className="h-12 sm:h-16 object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="h-12 sm:h-16 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-800">
                    {p.partner_name}
                  </span>
                </div>
              )}
              <span className="mt-2 text-sm text-gray-500 group-hover:text-[#2DC5F2] transition-colors">
                {p.partner_name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
