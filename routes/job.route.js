/* external import */
const express = require("express");

/* internal import */
const jobController = require("../controllers/job.controller");

/* router level connection */
const router = express.Router();

router
  .route("/")
  .post(jobController.insertNewJob)
  .get(jobController.displayAllJobs);

router
  .route("/:id")
  .get(jobController.displaySpecificJob)
  .patch(jobController.modifyExistingJobCredentials);

module.exports = router;
