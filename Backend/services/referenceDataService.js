const { ReferenceData } = require("../models");

class ReferenceDataService {
  async getByType(type) {
    return await ReferenceData.findAll({
      where: { type },
      order: [
        ["sort_order", "ASC"],
        ["id", "ASC"],
      ],
    });
  }

  async create(data) {
    return await ReferenceData.create(data);
  }

  async update(id, data) {
    const item = await ReferenceData.findByPk(id);
    if (!item) throw new Error("Item not found");
    return await item.update(data);
  }

  async delete(id) {
    const item = await ReferenceData.findByPk(id);
    if (!item) throw new Error("Item not found");
    return await item.destroy();
  }

  async bulkCreate(type, items) {
    const formattedItems = items.map((item, index) => ({
      type,
      value: item.value,
      sort_order: item.sort_order || index,
    }));

    return await ReferenceData.bulkCreate(formattedItems);
  }
}

module.exports = new ReferenceDataService();
