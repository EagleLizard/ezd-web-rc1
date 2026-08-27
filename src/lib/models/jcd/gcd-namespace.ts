
import { Type, Static } from 'typebox';
import { tbUtil } from '../../util/tb-util';

const GcpNamespaceTSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
});
export type GcpNamespace = Static<typeof GcpNamespaceTSchema>;
export const GcpNamespace = {
  schema: GcpNamespaceTSchema,
  decode: (rawVal: unknown): GcpNamespace => tbUtil.decodeWithSchema(GcpNamespaceTSchema, rawVal),
} as const;

