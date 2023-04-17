const express = require("express");
const router = express.Router();
const {
  createCustomer,
  uploadManyCustomer,
  // getAllJobs,
  getAllCustomer,
  getJob,
  updateCustomer,
  deleteCustomer,
  checkCustomerExist,
} = require("../controllers/customer");
router.route("/").post(createCustomer).get(getAllCustomer);
router.route("/:id").get(getJob).patch(updateCustomer).delete(deleteCustomer);
router.post("/upload", uploadManyCustomer);
router.post("/check-number", checkCustomerExist);
module.exports = router;
