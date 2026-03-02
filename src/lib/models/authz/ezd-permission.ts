
import { Type, Static } from 'typebox';
import { tbUtil } from '../../util/tb-util';
import { PermissionDtoSchema } from './permission-dto';

const EzdPermissionTSchema = Type.Object({
  id: PermissionDtoSchema.schema.properties.permission_id,
  name: PermissionDtoSchema.schema.properties.permission_name,
});
export type EzdPermission = Static<typeof EzdPermissionTSchema>;

/* PermissionRespSchema on server */
export const EzdPermission = {
  schema: EzdPermissionTSchema,
  decode: decodeEzdPermission,
} as const;

function decodeEzdPermission(rawVal: unknown): EzdPermission {
  return tbUtil.decodeWithSchema(EzdPermissionTSchema, rawVal);
}
