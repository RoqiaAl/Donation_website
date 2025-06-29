// controllers/roleController.js
const roleService = require("../services/roleService");

class RoleController {
  // POST /roles - Create a new role
  async createRole(req, res) {
    try {
      const roleData = req.body;
      const role = await roleService.createRole(roleData);
      return res.status(201).json(role);
    } catch (error) {
      console.error("Error creating role:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /roles - Retrieve all roles
  async getAllRoles(req, res) {
    try {
      const roles = await roleService.getAllRoles();
      return res.status(200).json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /roles/:id - Retrieve a role by ID
  async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleById(id);
      return res.status(200).json(role);
    } catch (error) {
      console.error("Error fetching role:", error);
      return res.status(404).json({ error: error.message });
    }
  }

  // PUT /roles/:id - Update a role by ID
  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const role = await roleService.updateRole(id, updateData);
      return res.status(200).json(role);
    } catch (error) {
      console.error("Error updating role:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE /roles/:id - Delete a role by ID
  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const result = await roleService.deleteRole(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting role:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RoleController();
