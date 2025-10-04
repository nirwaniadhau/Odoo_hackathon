// models/approvalRuleModel.js
import db from '../config/db.js';

class ApprovalRule {
    static async create(data) {
        const { company_id, rule_type, threshold, specific_approver_id, sequence } = data;
        const [result] = await db.query(
            'INSERT INTO approval_rules (company_id, rule_type, threshold, specific_approver_id, sequence) VALUES (?, ?, ?, ?, ?)',
            [company_id, rule_type, threshold, specific_approver_id, sequence]
        );
        return result;
    }
}

export default ApprovalRule;