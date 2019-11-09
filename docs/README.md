# Quick start

- Create a new folder.
- Download the [svg-blueprint.js](https://github.com/onlfait/svg-blueprint/tree/master/dist/svg-blueprint.js).
- Create the index.html file below.
- Done !

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  </head>
  <body>
    <main></main>
    <script src="./svg-blueprint.js"></script>
    <script>
      const sbp = require("svg-blueprint");

      // create the blueprint
      const blueprint = new sbp.Blueprint({ parentSelector: "main" });

      // add simple shape
      blueprint.append("rect", { x: -40, y: -40, width: 80, height: 80 });

      // fit to view
      blueprint.fit();
    </script>
  </body>
</html>
```

# Installation

## Install via Yarn

```bash
yarn add svg-blueprint
```

## Install via NPM

```bash
npm install svg-blueprint
```

## Manual install

Download one of the `svg-blueprint[.tiny].js` file from the [./dist](https://github.com/onlfait/svg-blueprint/tree/master/dist) folder and copy the file to your project.

Next call the lib from your HTML file.

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

# Settings

| Name             | Type    | Default                     | Description                                                      |
| ---------------- | ------- | --------------------------- | ---------------------------------------------------------------- |
| width            | string  | "400px"                     | Blueprint width with unit (px, %).                               |
| height           | string  | "300px"                     | Blueprint height with unit (px, %).                              |
| parentElement    | Element | null                        | Parent DOM Element reference.                                    |
| parentSelector   | string  | "body"                      | Parent element selector, ignored if `parentElement` is not NULL. |
| className        | string  | "svg-blueprint"             | Blueprint wrapper class name.                                    |
| backgroundColor  | string  | "#3177C6"                   | Background color.                                                |
| gridColor        | string  | "#fff"                      | Grid lines color.                                                |
| gridOpacity      | float   | 0.3                         | Grid lines opacity.                                              |
| cursorColor      | string  | "#0b64c4"                   | Cursor lines color.                                              |
| cursorOpacity    | float   | 1                           | Cursor lines opacity.                                            |
| axisColor        | string  | "#f4b916"                   | Axis lines color.                                                |
| axisOpacity      | float   | 0.5                         | Axis lines opacity.                                              |
| zoomFactor       | float   | 0.05                        | Zoom factor.                                                     |
| zoomDirection    | uint    | 1                           | Zoom direction [ 1, -1 ].                                        |
| zoomLimit        | object  | { min: 0.0001, max: 10000 } | Zoom ratio limit.                                                |
| fitPadding       | int     | 42                          | Fit to view padding.                                             |
| nonScalingStroke | bool    | true                        | Emulate the `vector-effect: non-scaling-stroke`.                 |
| strokeWidth      | int     | 2                           | Workspace objects stroke width.                                  |
| stroke           | string  | "#fff"                      | Workspace objects stroke color.                                  |
| fill             | string  | "none"                      | Workspace objects fill color.                                    |
| statusbarStyle   | object  | (see below)                 | Statusbar CSS style                                              |

## statusbarStyle

| Name             | Type   | Default      |
| ---------------- | ------ | ------------ |
| left             | string | "5px",       |
| bottom           | string | "5px",       |
| padding          | string | "5px",       |
| color            | string | "#222",      |
| background-color | string | "#fff",      |
| border-radius    | string | "5px",       |
| font-family      | string | "monospace", |
| text-transform   | string | "uppercase"  |

# Methods

```js
const b = new sbp.Blueprint();

b.move({ x: 10, y: 10 });
b.pan({ x: 10, y: 10 });
b.zoom({ ratio: 0.5 });

b.show("cursor");
b.hide("grid");

b.center();
b.fit();

b.redraw();

b.getWorkspaceCenter();
b.getRelativePosition({ x: 10, y: 10 });

b.append("rect", { width: 80, height: 80 });
b.createElement("rect", { width: 80, height: 80 });
```
