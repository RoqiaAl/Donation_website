const projectService = require("../services/projectService");

class ProjectController {
  // POST /projects - Create a new project
  async create(req, res) {
    try {
      const projectData = req.body;
      const project = await projectService.createProject(projectData);
      return res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /projects - Retrieve all projects
  async getAll(req, res) {
    try {
      const projects = await projectService.getAllProjects();
      return res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /projects/:id - Retrieve a project by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);
      return res.status(200).json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      return res.status(404).json({ error: error.message });
    }
  }

  // POST /projects/:id/coordinates - Add coordinates if not already set
  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const projectData = req.body;
      const project = await projectService.updateProject(id, projectData);
      return res.status(200).json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const success = await projectService.deleteProject(id);
      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found." });
      }
      return res.json({
        success: true,
        message: "Project deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ProjectController();
