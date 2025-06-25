import Device from '../models/Device.js';
import User from '../models/User.js';

export const registerDevice = async (req, res) => {
  try {
    const { deviceName, deviceOS, osLanguage, browsers } = req.body;
    const userId = req.user._id;

    // Create new device
    const device = new Device({
      deviceName,
      deviceOS,
      osLanguage,
      browsers,
      userId,
    });

    await device.save();

    // Add device to user's devices array
    await User.findByIdAndUpdate(userId, {
      $push: { devices: device._id },
    });

    res.status(201).json({
      message: 'Device registered successfully',
      device,
    });
  } catch (error) {
    console.error('Register device error:', error);

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

export const getUserDevices = async (req, res) => {
  try {
    const userId = req.user._id;
    const devices = await Device.find({ userId });

    res.json({
      message: 'Devices retrieved successfully',
      devices,
    });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const deleteDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const userId = req.user._id;

    // Find and delete device
    const device = await Device.findOneAndDelete({ _id: deviceId, userId });

    if (!device) {
      return res.status(404).json({
        error: 'Device not found',
      });
    }

    // Remove device from user's devices array
    await User.findByIdAndUpdate(userId, {
      $pull: { devices: deviceId },
    });

    res.json({
      message: 'Device deleted successfully',
    });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
