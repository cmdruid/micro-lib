export namespace Logger {

  export function prefix (label : string) {
    return {
      data  : (obj : object)    => console.dir(obj, { depth : null }),
      debug : (...args : any[]) => console.debug(label, ...args),
      error : (...args : any[]) => console.error(label, ...args),
      info  : (...args : any[]) => console.info(label, ...args),
      json  : (obj : object)    => console.dir(obj, { depth : null }),
      timer : (msg : string)    => timer(label, msg),
      warn  : (...args : any[]) => console.warn(label, ...args),
    }
  }

  export function timer (
    label : string,
    msg   : string
  ) {
    const str = `${label} ${msg}`
    return {
      start : () => console.time(str),
      end   : () => console.timeEnd(str),
    }
  }
}
