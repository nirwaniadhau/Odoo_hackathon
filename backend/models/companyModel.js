// models/companyModel.js
import db from '../config/db.js';

class Company {
    static async create(company) {
        const { name, currency } = company;
        const [result] = await db.execute(
            'INSERT INTO companies (name, currency) VALUES (?, ?)',
            [name, currency]
        );
        return result.insertId;
    }
}

export default Company;