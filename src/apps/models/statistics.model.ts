import { db } from "../../config/db";
import { RowDataPacket } from "mysql2";

class StatisticsModel {
  async getTotalSpentByUsers(): Promise<
    { id: number; name: string; total_spent: number }[]
  > {
    const [rows] = await db.query<RowDataPacket[]>(`
  SELECT 
    users.id,
    users.username,
    COALESCE(SUM(orders.total_price), 0) AS total_spent
  FROM users
  LEFT JOIN orders ON users.id = orders.user_id
  WHERE users.role = 'user'
  GROUP BY users.id, users.username
`);

    return rows as { id: number; name: string; total_spent: number }[];
  }
}

export const statisticsModel = new StatisticsModel();
