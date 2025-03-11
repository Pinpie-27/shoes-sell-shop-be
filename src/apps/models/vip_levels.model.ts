import {ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface VipLevel {
    id: number;
    level_name: string;
    discount_rate: number;
    min_spend: number;
}

class VipLevelsModel{
    async findById(id:number) : Promise<VipLevel>{
        const [vipLevels] = await db.query<VipLevel[] & RowDataPacket[]>('SELECT * FROM vip_levels WHERE id = ?', [id]);
        return vipLevels[0] 
    }
    async getAllVipLevels() {
        const [vipLevels] = await db.query<VipLevel[] & RowDataPacket[]>('SELECT * FROM vip_levels');
        return vipLevels;
    }
    // async createVipLevel(newVipLevel: Partial<VipLevel>): Promise<number> {
    //     const { level_name, discount_rate, min_spend } = newVipLevel;
    
    //     const [result] = await db.query(
    //         `INSERT INTO vip_levels (level_name, discount_rate, min_spend) 
    //          VALUES (?, ?, ?)`,
    //         [level_name, discount_rate, min_spend]
    //     );
    
    //     return (result as ResultSetHeader & { insertId: number }).insertId;
    // }
    async updateVipLevel(id: number, updatedFields: Partial<VipLevel>): Promise<boolean> {
        const fields = Object.keys(updatedFields).map(field => `${field} =?`).join(', ');
        const values = Object.values(updatedFields);
        values.push(id);

        const [result] = await db.query(
            `UPDATE vip_levels SET ${fields} WHERE id = ?`,
            [...values]
        );

        return (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0;
    }
    async deleteVipLevel(id: number): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>('DELETE FROM vip_levels WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    async findByVipLevelName(level_name: string) {
        const [vipLevels] = await db.query<VipLevel[] & RowDataPacket[]>(
            'SELECT * FROM vip_levels WHERE level_name LIKE?',
            [`%${level_name}%`]
        );
        return vipLevels;
    }
}

export const vipLevelsModel = new VipLevelsModel();