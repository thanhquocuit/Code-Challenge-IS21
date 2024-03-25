/**
 * Backend end reflection models, cache server data
 */

import axios from "axios";

export enum UserRoles {
    Standard = 0,
    Admin = 1,
}

export interface IUser {
    id: number;
    email: string;
    name: string;
    role: UserRoles;
}

export interface IPaint {
    id: number;
    title: string;
    color_code: string;
    desc: string;
    status: number;
    quantity: number;
}

export enum PaintStatus {
    Available = 0,
    RunningLow = 1,
    OutOfStock = 2,
}

export interface IOrder {
    id: number;
    title: string;
    address: string;
    paint_color: number;
    status: number;
    created_date: number;
    completed_date: number;
    completed_by: string;
}

export interface ProgressTracker { begin: () => void, end: () => void }

const Cached = {
    sessionLoaded: false,
    session: { id: -1, email: '', name: '', role: 0 } as IUser,
    stock: { paints: [] as IPaint[], orders: [] as IOrder[] }
}

async function acquireSession() {
    if (!Cached.sessionLoaded) {
        let resp: any = await axios.get('/api/session');

        // Yes, has login session
        if (resp.data && resp.data.isLogin) {
            Cached.session = { ...resp.data.sessionData }
        }

        Cached.sessionLoaded = true;
    }
}

async function isLogin() {
    await acquireSession();
    return Cached.session.email && Cached.session.id >= 0
}

function isAdmin() {
    return Cached.sessionLoaded && Cached.session.email && Cached.session.id >= 0 && Cached.session.role == UserRoles.Admin
}

async function login(email: string, password: string, cb: {
    thenFn: (session: IUser | undefined) => void,
    catchFn: () => void,
    finallyFn: () => void
}) {
    axios.post('/api/auth/login', { email, password })
        .then((resp) => {

            // Yes, has login session
            if (resp.data) {
                Cached.session = { ...resp.data }
            }

            Cached.sessionLoaded = true;

            cb.thenFn(resp.data)
        })
        .catch(() => {
            cb.catchFn()
        })
        .finally(() => {
            cb.finallyFn()
        });
}

async function logout() {
    Cached.session = { id: -1, email: '', name: '', role: 0 }; // clean up the session
    await axios.get('/api/auth/logout');
}

async function getPaintStocks() {
    const resp = await axios.get('/api/stock/all');
    Cached.stock = resp.data || { paints: [], orders: [] }
    return Cached.stock;
}

async function updatePaintStatus(itemID: number, status: number, tracker: ProgressTracker) {
    tracker.begin();

    const data = Cached.stock.paints.find(a => a.id == itemID);
    if (data) {
        data.status = status;
        await axios.put('/api/stock/update-paint', { data });
    }
    tracker.end();
}

async function updateOrderStatus(itemID: number, status: number, tracker: ProgressTracker) {
    tracker.begin();

    const data = Cached.stock.orders.find(a => a.id == itemID);
    if (data) {
        data.status = status;
        await axios.put('/api/stock/update-order', { data });
    }
    tracker.end();
}

const dataListeners = {
    cb: (val: any) => { },
    doStockUpdate: () => {
        dataListeners.cb(Cached.stock)
    }
}

export function useSession(): IUser {
    return Cached.session
}

export default {
    login,
    logout,
    isLogin,
    isAdmin,
    useSession,

    // data API
    dataListeners,
    getPaintStocks,
    updatePaintStatus,
    updateOrderStatus
} as const