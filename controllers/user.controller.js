/* internal import */
const userService = require("../services/user.service");

exports.registerAnUser = async (req, res, next) => {
  try {
    const result = await userService.registerAnUser(req.body);
    console.log(req.body, "ACC");

    if (!result) {
      res.status(404).json({
        message: "User not exists!",
      });
    }

    res.status(201).json({
      acknowledgement: true,
      message: "Created",
      description: "New user created",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.loginAnUser = async (req, res, next) => {
  try {
    const result = await userService.loginAnUser(req.body);

    res.status(202).json({
      acknowledgement: true,
      message: "Accepted",
      description: "Successfully logged in",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await userService.getMe(req.user.email);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};
