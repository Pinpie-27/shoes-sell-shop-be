import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../config/db";

export interface ImportReceiptItem {
  id: number;
  import_receipt_id: number;
  product_id: number;
  size: string;
  quantity: number;
  price_import: number;
  created_at: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

class ImportReceiptItemsModel {
  async findById(id: number): Promise<any> {
    const [items] = await db.query<ImportReceiptItem[] & RowDataPacket[]>(
      "SELECT * FROM import_receipt_items WHERE id = ?",
      [id]
    );

    if (!items[0]) return null;

    const item = items[0];
    return {
      ...item,
      price_import: formatCurrency(item.price_import),
    };
  }

  async getAllItems(): Promise<any[]> {
    const [items] = await db.query<ImportReceiptItem[] & RowDataPacket[]>(
      "SELECT * FROM import_receipt_items"
    );

    return items.map((item) => ({
      ...item,
      price_import: formatCurrency(item.price_import),
    }));
  }

  async createItem(newItem: Partial<ImportReceiptItem>): Promise<number> {
    const { import_receipt_id, product_id, size, quantity, price_import } =
      newItem;
    const selling_price = price_import! * 1.3;

    const [result] = await db.query(
      `INSERT INTO import_receipt_items (import_receipt_id, product_id, size, quantity, price_import, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [import_receipt_id, product_id, size, quantity, price_import]
    );
    await db.query(
      `INSERT INTO inventory (product_id, size, quantity, selling_price, created_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
         quantity = quantity + VALUES(quantity),
         selling_price = VALUES(selling_price)
      `,
      [product_id, size, quantity, selling_price]
    );

    return (result as ResultSetHeader & { insertId: number }).insertId;
  }

  async updateItem(
    id: number,
    updatedFields: Partial<ImportReceiptItem>
  ): Promise<boolean> {
    const oldItem = await this.findById(id);
    if (!oldItem) return false;

    const fields = Object.keys(updatedFields)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updatedFields);
    values.push(id);

    const [result] = await db.query(
      `UPDATE import_receipt_items SET ${fields} WHERE id = ?`,
      values
    );

    const newQuantity = updatedFields.quantity ?? oldItem.quantity;
    const newPrice = updatedFields.price_import ?? oldItem.price_import;
    const selling_price = newPrice * 1.3;

    await db.query(
      `UPDATE inventory 
       SET quantity = ?, selling_price = ?
       WHERE product_id = ? AND size = ?`,
      [newQuantity, selling_price, oldItem.product_id, oldItem.size]
    );

    return (
      (result as ResultSetHeader & { affectedRows: number }).affectedRows > 0
    );
  }

  async deleteItem(id: number): Promise<boolean> {
    const oldItem = await this.findById(id);
    if (!oldItem) return false;

    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM import_receipt_items WHERE id = ?",
      [id]
    );

    await db.query(
      `UPDATE inventory 
       SET quantity = GREATEST(quantity - ?, 0)
       WHERE product_id = ? AND size = ?`,
      [oldItem.quantity, oldItem.product_id, oldItem.size]
    );

    return result.affectedRows > 0;
  }

  async findByReceiptOrProductId(searchTerm: number): Promise<any[]> {
    const [items] = await db.query<ImportReceiptItem[] & RowDataPacket[]>(
      `SELECT * FROM import_receipt_items WHERE import_receipt_id = ? OR product_id = ?`,
      [searchTerm, searchTerm]
    );

    return items.map((item) => ({
      ...item,
      price_import: formatCurrency(item.price_import),
    }));
  }
}

export const importReceiptItemsModel = new ImportReceiptItemsModel();
