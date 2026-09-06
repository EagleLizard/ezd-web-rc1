
import { Type, Static } from 'typebox';
import { tbUtil } from '../../util/tb-util';

const GcpKeyDtoBaseTSchema = Type.Object({
  namespace: Type.Optional(Type.String()),
  kind: Type.String(),
});
const GcpIdKeyDtoTSchema = Type.Object({
  ...GcpKeyDtoBaseTSchema.properties,
  id: Type.String(),
});
const GcpNameKeyDtoTSchema = Type.Object({
  ...GcpKeyDtoBaseTSchema.properties,
  name: Type.String(),
});
const GcpIdOrNameKeyDtoTSchema = Type.Union([
  GcpIdKeyDtoTSchema,
  GcpNameKeyDtoTSchema,
]);
const GcpKeyDtoTSchema = Type.Object({
  namespace: Type.Optional(Type.Union([ Type.Undefined(), Type.String() ])),
  name: Type.String(),
  kind: Type.String(),
});
export type GcpKeyDto = Static<typeof GcpKeyDtoTSchema>;

export const GcpKeyDto = {
  schema: GcpKeyDtoTSchema,
  decode: function decodeGcpKeyDto(rawVal: unknown): GcpKeyDto {
    /*
    todo: clean this up
      needed to normalize entities coming over the wire.
      Key id/name detection done on server side when making subsequent requests.
    _*/
    let idOrNameKeyDto = tbUtil.decodeWithSchema<typeof GcpIdOrNameKeyDtoTSchema>(GcpIdOrNameKeyDtoTSchema, rawVal);
    let gcpKeyDtoName = ('name' in idOrNameKeyDto)
      ? idOrNameKeyDto.name
      : idOrNameKeyDto.id
    ;
    let gcpKeyDto: GcpKeyDto = {
      namespace: idOrNameKeyDto.namespace,
      kind: idOrNameKeyDto.kind,
      name: gcpKeyDtoName,
    };
    return gcpKeyDto;
  },
} as const;
