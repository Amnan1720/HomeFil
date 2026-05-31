const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

const UserSchema = new mongoose.Schema({
  name:       { type: String },
  email:      { type: String },
  phone:      { type: String },
  password:   { type: String },
  role:       { type: String },
  location:   { type: String },
  isApproved: { type: Boolean },
  status:     { type: String },
  createdAt:  { type: Date }
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️ Cleared old admin');

    const hashedPassword = await bcrypt.hash('admin1234', 10);
    const admin = new User({
      name:       'Admin',
      email:      'admin@homefil.com',
      phone:      '0700000000',
      password:   hashedPassword,
      role:       'admin',
      status:     'approved',
      isApproved: true,
      createdAt:  new Date()
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('📧 Email:    admin@homefil.com');
    console.log('🔑 Password: admin1234');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit();
  }
}

createAdmin();