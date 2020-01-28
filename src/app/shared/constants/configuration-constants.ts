import { HeaderNavigaton } from '../models/header';

export const ConfigurationConstants = {
    CUSTOM_POPUP_MAX_WIDTH: '920px',
    CUSTOM_SMALL_POPUP_MAX_WIDTH: '420px',
    CUSTOM_POPUP_WIDTH: '95%',
    DEFAULT_NOTIFICATION_TIMEOUT: 3000,
    ITEM_ADDED_NOTIFICATION_TIMEOUT: 1000,
    HEADER_SKIP_LOADER: 'Skip-Loader',
    HEADER_CACHE_REQUEST: 'Cache-Request',
    REQUEST_CACHE_AGE: 15 * 60 * 1000,
    USER_TYPE: "SELLER"         // in milli seconds
};

export const cartSteps = [
    { name: "My Cart", link: '/ecommerce/cart', isActive: false },
    { name: "Review Order", link: '/ecommerce/review-order', isEnabled: false },
    { name: "Approval", link: '/ecommerce/approval', isEnabled: false },
    { name: "Payment", link: '/ecommerce/payment', isEnabled: false }
]

export const API = {

    PROFILE: 'account/api/user/whoami',
    PROFILE_UPDATE: 'account/api/profile/personal',
    PROFILE_IMAGE: 'account/api/profile/image',
    ADDRESS: 'account/api/address',
    BANK_DETAILS: 'account/api/bank/account',
    DELETE_BANK_DETAILS: (bankAccountId) => `account/api/bank/account/${bankAccountId}`,
    STATE: 'account/api/permitted/address/states',
    BANK_DETAILS_GET: 'account/api/bank/account/user',
    CITY: (stateId) => `account/api/permitted/address/states/${stateId}/cities`,
    CREATE_OTP: 'account/api/auth/otp/create?phone=',
    IS_PHONE_EXIST: 'account/api/auth/checkPhoneAvailable',
    VERIFY_OTP: 'account/api/auth/otp/verify',
    DELETE_CANCELLED_CHEQUE: bankAccountId => `account/api/bank/account/${bankAccountId}/cheque`,
    SIGNUP: 'account/api/auth/signup',
    SIGNIN: 'account/api/auth/signin',
    RESET_PASSWORD: 'account/api/auth/resetPassword',
    REFRESH_USER_TOKEN: 'account/api/user/token/refresh?companyId=',
    EDIT_ADDRESS: addressId => `account/api/address/${addressId}`,
    EDIT_BANK_DETAILS: bankId => `account/api/bank/account/${bankId}`,
    PINCODE: (pincode) => `product/api/system/location/pincode/${pincode}/obj`,
    GET_CATEOGORIES: 'product/api/category/subcategory/varient/list',
    GET_CATALOGUE_CATEGORIES: 'product/api/catalogue/categories',
    GET_CATEGORY_ONE: `product/api/category/subcategory/varient/list`,
    GET_BRAND: categoryId => `product/api/brand/category/${categoryId}/list`,
    SEARCH_SKU: `product/api/sku/search/list`,
    ADD_CATALOGUE: `product/api/catalogueitem/add`,
    GET_CATALOGUE_LIST: `product/api/catalogue/list`,
    GET_UNIQUE_CATALOGUE: catalogueItemId => `product/api/catalogueitem/${catalogueItemId}/obj`,
    TOGGLE_STOCK_STATUS: (catalogueId, status) => `product/api/catalogueitem/${catalogueId}/stockstatus/${status}/submit`,
    PRICING_FOR_ALL_WAREHOUSE: `product/api/catalogueitem/warehouse/price/submit`,
    GET_BANK_NAME: `account/api/bank/account/name`,
    //USER PROFILE API's
    GET_PERCENTAGE: 'account/api/seller/profile/percentage',
    PROFILE_VERIFY: (email) => `account/api/seller/profile/verify?verifiyEmail=${email}`,
    EMAIL_VERIFY: 'account/api/profile/personal/email/verify',
    ANNUAL_TURNOVERS: 'account/api/seller/profile/turnovers',
    BUSINESS_TYPES: 'account/api/seller/profile/types',
    BUSINESS_DETAILS: 'account/api/seller/profile',
    DELETE_ADDRESS_PROOF: (addressId) => `account/api/address/${addressId}/addressProof`,
    IS_BUYER_USER: 'account/api/user/profile/add/SELLER',
    SEARCH_SKU_TEXT: 'product/api/sku/search/list',
    GET_CATALOGUE_FILTERS: 'product/api/catalogue/filter',
    GET_FILTERED_SKUS: 'product/api/catalogue/search/list',
    SEND_TO_EMAIL: 'product/api/catalogue/price/excel/mail',
    FILE_BULK_CATALOGUE: 'product/api/catalogue/price/excel/upload',
    GET_NEW_LEADS: 'product/api/quoterequest/list',
    GET_ACTED_LEADS: 'product/api/quoterequest/list?statusList=ADD&statusList=SUBMIT',
    ADD_BOOKMARK_SAVE_LEADS: (skuId, status) => `product/api/quoterequest/${skuId}/update/${status}`,
    GET_LEAD_OBJ: (leadId) => `product/api/quoterequest/${leadId}/obj`,
    QUOTE_SUBMIT_ALL_WAREHOUSE: (leadid) => `product/api/quoterequest/${leadid}/price`,
    GET_LEADS_FILTERS: 'product/api/quoterequest/filters',
    GET_LEADS_DATA: 'product/api/quoterequest/list',
    GET_ALL_LEADS: `product/api/quoterequest/list/all`,
    GET_PAYMENT_TERMS: `product/api/system/paymentTerms`,
    GET_UPDATED_SKUS_LIST: 'product/api/quoterequest/list',
    UNIQUE_ID: 'product/api/system/upload/seqno',
    UPLOAD_DOC: 'product/api/upload',
    DOWNLOAD_DOC: (attachId) => `product/api/upload/files/${attachId}`,

    GET_PO_LIST: 'product/api/po/list',
    GET_PO_LIST_BY_STATUS: 'product/api/po/v1/status/list',
    GET_PO_REQUEST: (id: number) => `product/api/po/seller/v1/${id}/obj`,
    GET_PO_PDF_DOWNLOAD: (pid: number) => `product/api/pdf/seller/purchaseorder/${pid}`,
    PO_ACCEPT_REJECT: (pid: number, status: string) => `product/api/po/${pid}/status/${status}`,
    GET_PO_ITEMS_LIST: (oid: number) => `product/api/po/seller/v1/${oid}/items`,
    INITIATE_DELIVERY_REQUEST: (orderId: number) => `product/api/po/seller/v1/${orderId}/delivery`,
    
    GET_USER_NOTIFICATIONS: 'product/api/user/notification/list',
    GET_FRIGHT_TERMS: 'account/api/seller/profile/frightTerms'
}

export const HEADER_NAV: HeaderNavigaton[] = [
    { name: 'Leads', link: '/profile-verification/status', imgUrl: 'assets/img/leads.png' },
    // { name: 'Orders', link: '', imgUrl: 'assets/img/order.png' }
    { name: 'Catalogue', link: '/../catalogue/catalogue-list', imgUrl: 'assets/img/catlogue.png' },
    { name: 'PO', link: '/orders/list/pending', imgUrl: 'assets/img/po.png' },
]