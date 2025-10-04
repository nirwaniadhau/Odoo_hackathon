// // // // controllers/authController.js
// // // import bcrypt from 'bcryptjs';
// // // import jwt from 'jsonwebtoken';
// // // import axios from 'axios';
// // // import nodemailer from 'nodemailer';
// // // import User from '../models/userModel.js';
// // // import Company from '../models/companyModel.js';
// // // import ApprovalRule from '../models/approvalRuleModel.js'; // Import ApprovalRule model
// // // import db from '../config/db.js';

// // // const transporter = nodemailer.createTransport({
// // //     service: 'gmail',
// // //     auth: {
// // //         user: process.env.EMAIL_USER,
// // //         pass: process.env.EMAIL_PASS,
// // //     },
// // // });

// // // export const register = async (req, res) => {
// // //     const { username, email, password, country } = req.body;

// // //     if (!country) return res.status(400).json({ msg: 'Country is required for company currency' });

// // //     try {
// // //         let user = await User.findByEmail(email);
// // //         if (user) return res.status(400).json({ msg: 'User already exists' });

// // //         const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
// // //         const countries = response.data;
// // //         const matchedCountry = countries.find(c => c.name.common === country);
// // //         if (!matchedCountry || !matchedCountry.currencies || Object.keys(matchedCountry.currencies).length === 0) {
// // //             return res.status(400).json({ msg: 'Invalid country or no currency found' });
// // //         }
// // //         const currency = Object.keys(matchedCountry.currencies)[0];

// // //         const companyId = await Company.create({ name: `Company of ${username}`, currency });

// // //         const salt = await bcrypt.genSalt(10);
// // //         const hashedPassword = await bcrypt.hash(password, salt);

// // //         await User.create({
// // //             username,
// // //             email,
// // //             password: hashedPassword,
// // //             role: 'admin',
// // //             company_id: companyId,
// // //             manager_id: null,
// // //             is_active: true
// // //         });

// // //         res.status(201).json({ msg: 'Admin user and company created' });
// // //     } catch (err) {
// // //         res.status(500).json({ msg: 'Server error' });
// // //     }
// // // };

// // // export const login = async (req, res) => {
// // //     const { email, password } = req.body;

// // //     try {
// // //         const user = await User.findByEmail(email);
// // //         if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

// // //         const isMatch = await bcrypt.compare(password, user.password);
// // //         if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

// // //         if (!user.is_active && user.temp_password && password === user.temp_password) {
// // //             await User.update(user.id, { is_active: true, temp_password: null });
// // //         } else if (!user.is_active) {
// // //             return res.status(403).json({ msg: 'Account not activated. Check your email for temporary password.' });
// // //         }

// // //         const payload = { user: { id: user.id, role: user.role, company_id: user.company_id } };
// // //         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

// // //         res.json({ token });
// // //     } catch (err) {
// // //         res.status(500).json({ msg: 'Server error' });
// // //     }
// // // };

// // // export const createEmployee = async (req, res) => {
// // //     const { username, email, role, manager_id } = req.body;
// // //     const company_id = req.user.company_id;

// // //     try {
// // //         let user = await User.findByEmail(email);
// // //         if (user) return res.status(400).json({ msg: 'User already exists' });

// // //         const tempPassword = Math.random().toString(36).slice(-8);
// // //         const salt = await bcrypt.genSalt(10);
// // //         const hashedTempPassword = await bcrypt.hash(tempPassword, salt);

// // //         await User.create({
// // //             username,
// // //             email,
// // //             password: hashedTempPassword,
// // //             role: role || 'employee',
// // //             company_id,
// // //             manager_id: manager_id || null,
// // //             is_active: false,
// // //             temp_password: tempPassword
// // //         });

// // //         await transporter.sendMail({
// // //             from: process.env.EMAIL_USER,
// // //             to: email,
// // //             subject: 'Your Temporary Password for Expense Management',
// // //             text: `Hello ${username},\n\nYour temporary password is: ${tempPassword}\nPlease log in and change it.\n\nBest,\nYour Admin Team`
// // //         });

// // //         res.status(201).json({ msg: 'Employee created and password sent' });
// // //     } catch (err) {
// // //         res.status(500).json({ msg: 'Server error' });
// // //     }
// // // };

// // // export const adminDashboard = async (req, res) => {
// // //     const { username, email, role, manager_id } = req.body;
// // //     const company_id = req.user.company_id;

