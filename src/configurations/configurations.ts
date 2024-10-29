export const API = {
  USERS: "/identity/users",
  USER_INFO: "/identity/users/info",
  LOGIN: "/identity/auth/login",
  LOGOUT: "/identity/auth/logout",
  LOGIN_WITH_GOOGLE: (code: string)=> `/identity/auth/outbound/google-login?code=${code}`,
  REGISTER: "/identity/users/create",
  REFRESH_TOKEN: "/identity/auth/refresh",
  VERIFY_TOKEN:'identity/auth/introspect',
  CREATE_SUPPLIER: "/kanban/suppliers/create",
  SUPPLIERS:'/kanban/suppliers',
  GET_SUPPLIERS: (page:number|string,size: number|string) => `/kanban/suppliers?page=${page}&size=${size}`,
  UPDATE_SUPPLIER: (suppliersId:string) => `/kanban/suppliers/${suppliersId}`,
  DELETE_SUPPLIER: (suppliersId:string) => `/kanban/suppliers?suppliersId=${suppliersId}`,
  FORM_SUPPLIERS: "/kanban/suppliers/form",
  CATEGORY: "/kanban/categories",
  GET_CATEGORIES_TREE: "/kanban/categories/get-tree",
  PRODUCTS: "/kanban/products",
  SUB_PRODUCTS: "/kanban/sub-products",
  GET_PRODUCT_FILTER_VALUES: "/kanban/sub-products/filter-values",
  PRODUCTS_FILTER_VALUES: "/kanban/products/filter",
  PRODUCT_DETAIL: (productId:string)=> `/kanban/sub-products/product-detail/${productId}`,
  USER_VERIFY: '/identity/otp/user-verify',
  CREATE_OTP: '/identity/otp/send-email-verify',
};

export const PAGE = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  AUTHENTICATE: '/auth/authenticate'
}

export const APP = {
  logo: "https://firebasestorage.googleapis.com/v0/b/kanban-ac9c5.appspot.com/o/kanban-logo.png?alt=media&token=b72b8db5-b31d-4ae9-aab8-8bd7e10e6d8e",
  title: "KANBAN",
  description: "",
};
export const CONFIG = {
  BASE_URL: "http://localhost:3004",
};

export const OAuthConfig = {
  clientId: "427147667603-bodrqv4jh0148qag2cegph5dh7k8djbv.apps.googleusercontent.com",
  redirectUri: `${CONFIG.BASE_URL}${PAGE.AUTHENTICATE}`,
  authUri: "https://accounts.google.com/o/oauth2/auth",
};




