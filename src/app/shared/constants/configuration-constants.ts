
export const ConfigurationConstants = {
    CUSTOM_POPUP_MAX_WIDTH: '920px',
    CUSTOM_SMALL_POPUP_MAX_WIDTH: '420px',
    CUSTOM_POPUP_WIDTH: '95%',
    DEFAULT_NOTIFICATION_TIMEOUT: 3000,
    ITEM_ADDED_NOTIFICATION_TIMEOUT: 1000,
    HEADER_SKIP_LOADER: 'Skip-Loader',
    HEADER_CACHE_REQUEST: 'Cache-Request',
    REQUEST_CACHE_AGE: 15 * 60 * 1000,  
    USER_TYPE:"SELLER"         // in milli seconds
};
 
export const cartSteps = [
    {name:"My Cart", link:'/ecommerce/cart', isActive:false},
    {name:"Review Order", link:'/ecommerce/review-order', isEnabled:false},
    {name:"Approval", link:'/ecommerce/approval', isEnabled:false},
    {name:"Payment", link:'/ecommerce/payment', isEnabled:false}
]

export const API = {

    PROFILE:'account/api/user/whoami',
    PROFILE_UPDATE:'account/api/profile/personal',
    PROFILE_IMAGE:'account/api/profile/image',
    ADDRESS:'account/api/address',
    BANK_DETAILS:'account/api/bank/account',
    DELETE_BANK_DETAILS :(bankAccountId) => `account/api/bank/account/${bankAccountId}`,
    STATE:'account/api/permitted/address/states',
    BANK_DETAILS_GET : 'account/api/bank/account/user',
    CITY:(stateId) => `account/api/permitted/address/states/${stateId}/cities`,
    CREATE_OTP: 'account/api/auth/otp/create?phone=',
    IS_PHONE_EXIST: 'account/api/auth/checkPhoneAvailable',
    VERIFY_OTP: 'account/api/auth/otp/verify',
    SIGNUP: 'account/api/auth/signup',
    SIGNIN: 'account/api/auth/signin',
    RESET_PASSWORD: 'account/api/auth/resetPassword',
    REFRESH_USER_TOKEN: 'account/api/user/token/refresh?companyId=',

    EDIT_ADDRESS: addressId => `account/api/address/${addressId}`,
    EDIT_BANK_DETAILS : bankId => `account/api/bank/account/${bankId}`,
    PINCODE : (pincode) => `product/api/system/location/pincode/${pincode}/obj`,
    GET_CATEOGORIES: 'product/api/category/subcategory/varient/list',
    GET_CATALOGUE_CATEGORIES: 'product/api/catalogue/categories',

    //USER PROFILE API's
    GET_PERCENTAGE: 'account/api/seller/profile/percentage',
    PROFILE_VERIFY: (email) => `account/api/seller/profile/verify?verifiyEmail=${email}`,
    EMAIL_VERIFY: 'account/api/profile/personal/email/verify',
    ANNUAL_TURNOVERS: 'account/api/seller/profile/turnovers',
    BUSINESS_TYPES: 'account/api/seller/profile/types'
}