export const localDataNames = {
    'authData':'authData',
}

export const Role = {
    ADMIN: "ADMIN",
    USER: "USER",
}

export const DISCOUNT_TYPE = (type: string) => {
    const types: any = {
        FIXED_AMOUNT: 'VND',
        PERCENT: '%'
    };
    return types[type];
};