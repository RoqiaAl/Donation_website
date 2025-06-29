// services/permissionService.js
const { Permission } = require("../models");

class PermissionService {
  // Create a new permission
  async createPermission(permissionData) {
    try {
      const permission = await Permission.create(permissionData);
      return permission;
    } catch (error) {
      throw error;
    }
  }

  // Retrieve all permissions
  async getAllPermissions() {
    try {
      const permissions = await Permission.findAll();
      return permissions;
    } catch (error) {
      throw error;
    }
  }

  // Retrieve a permission by its ID
  async getPermissionById(id) {
    try {
      const permission = await Permission.findByPk(id);
      if (!permission) {
        throw new Error("Permission not found");
      }
      return permission;
    } catch (error) {
      throw error;
    }
  }

  // Update a permission
  async updatePermission(id, updateData) {
    try {
      const permission = await Permission.findByPk(id);
      if (!permission) {
        throw new Error("Permission not found");
      }
      await permission.update(updateData);
      return permission;
    } catch (error) {
      throw error;
    }
  }

  // Delete a permission
  async deletePermission(id) {
    try {
      const permission = await Permission.findByPk(id);
      if (!permission) {
        throw new Error("Permission not found");
      }
      await permission.destroy();
      return { message: "Permission deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  
}
module.exports = new PermissionService();
