/**
 * Express router paths go here.
 */


export default {
  Base: '/api',
  Session: '/session',
  Auth: {
    Base: '/auth',
    Login: '/login',
    Logout: '/logout',
  },
  PaintStock: {
    Base: '/stock',
    Get: '/all',
    UpdatePaint: '/update-paint',
    UpdateOrder: '/update-order',
    AddPaint: '/add-paint',
    AddOrder: '/add-order',
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