// // //     if (!username || !email || !role) {
// // //         return res.status(400).json({ msg: 'Username, email, and role are required' });
// // //     }

// // //     try {
// // //         let user = await User.findByEmail(email);
// // //         if (user) return res.status(400).json({ msg: 'User already exists' });

// // //         const password = req.body.password || Math.random().toString(36).slice(-8);
// // //         const salt = await bcrypt.genSalt(10);
// // //         const hashedPassword = await bcrypt.hash(password, salt);

// // //         await User.create({
// // //             username,
// // //             email,
// // //             password: hashedPassword,
// // //             role,
// // //             company_id,
// // //             manager_id: role === 'employee' ? (manager_id || null) : null,
// // //             is_active: true
// // //         });

// // //         res.status(201).json({ msg: 'User created successfully', password });
// // //     } catch (err) {
// // //         res.status(500).json({ msg: 'Server error' });
// // //     }
// // // };

// // // export const adminDashboardApprovalRules = async (req, res) => {
// // //     const { user_email, is_manager_approver, specific_approver_ids, sequence, threshold, rule_type } = req.body;
// // //     const company_id = req.user.company_id;

// // //     if (!user_email || !rule_type || !Array.isArray(specific_approver_ids) || !sequence || threshold === undefined) {
// // //         return res.status(400).json({ msg: 'user_email, rule_type, specific_approver_ids, sequence, and threshold are required' });
// // //     }

// // //     try {
// // //         const user = await User.findByEmail(user_email);
// // //         if (!user) return res.status(404).json({ msg: 'User not found' });
// // //         const user_id = user.id;

// // //         let manager_name = null;
// // //         if (user.manager_id) {
// // //             const manager = await User.findById(user.manager_id);
// // //             manager_name = manager ? manager.username : null;
// // //         }

// // //         let specific_approver_id = null;
// // //         if (is_manager_approver && user.manager_id) {
// // //             specific_approver_id = user.manager_id;
// // //         } else if (specific_approver_ids.length > 0) {
// // //             specific_approver_id = specific_approver_ids[0];
// // //         }

// // //         await ApprovalRule.create({
// // //             company_id,
// // //             rule_type,
// // //             threshold,
// // //             specific_approver_id,
// // //             sequence: JSON.stringify(sequence)
// // //         });

// // //         res.status(201).json({ msg: 'Approval rule created successfully', manager_name });
// // //     } catch (err) {
// // //         res.status(500).json({ msg: 'Server error', error: err.message });
// // //     }
// // // };
// // import bcrypt from 'bcryptjs';
// // import jwt from 'jsonwebtoken';
// // import axios from 'axios';
// // import nodemailer from 'nodemailer';
// // import User from '../models/userModel.js';
// // import Company from '../models/companyModel.js';
// // import ApprovalRule from '../models/approvalRuleModel.js';
// // import db from '../config/db.js';

// // // Email transporter
// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// // // -------------------- REGISTER --------------------
// // export const register = async (req, res) => {
// //   const { name, email, password, country, currency } = req.body;
// //   const username = name; // map frontend 'name' to backend 'username'

// //   if (!country) return res.status(400).json({ msg: 'Country is required for company currency' });
// //   if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });

// //   try {
// //     // Check if user exists
// //     const user = await User.findByEmail(email);
// //     if (user) return res.status(400).json({ msg: 'User already exists' });

// //     // Use frontend-provided currency if available, else fetch from RESTCountries
// //     let companyCurrency = currency;
// //     if (!companyCurrency) {
// //       const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
// //       const countries = response.data;
// //       const matchedCountry = countries.find(c => c.name.common === country);
// //       if (!matchedCountry || !matchedCountry.currencies || Object.keys(matchedCountry.currencies).length === 0) {
// //         return res.status(400).json({ msg: 'Invalid country or no currency found' });
// //       }
// //       companyCurrency = Object.keys(matchedCountry.currencies)[0];
// //     }

// //     // Create company
// //     const company = await Company.create({ name: `Company of ${username}`, currency: companyCurrency });
// //     const companyId = company.id || company._id; // ensure correct id

// //     // Hash password
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     // Create admin user
// //     await User.create({
// //       username,
// //       email,
// //       password: hashedPassword,
// //       role: 'admin',
// //       company_id: companyId,
// //       manager_id: null,
// //       is_active: true
// //     });

