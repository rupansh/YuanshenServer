export type AccountDataMin = {
    email: string,
    name: string,
    uid: string
}

export type AccountData = AccountDataMin & {
    token: string
}

export function buildAccountData({ email, name, uid, token }: AccountData) {
    return {
        "account": {
            "apple_name": "",
            "area_code": "**",
            "country": "US",
            "device_grant_ticket": "",
            email,
            "facebook_name": "",
            "game_center_name": "",
            "google_name": "",
            "identity_card": "",
            "is_email_verify": "0",
            "mobile": "",
            name, 
            "reactivate_ticket": "",
            "realname": "",
            "safe_mobile": "",
            "sony_name": "",
            "tap_name": "",
            token,
            "twitter_name": "",
            uid
        },
        "device_grant_required": "false",
        "realperson_required": false,
        "realname_operation": "None",
        "safe_moblie_required": "false"
    };
}


export function buildDispatchResponse<T>(code: number, data: T | null) {
    let message: string;
    switch (code) {
        case 0:
           message = "OK";
           break;
        case -1:
            message = "not matched";
            break;
        default:
            message = "ERROR"
            break;
    }

    const payload = { retcode: code, message, data };
    return JSON.stringify(payload);
}

export const DEFAULT_ACCOUNT_DATA: AccountDataMin = {
    email: "ceo@hoyolab.com",
    name: "Ceo",
    uid: 0x1234.toString()
};