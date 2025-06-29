"use strict";
const { Partner } = require("../models");

/**
 * Creates a new partner record.
 * @param {Object} data - { partner_name, partner_logo, partner_url }
 * @returns {Promise<Partner>}
 */
async function createPartner(data) {
  const partner = await Partner.create(data);
  return partner;
}

/**
 * Retrieves all partners.
 * @returns {Promise<Array<Partner>>}
 */
async function getAllPartners() {
  const partners = await Partner.findAll({
    order: [["createdAt", "DESC"]],
  });
  return partners;
}

/**
 * Retrieves a partner by its ID.
 * @param {number} id - Partner ID.
 * @returns {Promise<Partner|null>}
 */
async function getPartnerById(id) {
  const partner = await Partner.findByPk(id);
  return partner;
}

/**
 * Updates a partner record by ID.
 * @param {number} id - Partner ID.
 * @param {Object} data - Fields to update: { partner_name, partner_logo, partner_url }.
 * @returns {Promise<Partner|null>} - Returns the updated partner or null if not found.
 */
async function updatePartner(id, data) {
  const partner = await Partner.findByPk(id);
  if (!partner) {
    return null;
  }
  await partner.update(data);
  return partner;
}

/**
 * Deletes a partner record by ID.
 * @param {number} id - Partner ID.
 * @returns {Promise<boolean>} - Returns true if deletion was successful.
 */
async function deletePartner(id) {
  const partner = await Partner.findByPk(id);
  if (!partner) {
    return false;
  }
  await partner.destroy();
  return true;
}

module.exports = {
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
};