// //     res.status(201).json({ msg: 'Admin user and company created successfully' });

// //   } catch (err) {
// //     console.error('Register error:', err);
// //     res.status(500).json({ msg: 'Server error', error: err.message });
// //   }
// // };

// // // -------------------- LOGIN --------------------
// // export const login = async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     const user = await User.findByEmail(email);
// //     if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

// //     if (!user.is_active && user.temp_password && password === user.temp_password) {
// //       await User.update(user.id, { is_active: true, temp_password: null });
// //     } else if (!user.is_active) {
// //       return res.status(403).json({ msg: 'Account not activated. Check your email for temporary password.' });
// //     }

// //     const payload = { user: { id: user.id, role: user.role, company_id: user.company_id } };
// //     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

// //     res.json({ token });
// //   } catch (err) {
// //     console.error('Login error:', err);
// //     res.status(500).json({ msg: 'Server error', error: err.message });
// //   }
// // };

// // // -------------------- CREATE EMPLOYEE --------------------
// // export const createEmployee = async (req, res) => {
// //   const { username, email, role, manager_id } = req.body;
// //   const company_id = req.user.company_id;

// //   try {
// //     let user = await User.findByEmail(email);
// //     if (user) return res.status(400).json({ msg: 'User already exists' });

// //     const tempPassword = Math.random().toString(36).slice(-8);
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedTempPassword = await bcrypt.hash(tempPassword, salt);

// //     await User.create({
// //       username,
// //       email,
// //       password: hashedTempPassword,
// //       role: role || 'employee',
// //       company_id,
// //       manager_id: manager_id || null,
// //       is_active: false,
// //       temp_password: tempPassword
// //     });

// //     await transporter.sendMail({
// //       from: process.env.EMAIL_USER,
// //       to: email,
// //       subject: 'Your Temporary Password for Expense Management',
// //       text: `Hello ${username},\n\nYour temporary password is: ${tempPassword}\nPlease log in and change it.\n\nBest,\nYour Admin Team`
// //     });

// //     res.status(201).json({ msg: 'Employee created and password sent' });
// //   } catch (err) {
// //     console.error('Create employee error:', err);
// //     res.status(500).json({ msg: 'Server error', error: err.message });
// //   }
// // };

// // // -------------------- ADMIN DASHBOARD --------------------
// // export const adminDashboard = async (req, res) => {
// //   // similar to createEmployee, already handled in your code
// // };

// // // -------------------- ADMIN DASHBOARD APPROVAL RULES --------------------
// // export const adminDashboardApprovalRules = async (req, res) => {
// //   // already handled, with error logging
// // };
// // controllers/authController.js
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import axios from 'axios';
// import nodemailer from 'nodemailer';
// import User from '../models/userModel.js';
// import Company from '../models/companyModel.js';
// import ApprovalRule from '../models/approvalRuleModel.js';

// // -------------------- EMAIL TRANSPORTER --------------------
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // -------------------- REGISTER --------------------
// export const register = async (req, res) => {
//     const { name, email, password, country, currency } = req.body;
//     const username = name; // frontend 'name' maps to backend 'username'

//     if (!country) return res.status(400).json({ msg: 'Country is required for company currency' });
//     if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });

//     try {
//         // Check if user exists
//         const user = await User.findByEmail(email);
//         if (user) return res.status(400).json({ msg: 'User already exists' });

//         // Determine currency
//         let companyCurrency = currency;
//         if (!companyCurrency) {
//             const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
//             const countries = response.data;
//             const matchedCountry = countries.find(c => c.name.common === country);
//             if (!matchedCountry || !matchedCountry.currencies || Object.keys(matchedCountry.currencies).length === 0) {
//                 return res.status(400).json({ msg: 'Invalid country or no currency found' });
//             }
//             companyCurrency = Object.keys(matchedCountry.currencies)[0];
//         }

//         // Create company
//         const companyId = await Company.create({ name: `Company of ${username}`, currency: companyCurrency });

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create admin user
//         await User.create({
//             username,
//             email,
//             password: hashedPassword,
//             role: 'admin',
//             company_id: companyId,
//             manager_id: null,
//             is_active: true,
//             temp_password: null
//         });

//         res.status(201).json({ msg: 'Admin user and company created successfully' });

//     } catch (err) {
//         console.error('Register error:', err);
//         res.status(500).json({ msg: 'Server error', error: err.message });
//     }
// };

