
import { jcdService } from '../../../service/jcd-service';
import type { GcpNamespace } from './gcd-namespace';

export class JcdEnv {
  /*
    key is either:
      - The GCP namespace name
      - The GCP namespace ID
        - For now, when the namespace is the [default] namespace
  _*/
  readonly key: string;
  readonly name: string;
  readonly isDefault: boolean;

  // private readonly _gcpNamespace: GcpNamespace;

  private constructor(key: string, name: string) {
    this.key = key;
    this.name = name;
    this.isDefault = this.key === jcdService.default_env_id;
  }

  static fromGcpNamespace(gcpNamespace: GcpNamespace): JcdEnv {
    let key = (gcpNamespace.id === jcdService.default_env_id)
      ? gcpNamespace.id
      : gcpNamespace.name
    ;
    let jcdEnv = new JcdEnv(key, gcpNamespace.name);
    return jcdEnv;
  }
}
