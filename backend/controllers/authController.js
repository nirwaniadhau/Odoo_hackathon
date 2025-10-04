// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';
import Company from '../models/companyModel.js';
import ApprovalRule from '../models/approvalRuleModel.js'; // Import ApprovalRule model
import db from '../config/db.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const register = async (req, res) => {
    const { username, email, password, country } = req.body;

    if (!country) return res.status(400).json({ msg: 'Country is required for company currency' });

    try {
        let user = await User.findByEmail(email);
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
        const countries = response.data;
        const matchedCountry = countries.find(c => c.name.common === country);
        if (!matchedCountry || !matchedCountry.currencies || Object.keys(matchedCountry.currencies).length === 0) {
            return res.status(400).json({ msg: 'Invalid country or no currency found' });
        }
        const currency = Object.keys(matchedCountry.currencies)[0];

        const companyId = await Company.create({ name: `Company of ${username}`, currency });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin',
            company_id: companyId,
            manager_id: null,
            is_active: true
        });

        res.status(201).json({ msg: 'Admin user and company created' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

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
        res.status(500).json({ msg: 'Server error' });
    }
};

export const createEmployee = async (req, res) => {
    const { username, email, role, manager_id } = req.body;
    const company_id = req.user.company_id;

    try {
        let user = await User.findByEmail(email);
        if (user) return res.status(400).json({ msg: 'User already exists' });

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
        res.status(500).json({ msg: 'Server error' });
    }
};

export const adminDashboard = async (req, res) => {
    const { username, email, role, manager_id } = req.body;
    const company_id = req.user.company_id;

    if (!username || !email || !role) {
        return res.status(400).json({ msg: 'Username, email, and role are required' });
    }

    try {
        let user = await User.findByEmail(email);
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const password = req.body.password || Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            username,
            email,
            password: hashedPassword,
            role,
            company_id,
            manager_id: role === 'employee' ? (manager_id || null) : null,
            is_active: true
        });

        res.status(201).json({ msg: 'User created successfully', password });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

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
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};