// // -------------------- LOGIN --------------------
// export const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findByEmail(email);
//         if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

//         if (!user.is_active && user.temp_password && password === user.temp_password) {
//             await User.update(user.id, { is_active: true, temp_password: null });
//         } else if (!user.is_active) {
//             return res.status(403).json({ msg: 'Account not activated. Check your email for temporary password.' });
//         }

//         const payload = { user: { id: user.id, role: user.role, company_id: user.company_id } };
//         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.json({ token });

//     } catch (err) {
//         console.error('Login error:', err);
//         res.status(500).json({ msg: 'Server error', error: err.message });
//     }
// };

// // -------------------- CREATE EMPLOYEE --------------------
// export const createEmployee = async (req, res) => {
//     const { username, email, role, manager_id } = req.body;
//     const company_id = req.user.company_id;

//     try {
//         const existingUser = await User.findByEmail(email);
//         if (existingUser) return res.status(400).json({ msg: 'User already exists' });

//         const tempPassword = Math.random().toString(36).slice(-8);
//         const salt = await bcrypt.genSalt(10);
//         const hashedTempPassword = await bcrypt.hash(tempPassword, salt);

//         await User.create({
//             username,
//             email,
//             password: hashedTempPassword,
//             role: role || 'employee',
//             company_id,
//             manager_id: manager_id || null,
//             is_active: false,
//             temp_password: tempPassword
//         });

//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: 'Your Temporary Password for Expense Management',
//             text: `Hello ${username},\n\nYour temporary password is: ${tempPassword}\nPlease log in and change it.\n\nBest,\nYour Admin Team`
//         });

//         res.status(201).json({ msg: 'Employee created and password sent' });

//     } catch (err) {
//         console.error('Create employee error:', err);
//         res.status(500).json({ msg: 'Server error', error: err.message });
//     }
// };

// // -------------------- ADMIN DASHBOARD --------------------
// export const adminDashboard = async (req, res) => {
//     res.status(200).json({ msg: 'Admin dashboard placeholder - implement as needed' });
// };

// // -------------------- ADMIN DASHBOARD APPROVAL RULES --------------------
// export const adminDashboardApprovalRules = async (req, res) => {
//     const { user_email, is_manager_approver, specific_approver_ids, sequence, threshold, rule_type } = req.body;
//     const company_id = req.user.company_id;

//     if (!user_email || !rule_type || !Array.isArray(specific_approver_ids) || !sequence || threshold === undefined) {
//         return res.status(400).json({ msg: 'user_email, rule_type, specific_approver_ids, sequence, and threshold are required' });
//     }

//     try {
//         const user = await User.findByEmail(user_email);
//         if (!user) return res.status(404).json({ msg: 'User not found' });
//         const user_id = user.id;

//         let manager_name = null;
//         if (user.manager_id) {
//             const manager = await User.findById(user.manager_id);
//             manager_name = manager ? manager.username : null;
//         }

//         let specific_approver_id = null;
//         if (is_manager_approver && user.manager_id) {
//             specific_approver_id = user.manager_id;
//         } else if (specific_approver_ids.length > 0) {
//             specific_approver_id = specific_approver_ids[0];
//         }

//         await ApprovalRule.create({
//             company_id,
//             rule_type,
//             threshold,
//             specific_approver_id,
//             sequence: JSON.stringify(sequence)
//         });

//         res.status(201).json({ msg: 'Approval rule created successfully', manager_name });

//     } catch (err) {
//         console.error('Approval rules error:', err);
//         res.status(500).json({ msg: 'Server error', error: err.message });
//     }
// };
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';
import Company from '../models/companyModel.js';
import ApprovalRule from '../models/approvalRuleModel.js';

