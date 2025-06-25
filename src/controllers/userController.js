import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    res.json({
      message: 'Profile retrieved successfully',
      user: req.user.toJSON(),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user._id;

    // Handle profile avatar update
    if (req.file) {
      updates.profileAvatar = `/uploads/avatars/${req.file.filename}`;
    }

    // Remove password from updates if present
    delete updates.password;
    delete updates.email; // Prevent email changes through this endpoint

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).populate('devices');

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Update profile error:', error);

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
