
import { Type, Static } from 'typebox';

import { tbUtil } from '../../util/tb-util';
import { UserRoleDtoSchema } from './user-role-dto';
import { EzdPermission } from './ezd-permission';

const EzdRoleTSchema = Type.Object({
  id: UserRoleDtoSchema.schema.properties.role_id,
  name: UserRoleDtoSchema.schema.properties.role_name,
  permissions: Type.Optional(Type.Array(EzdPermission.schema)),
});
export type EzdRole = Static<typeof EzdRoleTSchema>;

export const EzdRole = {
  schema: EzdRoleTSchema,
  decode: decodeEzdRole
} as const;

function decodeEzdRole(rawVal: unknown): EzdRole {
  return tbUtil.decodeWithSchema(EzdRoleTSchema, rawVal);
}
