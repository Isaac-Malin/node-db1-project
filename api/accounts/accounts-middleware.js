const Account = require("./accounts-model");
const db = require("../../data/db-config");

exports.checkAccountPayload = (req, res, next) => {
  // DO YOUR MAGIC
  // Note: you can either write "manual" validation logic
  // or use the Yup library (not currently installed)
  const error = { status: 400 };
  const { name, budget } = req.body;
  if (name === undefined || budget === undefined) {
    error.message = "name and budget are required";
  } else if (typeof name !== "string") {
    error.message = "name of account must be a string";
  } else if (!name || name.trim().length < 3 || name.trim().length > 100) {
    // Add !name to check if name is not undefined or empty
    error.message = "name of account must be between 3 and 100";
  } else if (typeof budget !== "number" || isNaN(budget)) {
    error.message = "budget of account must be a number";
  } else if (budget < 0 || budget > 1000000) {
    error.message = "budget of account is too large or too small";
  }

  if (error.message) {
    res.status(400).json(error)
  } else {
    next();
  }
};

exports.checkAccountNameUnique = async (req, res, next) => {
  const { name } = req.body;

  if (name) { // Only proceed if name is not undefined
    try {
      const existing = await db('accounts')
        .where('name', name.trim())
        .first()

      if (existing) {
        next({ status: 400, message: 'that name is taken'})
      } else {
        next()
      }
    } catch (err) {
      next(err)
    }
  } else {
    next() // If name is undefined, pass control to the next middleware
  }
};
exports.checkAccountId = async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const account = await Account.getById(req.params.id)
    if (!account) {
      next({ status: 404, message: "account not found"})
    } else {
      req.account = account
      next()
    }
  } catch (err) {
    next(err)
  }
};
