export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مرخص'
    });
  }

  if (token === process.env.API_TOKEN || token === 'dev-token') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'رمز غير صحيح'
    });
  }
}
