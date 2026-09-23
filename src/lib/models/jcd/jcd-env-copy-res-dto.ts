
import { Type, Static } from 'typebox';
import { tbUtil } from '../../util/tb-util';
import { GcpKeyDto } from './gcp-key-dto';

const JcdEnvCopyResDtoTSchema = Type.Object({
  ops: Type.Object({
    inserted: Type.Array(GcpKeyDto.schema),
    skipped: Type.Array(GcpKeyDto.schema),
  }),
});
export type JcdEnvCopyResDto = Static<typeof JcdEnvCopyResDtoTSchema>;
export const JcdEnvCopyResDto = {
  schema: JcdEnvCopyResDtoTSchema,
  decode: function decodeJcdEnvCopyResDto(val: unknown): JcdEnvCopyResDto {
    return tbUtil.decodeWithSchema<typeof JcdEnvCopyResDtoTSchema, JcdEnvCopyResDto>(JcdEnvCopyResDtoTSchema, val);
  }
} as const;
