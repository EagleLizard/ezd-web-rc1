
/*
Input validation is done on the frontend for UX only.
  Validation functions should reflect their backend counterparts.
_*/

const password_min_len = 10;

export const inputFormats = {
  checkEmailAddress: checkEmailAddress,
  checkUsername: checkUsername,
  checkPassword: checkPassword,
} as const;

function checkEmailAddress(emailAddr: string): boolean {
  let atSignIdx: number;
  let localPart: string;
  let localRx: RegExp;
  let domainPart: string;
  let domainRx: RegExp;
  if((atSignIdx = emailAddr.lastIndexOf('@')) === -1) {
    return false;
  }
  localPart = emailAddr.substring(0, atSignIdx);
  localRx = /\S+/i;
  if(!localRx.test(localPart)) {
    return false;
  }
  domainPart = emailAddr.substring(atSignIdx + 1);
  domainRx = /^\S+\.\S+$/;
  if(!domainRx.test(domainPart)) {
    return false;
  }
  return true;
}

function checkUsername(userName: string): boolean {
  let userNameRx = /^[a-zA-Z][a-zA-Z0-9_]{2,}$/;
  return userNameRx.test(userName);
}

/*
Current frontend validation is opaque, heavier validation to be performed
  on the server.
_*/
function checkPassword(password: string): boolean {
  if(password.length < password_min_len) {
    return false;
  }
  return true;
}
