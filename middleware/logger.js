const logger = (req, res, next) => {
  const method = req.method;
  const endpoint = req.originalUrl;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${endpoint}`);

  next();
};

module.exports = logger;
