import Application from "../../DB/models/application.model.js";
import Company from "../../DB/models/company.model.js";
import Job from "../../DB/models/job.model.js";
import User from "../../DB/models/user.model.js";
import { emailEvent } from "../../utilis/sendEmail/sendEmail.event.js";

export const addJob = async (req, res, next) => {
  const {
    jobTitle,
    jobDescription,
    jobLocation,
    workingTime,
    salary,
    technicalSkills,
    seniorityLevel,
    addedBy,
    updatedBy,
  } = req.body;

  const { companyId } = req.params;

  const companyFind = await Company.findById(companyId);
  if (!companyFind) {
    return next(new Error("company not found", { cause: 404 }));
  }
  if (companyFind.HRs.includes(req.user._id.toString())) {
    const create = await Job.create({
      jobTitle,
      jobDescription,
      jobLocation,
      workingTime,
      salary,
      technicalSkills,
      seniorityLevel,
      addedBy: req.user._id.toString(),
      updatedBy: req.user._id.toString(),
      companyId: companyId,
    });
    return res.status(201).json({ message: "job added successfully", create });
  } else {
    return next(new Error("you are not authorized to add job", { cause: 401 }));
  }
};

export const updateJob = async (req, res, next) => {
  const { jobId } = req.params;
  const {
    jobTitle,
    jobDescription,
    jobLocation,
    workingTime,
    salary,
    technicalSkills,
    seniorityLevel,
    updatedBy,
  } = req.body;
  const jobFind = await Job.findById(jobId);
  if (!jobFind) {
    return next(new Error("job not found", { cause: 404 }));
  }
  if (jobFind.updatedBy.toString() === req.user._id.toString()) {
    const update = await Job.findByIdAndUpdate(
      jobId,
      {
        jobTitle,
        jobDescription,
        jobLocation,
        workingTime,
        salary,
        technicalSkills,
        seniorityLevel,
        updatedBy: req.user._id,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "job updated successfully", update });
  } else {
    return next(
      new Error("you are not authorized to update job", { cause: 401 })
    );
  }
};

export const deleteJob = async (req, res, next) => {
  const { jobId } = req.params;
  const jobFind = await Job.findById(jobId);

  if (!jobFind) {
    return next(new Error("job not found", { cause: 404 }));
  }

  const company = await Company.findOne({ _id: "67c04edfc473c867b006f208" });

  if (!company) {
    return next(new Error("company not found", { cause: 404 }));
  }
  if (company.HRs.includes(req.user._id.toString())) {
    const deleted = await Job.findByIdAndUpdate(
      jobId,
      {
        closed: true,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "job deleted successfully", deleted });
  } else {
    return next(
      new Error("you are not authorized to delete job", { cause: 401 })
    );
  }
};

export const getAllJobs = async (req, res, next) => {
  const { companyId } = req.params;
  let page = req.query.page || 1;
  let limit = 4;
  if (page < 1) {
    page = 1;
  }
  const skip = (page - 1) * limit;
  const filter = { companyId };

  if (req.query.workingTime) {
    filter.workingTime = req.query.workingTime;
  }

  if (req.query.jobLocation) {
    filter.jobLocation = req.query.jobLocation;
  }

  if (req.query.seniorityLevel) {
    filter.seniorityLevel = req.query.seniorityLevel;
  }

  if (req.query.jobTitle) {
    filter.jobTitle = { $regex: req.query.jobTitle, $options: "i" };
  }

  if (req.query.technicalSkills) {
    filter.technicalSkills = { $in: req.query.technicalSkills.split(",") };
  }

  const jobs = await Job.find(filter).skip(skip).limit(limit);
  return res.status(200).json({ message: "jobs found", jobs });
};

export const getJobAndApp = async (req, res, next) => {
  const { companyId, jobId } = req.params;
  let page = req.query.page || 1;
  let limit = 4;
  const skip = (page - 1) * limit;
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error("company not found", { cause: 404 }));
  }

  if (
    company.HRs.includes(req.user._id.toString()) ||
    company._id.toString() === req.user._id.toString()
  ) {
    const job = await Job.findOne({ _id: jobId, companyId: companyId })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "application",
          select: "userCv",
        },
      ]);
    if (!job) {
      return next(new Error("job not found", { cause: 404 }));
    }
    return res.status(200).json({ message: "job found", job });
  } else {
    return next(
      new Error("you are not authorized to view job", { cause: 401 })
    );
  }
};

export const acceptJob = async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error("company not found", { cause: 404 }));
  }
  let app = await Application.findOne({
    jobId: jobId});
    const user = await User.findById(app.userId);
    if (!user) {
      return next(new Error("user not found", { cause: 404 }));
    }
  if (!app) {
    return next(new Error("application not found", { cause: 404 }));
  }
  if (company.HRs.includes(req.user._id.toString())) {
    app.status = "accepted";
    await app.save();
    emailEvent.emit("accept", user.email, user.firstName);
    return res.status(200).json({ message: "application accepted", app });
  } else {
    return next(
      new Error("you are not authorized to accept application", { cause: 401 })
    );
  }
};


export const rejectJob = async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error("company not found", { cause: 404 }));
  }
  let app = await Application.findOne({
    jobId: jobId});
    
    const user = await User.findById(app.userId);
    if (!user) {
      return next(new Error("user not found", { cause: 404 }));
    }
  if (!app) {
    return next(new Error("application not found", { cause: 404 }));
  }
  if (company.HRs.includes(req.user._id.toString())) {
    app.status = "rejected";
    await app.save();
    emailEvent.emit("reject", user.email, user.firstName);
    return res.status(200).json({ message: "application rejected", app });
  } else {
    return next(
      new Error("you are not authorized to reject application", { cause: 401 })
    );
  }
};
