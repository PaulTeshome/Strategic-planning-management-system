const User = require("../../models/user.model");
const APIError = require("../../utils/apiError");
const catchAsync = require("../../utils/catchAsync");
const Email = require("../../utils/sendMail");
const { StatusCodes } = require("http-status-codes");

const { fileUpload } = require("./../profile/fileUpload");


exports.signUp = catchAsync(async (req, res, next) => {

  const parsedBody = req.body
  const { email } = parsedBody;



  const user = await User.findOne({
    email,
  });

  if (user) {
    return next(
      new APIError(`Email already registered`, StatusCodes.BAD_REQUEST)
    );
  }

  let newUser = await new User(parsedBody);

  if (!newUser) {
    return next(
      new APIError(
        `User cannot be created at the moment`,
        StatusCodes.BAD_REQUEST
      )
    );
  }


  //activationToken
  const activationToken = newUser.createActivationToken();

  await newUser.save();

  const activationURL = `http://${"localhost:4000"}/activate?token=${activationToken}&email=${email}`;

  try {
    await new Email(newUser, activationURL).sendPasswordReset();
    console.log(activationURL);

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: activationToken,
    });
  } catch (err) {
    newUser.activationToken = undefined;
    newUser.activationTokenExpires = undefined;
    await newUser.save({
      validateBeforeSave: false,
    });

    return next(
      new APIError("There was an error sending the email. Try again later!"),
      500
    );
  }
});


exports.createAccount = catchAsync(async (req, res, next) => {
  // create an account with by receiving the role, email and send email to the person with the temporary password generated
  // extract the role, email from the request body
  const {email,firstName,lastName, role} = req.body;

  const user = await User.findOne({email});

  if(user){
    return next(new APIError('Email already registered', StatusCodes.BAD_REQUEST));
  }

  const newUser = await new User({
    email,
    firstName,
    lastName,
    role,
  });

  // add generated password to the user
  newUser.password = process.env.DEFAULT_PASSWORD;
  newUser.passwordConfirm = process.env.DEFAULT_PASSWORD;

  // save the user
  await newUser.save();

  // send the email
  const activationURL = `http://${"localhost:4000"}/activate?token=${newUser.activationToken}&email=${email}`;
  try {
    await new Email(newUser, activationURL).sendPasswordReset();
    console.log(activationURL);

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: newUser.activationToken,
    });
  } catch (err) {
    newUser.activationToken = undefined;
    newUser.activationTokenExpires = undefined;
    await newUser.save({
      validateBeforeSave: false,
    });

    return next(
      new APIError("There was an error sending the email. Try again later!"),
      500
    );
  }

  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: null,
  });
});