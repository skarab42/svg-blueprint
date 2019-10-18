const Blueprint = require('./Blueprint');

const blueprint = new Blueprint({
  parentSelector: 'main'
});

blueprint.append('rect', {
  width: 100,
  height: 100
});

blueprint.append('rect', {
  x: -150,
  y: -150,
  width: 500,
  height: 150
});

blueprint.append('<circle r="100" />');

blueprint.fitView();
