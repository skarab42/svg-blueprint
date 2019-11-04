const sbp = require("svg-blueprint");

const blueprint = new sbp.Blueprint({
  parentSelector: "main"
});

// blueprint.append('rect', { width: 300, height: 300 });
blueprint.center()
blueprint.fit();
