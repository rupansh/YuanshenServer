import { geetestGetNextRsp, GEETEST_AJAX_NEXT_RESP, GEETEST_AJAX_RESP, GEETEST_GET_RESP, GEETEST_GET_TYPE_RESP } from "./payload"
import { geetestHandler } from "./utils";

export type GeetestGetData = {
  gt: string,
  challenge: string,
  lang: string,
  is_next?: boolean,
  w?: string,
  pt?: number,
  callback?: string
};

export type GeetestGetTypeData = {
  gt: string,
  t: string,
  callback?: string
};

export type GeetestAjaxData = {
  gt: string,
  challenge: string,
  client_type?: string,
  w?: string,
  callback?: string,
  $_BPF?: number
}

export function dispatchGeetestHandlers() {
  const geetestAjax = geetestHandler((data: GeetestAjaxData) => {
    if (data.$_BPF) return JSON.stringify(GEETEST_AJAX_NEXT_RESP);

    return JSON.stringify(GEETEST_AJAX_RESP);
  });

  return {
    get: geetestHandler((data: GeetestGetData) => {
      if (data.is_next) return geetestGetNextRsp(data.gt, data.challenge)

      return JSON.stringify(GEETEST_GET_RESP);
    }),
    getType: geetestHandler<GeetestGetTypeData>(() => JSON.stringify(GEETEST_GET_TYPE_RESP)),
    ajaxGet: geetestAjax,
    ajaxPost: geetestAjax
  }
}