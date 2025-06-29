// services/rolePermissionService.js
const { RolePermission } = require("../models");

class RolePermissionService {
  // Create a new role-permission association
  async createRolePermission(data) {
    try {
      const rolePermission = await RolePermission.create(data);
      return rolePermission;
    } catch (error) {
      throw error;
    }
  }

  // Retrieve all role-permission associations
  async getAllRolePermissions() {
    try {
      const rolePermissions = await RolePermission.findAll();
      return rolePermissions;
    } catch (error) {
      throw error;
    }
  }

  // Retrieve a role-permission association by its primary key (id)
  async getRolePermissionById(id) {
    try {
      const rolePermission = await RolePermission.findByPk(id);
      if (!rolePermission) {
        throw new Error("RolePermission not found");
      }
      return rolePermission;
    } catch (error) {
      throw error;
    }
  }

  // Retrieve role-permission associations by role ID
  async getRolePermissionsByRoleId(roleId) {
    try {
      const rolePermissions = await RolePermission.findAll({
        where: { role_id: roleId },
      });
      return rolePermissions;
    } catch (error) {
      throw error;
    }
  }

  // Retrieve role-permission associations by permission ID
  async getRolePermissionsByPermissionId(permissionId) {
    try {
      const rolePermissions = await RolePermission.findAll({
        where: { permission_id: permissionId },
      });
      return rolePermissions;
    } catch (error) {
      throw error;
    }
  }

  // Update a role-permission association by id
  async updateRolePermission(id, updateData) {
    try {
      const rolePermission = await RolePermission.findByPk(id);
      if (!rolePermission) {
        throw new Error("RolePermission not found");
      }
      await rolePermission.update(updateData);
      return rolePermission;
    } catch (error) {
      throw error;
    }
  }

  // Delete a role-permission association by id
  async deleteRolePermission(id) {
    try {
      const rolePermission = await RolePermission.findByPk(id);
      if (!rolePermission) {
        throw new Error("RolePermission not found");
      }
      await rolePermission.destroy();
      return { message: "RolePermission deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async bulkAssignPermissions(roleId, permissionIds) {
    try {
      // Optionally, remove existing associations for the role:
      await RolePermission.destroy({ where: { role_id: roleId } });

      // Prepare an array of RolePermission objects to be created
      const bulkData = permissionIds.map((permissionId) => ({
        role_id: roleId,
        permission_id: permissionId,
      }));

      // Use bulkCreate to insert all records at once
      const result = await RolePermission.bulkCreate(bulkData);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RolePermissionService();
