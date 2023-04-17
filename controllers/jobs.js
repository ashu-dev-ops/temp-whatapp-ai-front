const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const getAllJobs = async (req, res) => {
  // res.send("all jobs");
  const jobs = await Job.find({ createdBy: req.user.userId });
  console.log(jobs);
  res.json({
    jobs: jobs,
    count: jobs.length,
  });
};
const getJob = async (req, res) => {
  // res.send("get a single job");
  const {
    //nested destructuring
    user: { userId },
    params: { id: jobId }, //destructuring and renaming
  } = req;
  const job = await Job.findOne({ createdBy: userId, _id: jobId });
  if (!job) {
    throw new NotFoundError("sorry job not fount");
  }
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  // res.send("create a job");
  // res.json(req.user);
  req.body.createdBy = req.user.userId; //from authentication middleware
  const job = await Job.create(req.body);
  res.json(job);
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    //nested destructuring

    user: { userId },
    params: { id: jobId }, //destructuring and renaming
  } = req;
  if (!company || !position) {
    throw new BadRequestError("fields cant be empty");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  // console.log(job);
  // console.log(req.body);
  if (!job) {
    throw new NotFoundError("sorry job not fount");
  }
  // res.send("update a job");
  res.json({ job });
};
const deleteJob = async (req, res) => {
  const {
    //nested destructuring
    user: { userId }, //comming from auth middleware
    params: { id: jobId }, //destructuring and renaming
  } = req;
  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError("sorry job not fount");
  }

  res.status(StatusCodes.OK).json({ msg: `deleted user with id of ${jobId}` });
};
module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
