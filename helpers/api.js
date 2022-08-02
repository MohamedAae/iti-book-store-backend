const handleError = (err, res) => {
  return res.status(500).json({
    success: false,
    code: 500,
    error: `${err.toString()}`,
  });
};
module.exports = { handleError };
