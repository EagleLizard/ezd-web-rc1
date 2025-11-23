
import { Type, Static } from '@sinclair/typebox';
import { tbUtil } from '../util/tb-util';

/*
  Should match the backend server schema
_*/
const UserInfoTSchema = Type.Object({
  user_id: Type.Integer(),
  user_name: Type.String(),
  email: Type.String(),

  created_at: Type.String(),
  modified_at: Type.String(),
});

export type UserInfo = Static<typeof UserInfoTSchema>;

export const UserInfoSchema = {
  schema: UserInfoTSchema,

  decode: decodeUserInfo,
} as const;

function decodeUserInfo(rawVal: unknown): UserInfo {
  return tbUtil.decodeWithSchema(UserInfoTSchema, rawVal);
}
