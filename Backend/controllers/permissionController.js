// controllers/permissionController.js
const permissionService = require("../services/permissionService");

class PermissionController {
  // POST /permissions - Create a new permission
  async createPermission(req, res) {
    try {
      const permissionData = req.body;
      const permission = await permissionService.createPermission(
        permissionData
      );
      return res.status(201).json(permission);
    } catch (error) {
      console.error("Error creating permission:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /permissions - Retrieve all permissions
  async getAllPermissions(req, res) {
    try {
      const permissions = await permissionService.getAllPermissions();
      return res.status(200).json(permissions);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /permissions/:id - Retrieve a permission by ID
  async getPermissionById(req, res) {
    try {
      const { id } = req.params;
      const permission = await permissionService.getPermissionById(id);
      return res.status(200).json(permission);
    } catch (error) {
      console.error("Error fetching permission:", error);
      return res.status(404).json({ error: error.message });
    }
  }

  // PUT /permissions/:id - Update a permission by ID
  async updatePermission(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const permission = await permissionService.updatePermission(
        id,
        updateData
      );
      return res.status(200).json(permission);
    } catch (error) {
      console.error("Error updating permission:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE /permissions/:id - Delete a permission by ID
  async deletePermission(req, res) {
    try {
      const { id } = req.params;
      const result = await permissionService.deletePermission(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting permission:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PermissionController();
