const crypto = require('crypto');

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret() {
  return process.env.ADMIN_PASSWORD || 'admin123';
}

function signToken(username) {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + TOKEN_TTL_MS })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyTokenString(token) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payload, sig] = parts;
  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig, 'base64url');
  const expBuf = Buffer.from(expected, 'base64url');

  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (data.exp && data.exp < Date.now()) return null;
    return data.u || null;
  } catch (err) {
    return null;
  }
}

// Express middleware: rejects requests without a valid admin token.
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const user = verifyTokenString(token);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  req.adminUser = user;
  next();
}

// POST /api/v1/auth/login
exports.adminLogin = (req, res) => {
  const { username, password } = req.body || {};
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username and password are required.'
    });
  }

  if (username === expectedUser && password === expectedPass) {
    const token = signToken(expectedUser);
    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: { username: expectedUser }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid admin credentials. Please check your username and password.'
  });
};

// GET /api/v1/auth/verify
exports.verifyToken = (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const user = verifyTokenString(token);

  if (user) {
    return res.json({
      success: true,
      authenticated: true,
      user: { username: user }
    });
  }

  return res.status(401).json({
    success: false,
    authenticated: false,
    error: 'Unauthorized'
  });
};

exports.requireAdmin = requireAdmin;
