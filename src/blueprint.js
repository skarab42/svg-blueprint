import settings from "./settings";

// Unique ID; Incremented each time a Blueprint class is instanciated.
let uid = 0;

/**
 * Blueprint class.
 */
class Blueprint {
  /**
   * Blueprint constructor.
   *
   * @param {object} [options={}]
   */
  constructor(options = {}) {
    /** @type {int} Unique ID. */
    this.uid = uid++;

    /** @type {object} Local settings. */
    this.settings = { ...settings, ...options };
  }
}

export default Blueprint;
