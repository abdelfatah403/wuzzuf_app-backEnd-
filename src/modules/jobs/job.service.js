import Company from "../../DB/models/company.model.js";
import Job from "../../DB/models/job.model.js";

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

  const company = Company.findById(jobFind.companyId);
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
  const jobs = await Job.find();
  return res.status(200).json({ message: "jobs found", jobs });
};

export const getSpicifec = async (req, res, next) => {
  const { companyId } = req.params;
  const jobs = await Job.find({ companyId });
  return res.status(200).json({ message: "jobs found", jobs });
};

