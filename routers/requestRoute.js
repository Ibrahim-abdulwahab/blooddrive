const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const Organization = require('../models/organizationSchema');

router.post("/create",requestController.createRequest)


// Route to fetch all hospitals
router.get('/hospitals', async (req, res) => {
  try {
    const organizations = await Organization.find({}, 'name'); // Only get name
    res.json(organizations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user names', error: err });
  }
});

module.exports=router;