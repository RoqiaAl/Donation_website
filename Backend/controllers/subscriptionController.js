const subscriptionService = require("../services/subscriptionService");

module.exports = {
  subscribe: async (req, res) => {
    try {
      const { firstName, lastName, email, date, setReminder } = req.body;
      const newSub = await subscriptionService.createSubscription({
        firstName,
        lastName,
        email,
        date,
        setReminder: !!setReminder,
      });
      res.status(201).json({ success: true, subscription: newSub });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  list: async (req, res) => {
    try {
      const subs = await subscriptionService.getAllSubscriptions();
      res.json({ success: true, subscriptions: subs });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
