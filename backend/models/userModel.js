// models/userModel.js
import db from '../config/db.js';

class User {
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { username, email, password, role, company_id, manager_id, is_active, temp_password } = data;
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role, company_id, manager_id, is_active, temp_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [username, email, password, role, company_id, manager_id, is_active, temp_password]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { is_active, temp_password } = data;
        await db.query(
            'UPDATE users SET is_active = ?, temp_password = ? WHERE id = ?',
            [is_active, temp_password, id]
        );
    }
}

export default User;