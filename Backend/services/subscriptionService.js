// 3. Service  (services/subscriptionService.js)
const { Subscription } = require("../models");

module.exports = {
  createSubscription: async (data) => {
    return await Subscription.create(data);
  },

  getAllSubscriptions: async () => {
    return await Subscription.findAll({ order: [["createdAt", "DESC"]] });
  },
};
