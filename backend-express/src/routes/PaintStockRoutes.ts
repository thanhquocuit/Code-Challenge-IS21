import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { IReq, IRes } from './types/express/misc';
import PaintStockRepo from '@src/repos/PaintStockRepo';
import { IOrder, IPaint } from '@src/models/PaintStockRepo';

// **** Functions **** //

/**
 * Get all paints and orders.
 */
async function getAll(_: IReq, res: IRes) {
    const paints = await PaintStockRepo.getAllPaints();
    const orders = await PaintStockRepo.getAllOrders();

    return res.status(HttpStatusCodes.OK).json({ paints, orders });
}

async function updatePaint(req: IReq<{ data: IPaint }>, res: IRes) {
    await PaintStockRepo.updatePaint(req.body.data)
    return res.status(HttpStatusCodes.OK).end();
}

async function updateOrder(req: IReq<{ data: IOrder }>, res: IRes) {
    await PaintStockRepo.updateOrder(req.body.data)
    return res.status(HttpStatusCodes.OK).json();
}

async function addPaint(req: IReq<{ data: IPaint }>, res: IRes) {
    await PaintStockRepo.addPaint(req.body.data)

    const paints = await PaintStockRepo.getAllPaints()
    return res.status(HttpStatusCodes.OK).json({ paints });
}

async function addOrder(req: IReq<{ data: IOrder }>, res: IRes) {
    await PaintStockRepo.addOrder(req.body.data)

    const orders = await PaintStockRepo.getAllOrders()
    return res.status(HttpStatusCodes.OK).json({ orders });
}


/**
 * See if the param meets criteria to be a paint item.
 */
function isPaintItem(arg: unknown): boolean {
    return (
        !!arg &&
        typeof arg === 'object' &&
        'id' in arg &&
        'title' in arg &&
        'color_code' in arg &&
        'desc' in arg &&
        'status' in arg &&
        'quantity' in arg
    );
}

function isOrderItem(arg: unknown): boolean {
    return (
        !!arg &&
        typeof arg === 'object' &&
        'id' in arg &&
        'title' in arg &&
        'paint_color' in arg &&
        'status' in arg &&
        'created_date' in arg &&
        'completed_date' in arg &&
        'completed_by' in arg
    );
}

export default {
    getAll,
    updatePaint,
    updateOrder,
    addPaint,
    addOrder,
    isPaintItem,
    isOrderItem
} as const