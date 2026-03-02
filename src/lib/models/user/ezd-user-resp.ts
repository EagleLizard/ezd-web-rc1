
import { Type, Static } from 'typebox';
import { tbUtil } from '../../util/tb-util';
import { UserInfoSchema } from '../user-info';
import { EzdRole } from '../authz/ezd-role';
import { EzdPermission } from '../authz/ezd-permission';

const EzdUserRespTSchema = Type.Object({
  user: UserInfoSchema.schema,
  roles: Type.Optional(Type.Array(EzdRole.schema)),
  permissions: Type.Optional(Type.Array(EzdPermission.schema))
});
export type EzdUserResp = Static<typeof EzdUserRespTSchema>;
export const EzdUserResp = {
  schema: EzdUserRespTSchema,
  decode: decodeEzdUserResp,
} as const;

function decodeEzdUserResp(rawVal: unknown): EzdUserResp {
  return tbUtil.decodeWithSchema(EzdUserRespTSchema, rawVal);
}
