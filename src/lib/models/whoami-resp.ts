
import { Type, Static } from '@sinclair/typebox';
import { tbUtil } from '../util/tb-util';
import { UserInfoSchema } from './user-info';

const WhoamiRespTSchema = Type.Object({
  user: Type.Object({
    ...UserInfoSchema.schema.properties,
  }),
});

export type WhoamiResp = Static<typeof WhoamiRespTSchema>;

export const whoamiRespSchema = {
  decode: decodeWhoamiResp,
};

function decodeWhoamiResp(val: unknown): WhoamiResp {
  return tbUtil.decodeWithSchema(WhoamiRespTSchema, val);
}
