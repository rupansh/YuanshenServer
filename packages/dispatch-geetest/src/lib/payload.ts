export function geetestResp(callback: string, payload: string) {
    return `${callback}(${payload})`
}

export function geetestGetNextRsp(gt: string, challenge: string) {
    const payload = {
        gt,
        challenge,
        "id": "a7b56e21f6771ab10e2bc4a3a511c4be0", 
        "bg": "pictures/gt/1dce8a0cd/bg/744f986a0.jpg", 
        "fullbg": "pictures/gt/1dce8a0cd/1dce8a0cd.jpg", 
        "link": "",
        "ypos": 85,
        "xpos": 0,
        "height": 160,
        "slice": "pictures/gt/1dce8a0cd/slice/744f986a0.png", 
        "api_server": "https://api-na.geetest.com/",
        "static_servers": ["static.geetest.com/", "dn-staticdown.qbox.me/"],
        "mobile": true,
        "theme": "ant",
        "theme_version": "1.2.6",
        "template": "",
        "logo": false,
        "clean": false,
        "type": "multilink",
        "fullpage": false,
        "feedback": "",
        "show_delay": 250,
        "hide_delay": 800,
        "benchmark": false,
        "version": "6.0.9",
        "product": "embed",
        "https": true,
        "width": "100%",
        "c": [12, 58, 98, 36, 43, 95, 62, 15, 12],
        "s": "6b70592c",
        "so": 0,
        "i18n_labels": {
            "cancel": "Cancel",
            "close": "Close",
            "error": "Error. Close and retry.",
            "fail": "Incorrect position",
            "feedback": "Info",
            "forbidden": "Retry after 3 seconds",
            "loading": "Loading",
            "logo": "Geetest",
            "read_reversed": false,
            "refresh": "Refresh",
            "slide": "Slide to unlock",
            "success": "sec s. You're better than score% of users",
            "tip": "",
            "voice": "Voice test"
        },
        "gct_path": "/static/js/gct.d0a2919ae56f007ecb8e22fb47f80f33.js"
    }

    return JSON.stringify(payload); 
}

export const GEETEST_GET_RESP = {
    "status": "success",
    "data": {
        "theme": "wind",
        "theme_version": "1.5.8",
        "static_servers": ["static.geetest.com", "dn-staticdown.qbox.me"],
        "api_server": "api-na.geetest.com",
        "logo": false,
        "feedback": "",
        "c": [12, 58, 98, 36, 43, 95, 62, 15, 12],
        "s": "3f6b3542",
        "i18n_labels": {
            "copyright": "Geetest",
            "error": "Error",
            "error_content": "Retry",
            "error_title": "Timeout",
            "fullpage": "Confirm",
            "goto_cancel": "Cancel",
            "goto_confirm": "OK",
            "goto_homepage": "Go to Geetest homepage?",
            "loading_content": "Confirm",
            "next": "Loaging",
            "next_ready": "Not fulfilled",
            "read_reversed": false,
            "ready": "Click to confirm",
            "refresh_page": "Error. Refresh the page to continue.",
            "reset": "Retry",
            "success": "Success",
            "success_title": "Success"
        }
    }
}

export const GEETEST_GET_TYPE_RESP = {
    "status": "success",
    "data": {
        "type": "fullpage",
        "static_servers": ["static.geetest.com/", "dn-staticdown.qbox.me/"],
        "click": "/static/js/click.3.0.2.js",
        "pencil": "/static/js/pencil.1.0.3.js",
        "voice": "/static/js/voice.1.2.0.js",
        "fullpage": "/static/js/fullpage.9.0.8.js",
        "beeline": "/static/js/beeline.1.0.1.js",
        "slide": "/static/js/slide.7.8.6.js",
        "geetest": "/static/js/geetest.6.0.9.js",
        "aspect_radio": {
            "slide": 103, "click": 128, "voice": 128, "pencil": 128, "beeline": 50
        }
    }
}

export const GEETEST_AJAX_NEXT_RESP = {
    success: 1,
    message: "success",
    validate: "",
    score: "11"
};

export const GEETEST_AJAX_RESP = {
    status: "success",
    data: {
        "result": "slide"
    }
};