import * as t from "io-ts";

export const ActionToCheck = t.intersection([t.type({
    action_type: t.string,
    api_name: t.string,
}), t.partial({
    username: t.string
})]);

export type ActionToCheck = t.TypeOf<typeof ActionToCheck>;

export type DispatchRiskySvc = {
    check: (data: ActionToCheck) => string;
};