/**
 * Simple string tag replacement.
 *
 * ex.: format("Hello {{name}}", { name: "World"}) // Hello World
 *
 * @param {string} string
 * @param {object} data
 *
 * @return {string}
 */
function format(string, data) {
  return string.replace(/(\{\{([^\}]+)\}\})/g, function(match, p1, p2) {
    return data[p2] || p1;
  });
}

/**
 * Get an HTML string and return a collection of DOM Element.
 *
 * Only elements with a [data-key] attribute will be returned.
 *
 * ex.: toElements('<div data-key="myElement">...</div>')
 * return: { myElement: Element }
 *
 * @param {string} string
 *
 * @return {object}
 */
function toElements(string) {
  const elements = {};

  const div = document.createElement("div");
  div.innerHTML = string.trim();

  div.querySelectorAll("[data-key]").forEach(element => {
    elements[element.getAttribute("data-key")] = element;
  });

  return elements;
}

/**
 * Get an HTML string and some data and return a collection of DOM Element.
 *
 * Only elements with a [data-key] attribute will be returned.
 *
 * ex.: template(
 *        '<div data-key="myElement">{{message}}</div>',
 *        { message: "Hello World"}
 *      )
 * return: { myElement: Element }
 *
 * @param {string}      string
 * @param {null|object} [data=null]
 *
 * @return {object}
 */
function template(string, data = null) {
  return toElements(data ? format(string, data) : string);
}

/**
 * Create and return a template function from an HTML string.
 *
 * ex.: const myTemplate = templateFactory('<div data-key="myElement">{{message}}</div>')
 *      myTemplate({ message: 'Hello World'}) // { myElement: Element }
 *
 * @param {string} string
 *
 * @return {Function}
 */
function templateFactory(string) {
  return function(data) {
    return template(string, data);
  };
}

export { format, toElements, template, templateFactory };
export default template;
