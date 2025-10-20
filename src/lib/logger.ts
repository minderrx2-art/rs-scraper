enum LOG_TYPE {
  INFO,
  WARN,
  ERROR,
  DEBUG
}

const log = (type: LOG_TYPE, message: string, ...args: any[]) => {
  const prefix = `[${type}]`
  console.log(`${prefix} ${message}`, ...args)
}

export const info = (message: string, ...args: any[]) => log(LOG_TYPE.INFO, message, args)
export const warn = (message: string, ...args: any[]) => log(LOG_TYPE.WARN, message, args)
export const error = (message: string, ...args: any[]) => log(LOG_TYPE.ERROR, message, args)
export const debug = (message: string, ...args: any[]) => log(LOG_TYPE.DEBUG, message, args)