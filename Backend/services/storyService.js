// services/storyService.js
const { Story, User, ReferenceData } = require("../models");

module.exports = {
  // 1. Create
  async create(data) {
    return Story.create(data);
  },

  // 2. Get all
  async getAll() {
    const stories = await Story.findAll({
      include: [
        { model: User, as: "authorDetails", attributes: ["id", "user_name"] },
        {
          model: ReferenceData,
          as: "location",
          attributes: ["id", "value"],
        },
      ],
    });
    return stories.map((s) => {
      const { location, authorDetails, ...rest } = s.toJSON();
      return {
        ...rest,
        author: authorDetails.username,
        location: location.value,
      };
    });
  },

  // 2b. Approved only
  async getApproved() {
    const stories = await Story.findAll({
      where: { status: 1 },
      include: [
        { model: User, as: "authorDetails", attributes: ["id", "user_name"] },
        {
          model: ReferenceData,
          as: "location",
          attributes: ["id", "value"],
          where: { status: 1 },
          required: false,
        },
      ],
    });
    return stories.map((s) => {
      const { location, authorDetails, ...rest } = s.toJSON();
      return {
        ...rest,
        author: authorDetails.username,
        location: location ? location.value : null,
      };
    });
  },

  // 5. Get by ID
  async getById(id) {
    const s = await Story.findByPk(id, {
      include: [
        { model: User, as: "authorDetails", attributes: ["id", "user_name"] },
        {
          model: ReferenceData,
          as: "location",
          attributes: ["id", "value"],
          where: { status: 1 },
          required: false,
        },
      ],
    });
    if (!s) return null;
    const { location, authorDetails, ...rest } = s.toJSON();
    return {
      ...rest,
      author: authorDetails.username,
      location: location ? location.value : null,
    };
  },

  // 3. Update
  async update(id, data) {
    const s = await Story.findByPk(id);
    if (!s) return null;
    return s.update(data);
  },

  // 4. Change status
  async changeStatus(id, status) {
    const s = await Story.findByPk(id);
    if (!s) return null;
    return s.update({ status });
  },

  // 6. Delete
  async delete(id) {
    const s = await Story.findByPk(id);
    if (!s) return null;
    await s.destroy();
    return s;
  },
};
