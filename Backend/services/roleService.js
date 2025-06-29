// services/roleService.js
const { Role } = require("../models");

class RoleService {
  // Create a new role
  async createRole(roleData) {
    try {
      const role = await Role.create(roleData);
      return role;
    } catch (error) {
      throw error;
    }
  }

  // Retrieve all roles
  async getAllRoles() {
    try {
      const roles = await Role.findAll();
      return roles;
    } catch (error) {
      throw error;
    }
  }

  // Retrieve a role by ID
  async getRoleById(id) {
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        throw new Error("Role not found");
      }
      return role;
    } catch (error) {
      throw error;
    }
  }

  // Update a role
  async updateRole(id, updateData) {
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        throw new Error("Role not found");
      }
      await role.update(updateData);
      return role;
    } catch (error) {
      throw error;
    }
  }

  // Delete a role
  async deleteRole(id) {
    try {
      const role = await Role.findByPk(id);
      if (!role) {
        throw new Error("Role not found");
      }
      await role.destroy();
      return { message: "Role deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RoleService();
