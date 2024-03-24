

// **** Types **** //

export interface IPaint {
    id: number;
    title: string;
    color_color: string;
    desc: string;
    status: number;
    quantity: number;
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