// src/components/ProjectsSection.jsx
import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { FaSadTear, FaSearch } from "react-icons/fa";
import apiClient from "../hooks/apiClient";

const ProjectsSection = ({
  isLanding = false,
  title = "Current Projects",
  description = "",
}) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // unified fetch – always hits /projects
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // If on landing and we have no projects, render nothing
  if (isLanding && !isLoading && projects.length === 0) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <section
        className={`py-12 px-4 ${isLanding ? "bg-white" : "bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading projects...</p>
        </div>
      </section>
    );
  }

  // Main render
  const displayed = isLanding ? projects.slice(0, 3) : projects;

  return (
    <section className={`py-12 px-4 ${isLanding ? "bg-white" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1598D2]">
            {isLanding ? "Latest Projects" : title}
          </h2>
          {!isLanding && description && (
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              {description}
            </p>
          )}
        </div>

        {displayed.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayed.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {isLanding && projects.length > 3 && (
              <div className="text-center mt-12">
                <link
                  to="/projects"
                  className="inline-block px-6 py-3 bg-[#1598D2] text-white rounded-md hover:bg-[#2DC5F2] transition-colors"
                >
                  View All Projects
                </link>
              </div>
            )}
          </>
        ) : (
          // Empty‐state for full projects page
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center max-w-2xl mx-auto">
            <div className="text-[#F4B5AE] text-5xl mb-4 flex justify-center">
              <FaSadTear />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-600 mb-6">
              We currently don't have any active projects. Please check back
              later.
            </p>
            <button
              onClick={fetchProjects}
              className="inline-flex items-center px-4 py-2 bg-[#1598D2] text-white rounded-md hover:bg-[#2DC5F2] transition-colors"
            >
              <FaSearch className="mr-2" />
              Refresh Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
