/**
 * Backend end reflection models, cache server data
 */

import axios from "axios";

export enum UserRoles {
    Painter = 0,
    Marketing = 1,
    Admin = 999,
}

export interface IUser {
    id: number;
    email: string;
    name: string;
    job: string;
    role: UserRoles;
    disabled: number;
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

export interface ProgressTracker { begin: () => void, end: (err?: string) => void }

const Cached = {
    sessionLoaded: false,
    session: { id: -1, email: '', name: '', role: 0 } as IUser,
    stock: { paints: [] as IPaint[], orders: [] as IOrder[] },
    users: [] as IUser[]
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
    catchFn: (err: string) => void,
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
        .catch((err) => {
            cb.catchFn(err.response?.data?.error ?? 'Incorrect email or password')
        })
        .finally(() => {
            cb.finallyFn()
        });
}

async function logout() {
    Cached.session = { id: -1, email: '', name: '', job: '', role: 0, disabled: 0 }; // clean up the session
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

async function getUsers() {
    const resp = await axios.get('/api/users/all');
    Cached.users = resp.data?.users || []
    return Cached.users;
}

async function updateUserStatus(itemID: number, disabled: number, tracker: ProgressTracker) {
    tracker.begin();

    const user = Cached.users.find(a => a.id == itemID);
    if (user) {
        user.disabled = disabled;
        await axios.put('/api/users/update', { user });
    }
    tracker.end();
}

async function updateUserRole(itemID: number, role: number, tracker: ProgressTracker) {
    tracker.begin();

    const user = Cached.users.find(a => a.id == itemID);
    if (user) {
        user.role = role;
        await axios.put('/api/users/update', { user });
    }
    tracker.end();
}


async function createUser(name: string, email: string, role: number, tracker: ProgressTracker) {
    tracker.begin();

    const user = { id: 0, email, name, job: '', role, disabled: 0 }
    const reps = await axios.post('/api/users/add', { user });
    if (reps.data?.error) {
        tracker.end(reps.data.error);
    }
    else if (reps.data?.users) {
        Cached.users = reps.data.users
        tracker.end();
    }
}


const dataListeners = {
    cbStockData: (_val: any) => { },
    cbUserData: (_val: any) => { },
    doStockUpdate: () => {
        dataListeners.cbStockData(Cached.stock)
    },
    doUserUpdate: () => {
        dataListeners.cbUserData(Cached.users)
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
    updateOrderStatus,

    // system admin
    getUsers,
    updateUserStatus,
    updateUserRole,
    createUser,
} as const