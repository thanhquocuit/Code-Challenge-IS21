import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { IReq, IRes } from './types/express/misc';
import PaintStockRepo from '@src/repos/PaintStockRepo';

// **** Functions **** //

/**
 * Get all paints and orders.
 */
async function getAll(_: IReq, res: IRes) {
    const paints = await PaintStockRepo.getAllPaints();
    const orders = await PaintStockRepo.getAllOrders();

    return res.status(HttpStatusCodes.OK).json({ paints, orders });
}


export default {
    getAll
} as const