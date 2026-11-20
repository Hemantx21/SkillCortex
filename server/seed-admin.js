import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const accounts = [
    { name: 'Platform Admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: 'admin' },
    { name: 'HR Recruiter', email: process.env.HR_EMAIL, password: process.env.HR_PASSWORD, role: 'hr' }
];

async function seedAccount({ name, email, password, role }) {
    let user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    const created = !user;

    if (!user) {
        user = new User({ email });
    }

    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;
    user.isApproved = true;
    await user.save();

    if (!await user.comparePassword(password)) {
        throw new Error(`Could not verify seeded ${role} credentials`);
    }

    console.log(`${created ? 'Created' : 'Updated'} ${role} account: ${email}`);
}

try {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI must be configured before seeding accounts');
    }
    for (const { email, password, role } of accounts) {
        if (!email || !password) {
            throw new Error(`${role.toUpperCase()}_EMAIL and ${role.toUpperCase()}_PASSWORD must be configured before seeding accounts`);
        }
    }

    await mongoose.connect(process.env.MONGODB_URI);
    await Promise.all(accounts.map(seedAccount));
} catch (error) {
    console.error('Admin/HR account seeding failed:', error);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
