const router = require("express").Router();
const Account = require("./accounts-model");
const {checkAccountId, checkAccountNameUnique, checkAccountPayload} = require("./accounts-middleware");

router.get("/", async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const accounts = await Account.getAll()
    res.json(accounts)
  } catch (err) {
    next(err);
  }
});

router.get("/:id", checkAccountId, async (req, res, next) => {
  // DO YOUR MAGIC
  res.json(req.account)
});

router.post(
  "/",
  checkAccountNameUnique, checkAccountPayload,
  async (req, res, next) => {
    // DO YOUR MAGIC
    const { name, budget } = req.body

    if (name && budget) {
      try {
        const newAccount = await Account.create({name: name.trim(), budget})
        res.status(201).json(newAccount)
      } catch (err) {
        next(err);
      }
    } else {
      next({ status: 400, message: "name and budget are required" });
    }
  }
);

router.put("/:id", checkAccountId, checkAccountPayload, (req, res, next) => {
  // DO YOUR MAGIC
  // try {
  // } catch (err) {
  //   next(err);
  // }
});

router.delete("/:id", checkAccountId, async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    await Account.deleteById(req.params.id)
    res.status(req.account)
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => { // eslint-disable-line
  // DO YOUR MAGIC
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = router;
