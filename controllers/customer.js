const Customer = require("../models/Customer");
const { StatusCodes } = require("http-status-codes");
// const User = require("../models/User");
const { BadRequestError, DateCastError } = require("../errors");
const csvtojson = require("csvtojson");

// check-customer exsist
const checkCustomerExist = async (req, res) => {
  // console.log("running");
  const { phone, customername } = req.body;
  const tempObje = {};
  if (phone !== "") {
    //will run if value exsit
    tempObje.phone = { $regex: customername, $options: "i" };
  }
  if (customername !== "") {
    tempObje.customername = { $regex: customername, $options: "i" };
  }
  tempObje.createdBy = "642f9ebe12d8cd3a40d43507";
  // let result = Customer.find(queryObject);
  // const customer = await Customer.find({

  //   phone: req.body.phone,
  //   createdBy: "642f9ebe12d8cd3a40d43507",
  // });
  const customer = await Customer.find({
    // phone: req.body.phone,
    // createdBy: "642f9ebe12d8cd3a40d43507",
    tempObje,
  });
  // console.log(customer);
  if (customer.length === 0) {
    res.status(200).json({ exist: false });
    console.log("run1");
  }
  console.log(req.body.phone);
  console.log("run2");
  res.status(200).json({ exist: true });
};

//

const createCustomer = async (req, res) => {
  // res.send("create a job");
  // res.json(req.user);
  //   date format check

  // console.log(req.body);
  //   Convert dateOfBirth to a Date object
  // const parsedDateOfBirth = new Date(req.body.dateOfBirth);

  // // Check if the parsed date is valid
  // if (isNaN(parsedDateOfBirth)) {
  //   throw new DateCastError("Invalid dateOfBirth");
  // }

  //
  req.body.createdBy = "642f9ebe12d8cd3a40d43507"; //from authentication middleware
  const customer = await Customer.create(req.body);
  console.log(customer);
  res.json(customer);
};
//
const getJob = async (req, res) => {
  // res.send("get a single job");
  const {
    //nested destructuring
    // user: { userId },
    params: { id: jobId }, //destructuring and renaming
  } = req;
  // console.log("running");
  // console.log(req.params);
  const job = await Customer.findOne({
    createdBy: "642f9ebe12d8cd3a40d43507",
    _id: jobId,
  });
  if (!job) {
    throw new NotFoundError("sorry job not fount");
  }
  // console.log(job);
  res.status(StatusCodes.OK).json({ job });
};

//
const updateCustomer = async (req, res) => {
  // const {
  //   body: { company, position },
  //   //nested destructuring

  //   user: { userId },
  //   params: { id: jobId }, //destructuring and renaming
  // } = req;
  // if (!company || !position) {
  //   throw new BadRequestError("fields cant be empty");
  // }
  console.log("running this is");
  const job = await Customer.findByIdAndUpdate(
    { _id: req.params.id, createdBy: "642f9ebe12d8cd3a40d43507" },
    req.body,
    { new: true, runValidators: true }
  );
  console.log(job);
  // console.log(req.body);
  if (!job) {
    throw new NotFoundError("sorry job not fount");
  }
  // res.send("update a job");
  res.json({ job });
};
const uploadManyCustomer = async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ error: "CSV file is required" });
  }
  const csv = req.files.file;
  // const singleCustomer = {};
  const user = await csvtojson()
    .fromString(csv.data.toString())
    .then((jsonData) => {
      // Insert JSON data into MongoDB
      console.log(jsonData);
      let duplicateCustomer = [];
      jsonData.forEach(async (i) => {
        const { customername, phone, dob, gender } = i;
        const currentCustomer = await Customer.find({
          phone: phone,
          createdBy: "642f9ebe12d8cd3a40d43507",
        });
        // console.log(currentCustomer);
        // console.log(currentCustomer.length === 0);
        if (currentCustomer.length === 0) {
          // only run when  phone number are not equal
          // run for unique customer
          console.log("running-one");
          await Customer.create({
            customername,
            phone,
            dob,
            gender,
            createdBy: "642f9ebe12d8cd3a40d43507",
          });
        } else {
          // if customer exsist
          // run if phone number  exist
          console.log("running-two");
          // // contain new duplicate customer and customer exsisting in our db
          // duplicateCustomer.push({ currentCustomer, i });
          // const oldUser = await Customer.findByIdAndUpdate(
          console.log(currentCustomer[0]._id);
          const job = await Customer.findByIdAndUpdate(
            {
              _id: currentCustomer[0]._id,
              createdBy: "642f9ebe12d8cd3a40d43507",
            },
            { duplicate: true },
            { new: true, runValidators: true }
          );
          await Customer.create({
            customername,
            phone,
            dob,
            gender,
            duplicate: true,
            createdBy: "642f9ebe12d8cd3a40d43507",
          });
          console.log(job);
        }
      });
      // if all fine then run this
      return res.status(200).json({ success: true });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: error });
    });
};
const getAllCustomer = async (req, res) => {
  // res.send("all jobs");
  // await Customer.deleteMany();
  const jobs = await Customer.find({ createdBy: "642f9ebe12d8cd3a40d43507" });
  // console.log(jobs);
  res.json({
    customer: jobs,
    count: jobs.length,
  });
};
const deleteCustomer = async (req, res) => {
  // const {
  //   //nested destructuring
  //   user: { userId }, //comming from auth middleware
  //   params: { id: jobId }, //destructuring and renaming
  // } = req;
  console.log("running");
  console.log(req.params);
  const job = await Customer.findByIdAndDelete({
    _id: req.params.id,
    // createdBy: "642f9ebe12d8cd3a40d43507",
  });
  console.log(job);
  if (!job) {
    throw new NotFoundError("sorry job not fount");
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: `deleted user with id of ${job._id}` });
};
module.exports = {
  createCustomer,
  uploadManyCustomer,
  getAllCustomer,
  getJob,
  updateCustomer,
  deleteCustomer,
  checkCustomerExist,
};
