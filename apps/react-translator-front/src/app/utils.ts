function omit <T extends Record<string, unknown>> ( obj: T, keyName = "" ): T {
  return Object.keys(obj).reduce((object: any, key: string) => {
    if (key !== keyName) {
      object[key] = obj[key];
    }
    return object
  }, {})
}

class uuid {
  static cache: Array<string> = [];

  static get (): string {
    let realUuid = "";
    while (realUuid.length === 0) {
      const tempUuid = uuid.generateUuid();
      if ( uuid.checkIfUuidAlreadyExist(tempUuid) )
        break;
      else
        realUuid = tempUuid;
    }
    uuid.cache.push(realUuid);
    return realUuid
  }

  static checkIfUuidAlreadyExist ( tempId: string ) {
    return uuid.cache.filter((v) => v === tempId).length > 0
  }
  static generateUuid (): string {
    let uuid = ""
    for (let i = 0; i < 16; i++) {
      const result = (i / 4) % i;
      if (result === 1 || result === 2 || result === 3 || result === 4) uuid += "-"
      uuid += Math.floor(Math.random() * 10) + ""
    }
    return uuid
  }
}


export { omit, uuid }
