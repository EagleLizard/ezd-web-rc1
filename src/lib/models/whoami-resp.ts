
import { Type, Static } from '@sinclair/typebox';
import { tbUtil } from '../util/tb-util';

const WhoamiRespTSchema = Type.Object({
  user: Type.Object({
    email: Type.String(),
    username: Type.String(),
  }),
});

export type WhoamiResp = Static<typeof WhoamiRespTSchema>;

export const whoamiRespSchema = {
  decode: decodeWhoamiResp,
};

function decodeWhoamiResp(val: unknown): WhoamiResp {
  return tbUtil.decodeWithSchema(WhoamiRespTSchema, val);
}
