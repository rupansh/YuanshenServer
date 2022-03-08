import { DispatchGeetestSvc } from "@ysparadox/dispatch-ints";
import { geetestGetNextRsp, GEETEST_AJAX_NEXT_RESP, GEETEST_AJAX_RESP, GEETEST_GET_RESP, GEETEST_GET_TYPE_RESP } from "./payload"
import { geetestHandler } from "./utils";

export function dispatchGeetestHandlers(): DispatchGeetestSvc {
  const geetestAjax: DispatchGeetestSvc['ajaxGet'] = geetestHandler((data) => {
    if (data.$_BPF) return JSON.stringify(GEETEST_AJAX_NEXT_RESP);

    return JSON.stringify(GEETEST_AJAX_RESP);
  });

  return {
    get: geetestHandler((data) => {
      if (data.is_next) return geetestGetNextRsp(data.gt, data.challenge)

      return JSON.stringify(GEETEST_GET_RESP);
    }),
    getType: geetestHandler(() => JSON.stringify(GEETEST_GET_TYPE_RESP)),
    ajaxGet: geetestAjax,
    ajaxPost: geetestAjax
  }
}