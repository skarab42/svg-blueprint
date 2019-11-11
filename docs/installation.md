# Installation

## Install via Yarn

```bash
yarn add svg-blueprint
```

## Install via NPM

```bash
npm install svg-blueprint
```

## Install via UNPKG

```html
<script src="https://unpkg.com/svg-blueprint"></script>
<script>
  const blueprint = new svgBlueprint.Blueprint({
    parentSelector: "body",
    ...
  });
</script>
```

## Manual (Browserify version)

Download the [svg-blueprint.br.js](https://github.com/onlfait/svg-blueprint/tree/master/build/svg-blueprint.br.js) and copy the file to your project.

```html
<script src="./svg-blueprint.js"></script>
<script>
  const sbp = require("svg-blueprint");

  const blueprint = new sbp.Blueprint({
    parentSelector: "body",
    ...
  });
</script>
```
