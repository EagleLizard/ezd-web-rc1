
export const ezdErrorCodes = {
  DEFAULT: 'EZDW_0.0',
  schema_decode: 'EZDW_0.1',
  fetch_client_invalid_body_param: 'EZDW_0.2',
  INVALID_INPUT: 'EZDW_1.0',
  INVALID_EMAIL: 'EZDW_1.1',
  INVALID_USERNAME: 'EZDW_1.2',
  INVALID_PASSWORD: 'EZDW_1.3',

  response_error: 'EZDW_2.0',
  invalid_response_type: 'EZDW_2.1',
} as const;

export type EzdErrorCode = typeof ezdErrorCodes[keyof typeof ezdErrorCodes];
