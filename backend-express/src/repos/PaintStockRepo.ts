import { IOrder, IPaint } from '@src/models/PaintStockRepo';
import Db from '@src/repos/SQLiteORM';

async function getAllPaints(): Promise<IPaint[]> {
    return new Promise<IPaint[]>((resovle) => {
        const ls = [] as IPaint[]
        Db.connPool.all(`SELECT * FROM "Paint" WHERE 1`, (_, rows: IPaint[]) => {
            resovle(rows.map(row => {
                row.title = row.title || ''
                row.desc = row.desc || ''
                return row;
            }));
        })
    })
}

async function getAllOrders(): Promise<IOrder[]> {
    return new Promise<IOrder[]>((resovle) => {
        Db.connPool.all(`SELECT * FROM "Order" WHERE 1`, (_, rows: IOrder[]) => {
            resovle(rows.map(row => {
                row.title = row.title || ''
                row.address = row.address || ''
                return row;
            }));
        })
    })
}

async function updatePaint(obj: IPaint): Promise<boolean> {
    return new Promise<boolean>((resovle) => {
        Db.connPool.run(`UPDATE "Paint" SET title=?, color_code=?, desc=?, status=?, quantity=? WHERE id=?`,
            [obj.title, obj.color_code, obj.desc, obj.status, obj.quantity, obj.id]);
        resovle(true);
    })
}

async function updateOrder(obj: IOrder): Promise<boolean> {
    return new Promise<boolean>((resovle) => {
        Db.connPool.run(`UPDATE "Order" SET title=?, address=?, paint_color=?, status=?, completed_date=?, completed_by=? WHERE id=?`,
            [obj.title, obj.address, obj.paint_color, obj.status, obj.completed_date, obj.completed_by, obj.id]);
        resovle(true);
    })
}

export default {
    getAllPaints,
    getAllOrders,
    updatePaint,
    updateOrder
} as const