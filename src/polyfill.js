if (!Math.sign) {
  Math.sign = function sign(x) {
    return (x > 0) - (x < 0) || +x;
  };
}

if (NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

if (!Object.entries) {
  Object.entries = function entries(object) {
    const keys = Object.keys(object);
    let i = keys.length;
    const array = [];

    while (i--) {
      array[i] = [keys[i], object[keys[i]]];
    }

    return array;
  };
}