// -------------------- EMAIL TRANSPORTER --------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// -------------------- REGISTER --------------------
export const register = async (req, res) => {
    const { name, email, password, country, currency } = req.body;
    const username = name; // frontend 'name' maps to backend 'username'

    if (!country) return res.status(400).json({ msg: 'Country is required for company currency' });
    if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });

    try {
        const user = await User.findByEmail(email);
        if (user) return res.status(400).json({ msg: 'User already exists' });

        let companyCurrency = currency;
        if (!companyCurrency) {
            const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
            const countries = response.data;
            const matchedCountry = countries.find(c => c.name.common === country);
            if (!matchedCountry || !matchedCountry.currencies || Object.keys(matchedCountry.currencies).length === 0) {
                return res.status(400).json({ msg: 'Invalid country or no currency found' });
            }
            companyCurrency = Object.keys(matchedCountry.currencies)[0];
        }

        const companyId = await Company.create({ name: `Company of ${username}`, currency: companyCurrency });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin',
            company_id: companyId,
            manager_id: null,
            is_active: true,
            temp_password: null
        });

        res.status(201).json({ msg: 'Admin user and company created successfully' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        if (!user.is_active && user.temp_password && password === user.temp_password) {
            await User.update(user.id, { is_active: true, temp_password: null });
        } else if (!user.is_active) {
            return res.status(403).json({ msg: 'Account not activated. Check your email for temporary password.' });
        }

        const payload = { user: { id: user.id, role: user.role, company_id: user.company_id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// -------------------- CREATE EMPLOYEE --------------------
export const createEmployee = async (req, res) => {
    const { username, email, role, manager_id } = req.body;
    const company_id = req.user.company_id;

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) return res.status(400).json({ msg: 'User already exists' });

        const tempPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedTempPassword = await bcrypt.hash(tempPassword, salt);

        await User.create({
            username,
            email,
            password: hashedTempPassword,
            role: role || 'employee',
            company_id,
            manager_id: manager_id || null,
            is_active: false,
            temp_password: tempPassword
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Temporary Password for Expense Management',
            text: `Hello ${username},\n\nYour temporary password is: ${tempPassword}\nPlease log in and change it.\n\nBest,\nYour Admin Team`
        });

        res.status(201).json({ msg: 'Employee created and password sent' });
    } catch (err) {
        console.error('Create employee error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// -------------------- GET USERS --------------------
export const getUsers = async (req, res) => {
    const company_id = req.user.company_id;
    try {
        const users = await User.find({ company_id }).select("-password -temp_password");
        res.status(200).json({ users });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// -------------------- DELETE EMPLOYEE --------------------
export const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    const company_id = req.user.company_id;

    try {
        const user = await User.findOne({ _id: id, company_id });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        await User.deleteOne({ _id: id });
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete employee error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// -------------------- RESEND TEMP PASSWORD --------------------
export const resendPassword = async (req, res) => {
    const { id } = req.params;
    const company_id = req.user.company_id;

    try {
        const user = await User.findOne({ _id: id, company_id });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const tempPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedTempPassword = await bcrypt.hash(tempPassword, salt);

        await User.updateOne({ _id: id }, { password: hashedTempPassword, temp_password: tempPassword, is_active: false });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Your Temporary Password for Expense Management',
            text: `Hello ${user.username},\n\nYour temporary password is: ${tempPassword}\nPlease log in and change it.\n\nBest,\nYour Admin Team`
        });

        res.status(200).json({ msg: 'Temporary password sent successfully' });
    } catch (err) {
        console.error('Resend password error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// -------------------- ADMIN DASHBOARD PLACEHOLDER --------------------
export const adminDashboard = async (req, res) => {
  // Fetch all employees from DB
  const users = await User.find();
  res.status(200).json({ users });
};


// -------------------- ADMIN DASHBOARD APPROVAL RULES --------------------
export const adminDashboardApprovalRules = async (req, res) => {
    const { user_email, is_manager_approver, specific_approver_ids, sequence, threshold, rule_type } = req.body;
    const company_id = req.user.company_id;

    if (!user_email || !rule_type || !Array.isArray(specific_approver_ids) || !sequence || threshold === undefined) {
        return res.status(400).json({ msg: 'user_email, rule_type, specific_approver_ids, sequence, and threshold are required' });
    }

    try {
        const user = await User.findByEmail(user_email);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        const user_id = user.id;

        let manager_name = null;
        if (user.manager_id) {
            const manager = await User.findById(user.manager_id);
            manager_name = manager ? manager.username : null;
        }

        let specific_approver_id = null;
        if (is_manager_approver && user.manager_id) {
            specific_approver_id = user.manager_id;
        } else if (specific_approver_ids.length > 0) {
            specific_approver_id = specific_approver_ids[0];
        }

        await ApprovalRule.create({
            company_id,
            rule_type,
            threshold,
            specific_approver_id,
            sequence: JSON.stringify(sequence)
        });

        res.status(201).json({ msg: 'Approval rule created successfully', manager_name });
    } catch (err) {
        console.error('Approval rules error:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};
