export interface LoggerConfig {
  debug   : boolean
  width   : number
  silent  : boolean
  verbose : boolean
}

const DEFAULT_CONFIG : LoggerConfig = {
  debug   : false,
  width   : 6,
  silent  : false,
  verbose : true,
}

export namespace Logger {
  export const init  = init_logger
  export const dump  = dump_obj
  export const json  = print_json
  export const timer = start_timer
}

/**
 * Create a logger with a given label and flags.
 * @param label   - The label to use for the logger.
 * @param options - The options to use for the logger.
 * @returns The logger API.
 */
function init_logger (options? : Partial<LoggerConfig>) {
  // Unpack the flags from the global scope.
  const config = { ...DEFAULT_CONFIG, ...options }
  return (label : string) => {
    // Create a prefixed string for consistent formatting
    const prefix = `[ ${label} ]`.padEnd(config.width, ' ')
    // Create a no-op function for disabled loggers
    const noop = () => {}
    // Return the logger API.
    return {
      debug : config.debug   ? console.debug.bind(console, prefix) : noop,
      dump  : config.debug   ? dump_obj : noop,
      error : !config.silent ? console.error.bind(console, prefix) : noop,
      log   : !config.silent ? console.log.bind(console, prefix)   : noop,
      warn  : !config.silent ? console.warn.bind(console, prefix)  : noop,
      json  : config.verbose ? print_json : noop,
      info  : config.verbose ? console.info.bind(console, prefix)  : noop,
      timer : config.verbose ? (msg : string) => start_timer(msg, prefix) : noop,
    }
  }
}

/**
 * Dump an object to the console.
 * @param obj - The object to dump.
 * @returns A function that dumps the object to the console.
 */
function dump_obj (obj : object) {
  return console.dir.bind(console, obj, { depth : null })
}

/**
 * Log a JSON object to the console.
 * @param obj - The object to log.
 * @returns A function that logs the object to the console.
 */
function print_json (obj : object) {
  return console.log.bind(console, JSON.stringify(obj, null, 2))
}

/**
 * Create a timer with a given label and message.
 * @param label - The label to use for the timer.
 * @param msg   - The message to use for the timer.
 * @returns A function that starts and stops the timer.
 */
function start_timer (
  msg     : string,
  prefix? : string
) {
  if (prefix) msg = `${prefix} ${msg}`
  console.time(msg)
  // Return a function to stop the timer.
  return () => console.timeEnd(msg)
}
