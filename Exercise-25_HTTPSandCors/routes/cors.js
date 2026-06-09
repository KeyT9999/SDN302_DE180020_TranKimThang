const allowedOrigins = [
  'https://localhost:3000',
  'https://localhost:3443',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001'
];

const cors = (req, res, next) => {
  const origin = req.headers.origin;
  
  if (!origin) {
    // If Origin header is absent (e.g. Postman, mobile apps, direct server requests), allow access
    return next();
  }

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    return next();
  } else {
    return res.status(403).json({
      success: false,
      message: `Origin ${origin} is not allowed by CORS`
    });
  }
};

module.exports = cors;
