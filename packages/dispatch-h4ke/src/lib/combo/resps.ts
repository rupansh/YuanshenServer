export function verifyTokenV2(token: string) {
    const payload = {
        account_type: 1,
        combo_id: 0x4321,
        combo_token: token,
        data: { guest: false },
        heartbeat: false,
        open_id: 0x1234
    };
    return payload;
}

export const DEFAULT_GRANTER_GET_CONFIG = {
    "announce_url": "https://localhost/hk4e/announcement/index.html",
    "disable_ysdk_guard": false,
    "enable_announce_pic_popup": true,
    "log_level": "INFO",
    "protocol": true,
    "push_alias_type": 2,
    "qr_enabled": false
}

export const DEFAULT_GRANTER_CMP_PROT_V = {
    "modified": true,
    "protocol": {
        "app_id": 4,
        "create_time": "0",
        "id": 0,
        "language": "ru",
        "major": 4,
        "minimum": 0,
        "priv_proto": "",
        "teenager_proto": "",
        "user_proto": ""
    }
}

export const DEFAULT_COMBO_COMBO = {
    "vals": {
        "disable_email_bind_skip": "false",
        "email_bind_remind": "true",
        "email_bind_remind_interval": "7"
    }
}