const referenceDataService = require("../services/referenceDataService");

class ReferenceDataController {
  async getByType(req, res) {
    try {
      const { type } = req.params;
      const data = await referenceDataService.getByType(type);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const data = await referenceDataService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await referenceDataService.update(id, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await referenceDataService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async bulkCreate(req, res) {
    try {
      const { type } = req.params;
      const { items } = req.body;
      const data = await referenceDataService.bulkCreate(type, items);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReferenceDataController();
