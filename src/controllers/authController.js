import User from '../models/User';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      gender,
      email,
      phoneNumber,
      address,
      city,
      country,
      password,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }

    // Handle profile avatar
    let profileAvatar = null;
    if (req.file) {
      profileAvatar = `/uploads/avatars/${req.file.filename}`;
    }

    // Create new user
    const user = new User({
      profileAvatar,
      firstName,
      lastName,
      birthDate,
      gender,
      email,
      phoneNumber,
      address,
      city,
      country,
      password,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).populate(
      'devices'
    );
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

// module.exports = {
//   signup,
//   login,
// };

export default { signup, login };
