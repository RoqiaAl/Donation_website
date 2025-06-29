// controllers/rolePermissionController.js
const rolePermissionService = require("../services/rolePermissionService");

class RolePermissionController {
  // POST /role-permissions - Create a new role-permission record
  async createRolePermission(req, res) {
    try {
      const data = req.body;
      const rolePermission = await rolePermissionService.createRolePermission(
        data
      );
      return res.status(201).json(rolePermission);
    } catch (error) {
      console.error("Error creating role permission:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /role-permissions - Retrieve all role-permission records
  async getAllRolePermissions(req, res) {
    try {
      const rolePermissions =
        await rolePermissionService.getAllRolePermissions();
      return res.status(200).json(rolePermissions);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /role-permissions/:id - Retrieve a specific role-permission record by id
  async getRolePermissionById(req, res) {
    try {
      const { id } = req.params;
      const rolePermission = await rolePermissionService.getRolePermissionById(
        id
      );
      return res.status(200).json(rolePermission);
    } catch (error) {
      console.error("Error fetching role permission:", error);
      return res.status(404).json({ error: error.message });
    }
  }

  // GET /role-permissions/role/:roleId - Retrieve records by role ID
  async getByRoleId(req, res) {
    try {
      const { roleId } = req.params;
      const rolePermissions =
        await rolePermissionService.getRolePermissionsByRoleId(roleId);
      return res.status(200).json(rolePermissions);
    } catch (error) {
      console.error("Error fetching role permissions by role ID:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /role-permissions/permission/:permissionId - Retrieve records by permission ID
  async getByPermissionId(req, res) {
    try {
      const { permissionId } = req.params;
      const rolePermissions =
        await rolePermissionService.getRolePermissionsByPermissionId(
          permissionId
        );
      return res.status(200).json(rolePermissions);
    } catch (error) {
      console.error("Error fetching role permissions by permission ID:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT /role-permissions/:id - Update a role-permission record by id
  async updateRolePermission(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const rolePermission = await rolePermissionService.updateRolePermission(
        id,
        updateData
      );
      return res.status(200).json(rolePermission);
    } catch (error) {
      console.error("Error updating role permission:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE /role-permissions/:id - Delete a role-permission record by id
  async deleteRolePermission(req, res) {
    try {
      const { id } = req.params;
      const result = await rolePermissionService.deleteRolePermission(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting role permission:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async bulkAssignPermissions(req, res) {
    try {
      // Expecting a JSON body like: { "role_id": 1, "permissions": [1, 2, 3] }
      const { role_id, permissions } = req.body;
      if (!role_id || !Array.isArray(permissions)) {
        return res.status(400).json({
          error: "Invalid input: role_id and permissions array are required",
        });
      }

      const result = await rolePermissionService.bulkAssignPermissions(
        role_id,
        permissions
      );
      return res.status(200).json({
        message: "Permissions assigned successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in bulk assigning permissions:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RolePermissionController();
