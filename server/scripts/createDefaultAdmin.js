require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@lunevia.com' });
    
    if (existingAdmin) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Create default admin
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@lunevia.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin'
    });

    await adminUser.save();
    console.log('Default admin account created successfully');
    console.log('Email: admin@lunevia.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createDefaultAdmin(); 