import React from "react";

const AboutUs = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1598D2] mb-4">
            About Our Organization
          </h2>
          <div className="w-24 h-1 bg-[#F4B5AE] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transforming generosity into measurable impact through innovative
            philanthropy solutions
          </p>
        </div>

        <div className="space-y-10">
          {/* Who We Are Section */}
          <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-[#1598D2]">
            <h3 className="text-2xl font-bold text-[#1598D2] mb-4">
              Who We Are
            </h3>
            <div className="space-y-4 text-gray-700">
              <p>
                Founded in 2015, we began as a small group of passionate
                individuals determined to make a difference in our local
                community. What started as grassroots initiatives has blossomed
                into a nationwide movement, connecting thousands of donors with
                causes that matter.
              </p>
              <p>
                Our team combines decades of experience in nonprofit management,
                community development, and financial stewardship. We operate
                with transparency at our core, ensuring that every dollar
                contributed achieves its maximum potential impact.
              </p>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="bg-gradient-to-r from-[#6BDCF6] to-[#F7CDC7] p-0.5 rounded-xl">
            <div className="bg-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-[#1598D2] mb-6 text-center">
                Our Core Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Integrity",
                    icon: "🔍",
                    description:
                      "We maintain the highest ethical standards in all our operations and relationships",
                  },
                  {
                    title: "Impact",
                    icon: "✨",
                    description:
                      "Every decision is measured by the difference it makes in people's lives",
                  },
                  {
                    title: "Innovation",
                    icon: "💡",
                    description:
                      "We constantly seek better ways to solve social challenges",
                  },
                  {
                    title: "Inclusivity",
                    icon: "🌍",
                    description:
                      "All voices matter in our approach to community development",
                  },
                  {
                    title: "Transparency",
                    icon: "🔓",
                    description:
                      "Open books and honest reporting build trust with our stakeholders",
                  },
                  {
                    title: "Collaboration",
                    icon: "🤝",
                    description:
                      "We achieve more by working with partners across sectors",
                  },
                ].map((value, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-lg border border-[#F7CDC7] hover:shadow-md transition duration-300"
                  >
                    <div className="text-3xl mb-3">{value.icon}</div>
                    <h4 className="text-xl font-semibold text-[#1598D2] mb-2">
                      {value.title}
                    </h4>
                    <p className="text-gray-700 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
