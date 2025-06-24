declare global {
  interface GlobalFlags {
    debug?   : boolean,
    verbose? : boolean
  }
}

/**
 * Create a logger with a given label and flags.
 * @param label - The label to use for the logger.
 * @param flags - The flags to use for the logger.
 * @returns The logger API.
 */
export function create_logger (
  label  : string,
  flags? : GlobalFlags
) {
  // Unpack the flags from the global scope.
  const { debug = false, verbose = true } = flags ?? {}
  // Create a prefixed string for consistent formatting
  const prefix = '[' + label.padEnd(10, ' ') + ']'
  // Create a no-op function for disabled loggers
  const noop = () => {}
  // Return the logger API.
  return {
    debug : debug ? console.debug.bind(console, prefix)  : noop,
    dump  : dump,
    error : console.error.bind(console, prefix),
    info  : verbose ? console.info.bind(console, prefix) : noop,
    log   : console.log.bind(console, prefix),
    json  : json,
    timer : (msg : string) => timer(label, msg),
    warn  : verbose ? console.warn.bind(console, prefix) : noop,
  }
}

/**
 * Dump an object to the console.
 * @param obj - The object to dump.
 * @returns A function that dumps the object to the console.
 */
function dump (obj : object) {
  return console.dir.bind(console, obj, { depth : null })
}

/**
 * Log a JSON object to the console.
 * @param obj - The object to log.
 * @returns A function that logs the object to the console.
 */
function json (obj : object) {
  return console.log.bind(console, JSON.stringify(obj, null, 2))
}

/**
 * Create a timer with a given label and message.
 * @param label - The label to use for the timer.
 * @param msg   - The message to use for the timer.
 * @returns A function that starts and stops the timer.
 */
function timer (
  label : string,
  msg   : string
) {
  // Create a string for the timer.
  const str = `${label} ${msg}`
  // Start the timer.
  console.time(str)
  // Return a function to stop the timer.
  return () => console.timeEnd(str)
}