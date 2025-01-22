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


  newUser.isVerified = true;
  await newUser.save();

  // confirm signup
  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: null,
  });

});


exports.createAccount = catchAsync(async (req, res, next) => {
  // create an account with by receiving the role, email and send email to the person with the temporary password generated
  // extract the role, email from the request body
  const {email,firstName,lastName, role} = req.body;

  const user = await User.findOne({email});

  if(user){
    return next(new APIError('Email already registered', StatusCodes.BAD_REQUEST));
  }

  
  // add generated password to the user
  // generate the password
     const password = Math.random()
      .toString(36)
      .slice(-8);
    parsedBody.password = password;
    parsedBody.passwordConfirm = password; 


  const newUser = await new User({
    email,
    firstName,
    lastName,
    role,
    password,
    passwordConfirm: password

  });



  // save the user
  newUser.isVerified = true;
  await newUser.save();

  // send the email
    await new Email(newUser, "http://localhost:4000").sendPasswordReset();
    console.log(activationURL);

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: newUser.activationToken,
    });

});