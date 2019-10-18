const ucwords = require('./ucwords');

module.exports = function camelize (str, pascalCase = false) {
  str = ucwords(str.replace(/-/g, ' ')).replace(/ /g, '');
  return pascalCase ? str : str.charAt(0).toLowerCase() + str.slice(1);
}
