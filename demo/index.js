const sbp = require("svg-blueprint");

const blueprint = new sbp.Blueprint({
  parentSelector: "main"
});

blueprint.move({ x: 100, y: 100 });
blueprint.pan({ x: 42, y: 42 });

// blueprint.hide("axis grid");
// blueprint.show("axis");

blueprint.hide(["axis", "grid"]);
blueprint.hide(["axis"], false);
blueprint.show("grid");

blueprint.zoom(2.8);

console.log('blueprint:', blueprint);
console.log('module:', sbp);
