const { Project } = require("../models");

class ProjectService {
  // Create a new project
  async createProject(projectData) {
    return await Project.create(projectData);
  }

  // Retrieve all projects
  async getAllProjects() {
    return await Project.findAll();
  }

  // Retrieve a project by ID
  async getProjectById(id) {
    const project = await Project.findByPk(id);
    if (!project) throw new Error("Project not found");
    return project;
  }
  async updateProject(id, projectData) {
    const project = await Project.findByPk(id);
    if (!project) throw new Error("Project not found");
    return await project.update(projectData);
  }

  async deleteProject(id) {
    const project = await Project.findByPk(id);
    if (!project) throw new Error("Project not found");
    return await project.destroy();
  }
}

module.exports = new ProjectService();
