// routes/rolePermissionRoutes.js
const express = require("express");
const router = express.Router();
const rolePermissionController = require("../controllers/rolePermissionController");

// Create a new role-permission record
router.post("/", rolePermissionController.createRolePermission);

// Retrieve all role-permission records
router.get("/", rolePermissionController.getAllRolePermissions);

// Retrieve a role-permission record by id
router.get("/:id", rolePermissionController.getRolePermissionById);

// Retrieve role-permission records by role ID
router.get("/role/:roleId", rolePermissionController.getByRoleId);

// Retrieve role-permission records by permission ID
router.get(
  "/permission/:permissionId",
  rolePermissionController.getByPermissionId
);

// Update a role-permission record by id
router.put("/:id", rolePermissionController.updateRolePermission);

// Delete a role-permission record by id
router.delete("/:id", rolePermissionController.deleteRolePermission);

//insert multiple role-permissions
router.post("/bulk", rolePermissionController.bulkAssignPermissions);

module.exports = router;
