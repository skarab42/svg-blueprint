const sbp = require("svg-blueprint");

const blueprint = new sbp.Blueprint({
  parentSelector: "main"
});

console.log('blueprint:', blueprint);
console.log('module:', sbp);

// blueprint.pan({ x: 5, y: 5 });
// blueprint.move({ x: 15, y: 15 });
// blueprint.pan({ x: 5, y: 5 });
//
// blueprint.zoom({ delta: 2, target: { x: 20, y: 20 } });

// blueprint.append("rect", {
//   width: 100,
//   height: 100
// });

// blueprint.center();
// blueprint.fit();
//
// blueprint.set({ fitPadding: 10 });
//
// blueprint.hide("grid");
// blueprint.show("grid");
// blueprint.hide("axis");

// blueprint.setCursor({ x: 10, y: 20 });
// blueprint.show("cursor");

//blueprint.fit();
