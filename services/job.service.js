/* external import */
const JOB = require("../schemas/job.schema");

exports.insertNewJob = async (data) => {
  const result = await JOB.create(data);
  return result;
};

exports.displayAllJobs = async () => {
  const result = await JOB.find({});
  return result;
};

exports.displaySpecificJob = async (id) => {
  const result = await JOB.findById(id);
  return result;
};

exports.modifyExistingJobCredentials = async (id, data) => {
  const result = await JOB.updateOne({ _id: id }, data, {
    runValidators: true,
  });
  return result;
};
