# Usages

## ES6 Import

```js
import sbp from "svg-blueprint";

const blueprint = new sbp.Blueprint({
  parentSelector: "body",
  ...
});
```

## Require

```js
const sbp = require("svg-blueprint");

const blueprint = new sbp.Blueprint({
  parentSelector: "body",
  ...
});
```

## UMD

```html
<script src="https://unpkg.com/svg-blueprint"></script>
<script>
  const blueprint = new svgBlueprint.Blueprint({
    parentSelector: "body",
    ...
  });
</script>
```
