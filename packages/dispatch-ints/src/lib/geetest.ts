import * as t from "io-ts";

export const GeetestGetData = t.intersection([t.type({
  gt: t.string,
  challenge: t.string,
  lang: t.string,
}), t.partial({
  is_next: t.boolean,
  client_type: t.string,
  w: t.string,
  pt: t.number,
  callback: t.string
})]);

export type GeetestGetData = t.TypeOf<typeof GeetestGetData>;

export const GeetestGetTypeData = t.intersection([t.type({
  gt: t.string,
  t: t.string
}), t.partial({
  callback: t.string
})]);

export type GeetestGetTypeData = t.TypeOf<typeof GeetestGetTypeData>; 

export const GeetestAjaxData = t.intersection([t.type({
  gt: t.string,
  challenge: t.string
}), t.partial({
  client_type: t.string,
  w: t.string,
  callback: t.string,
  $_BPF: t.number
})]);

export type GeetestAjaxData = t.TypeOf<typeof GeetestAjaxData>;

export type DispatchGeetestSvc = {
    get: (data: GeetestGetData) => string;
    getType: (data: GeetestGetTypeData) => string;
    ajaxGet: (data: GeetestAjaxData) => string;
    ajaxPost: (data: GeetestAjaxData) => string;
};