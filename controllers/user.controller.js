/* external import */
const nodemailer = require("nodemailer");

/* internal import */
const User = require("../schemas/user.schema");
const userService = require("../services/user.service");

exports.registerAnUser = async (req, res, next) => {
  try {
    const userInfo = await userService.registerAnUserService(req.body);
    const token = userInfo.generateConfirmationToken();
    await userInfo.save({ validateBeforeSave: false });

    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.MY_EMAIL,
      to: userInfo.email,
      subject: "Validation code to confirm registration",
      text: `Thank you for creating your account. Please confirm your account here: ${
        req.protocol
      }://${req.get("host")}/user/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(201).json({
      acknowledgement: true,
      message: "Created",
      description: "New user created",
      data: userInfo,
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
    const user = await userService.getMe(req?.user?.email);

    res.status(200).json({
      acknowledgement: true,
      message: "OK",
      description: "Successfully find out existing user",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      acknowledgement: false,
      message: "Internal Server Error",
      description:
        "A generic error message, given when no more specific message is suitable",
    });
  }
};

exports.confirmEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ confirmationToken: req.params.token });
    if (!user) {
      return res.status(404).json({
        acknowledgement: false,
        message: "Not Found",
        description: "May be user not exists",
      });
    }

    const expire = new Date() > new Date(user.confirmationTokenExpires);
    if (expire) {
      return res.status(404).json({
        acknowledgement: false,
        message: "Not Found",
        description: "May be token expire",
      });
    }

    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;
    user.save({ validateBeforeSave: false });

    res.status(200).json({
      acknowledgement: true,
      message: "OK",
      description: "Registration verification complete",
    });
  } catch (error) {
    next(error);
  }
};
