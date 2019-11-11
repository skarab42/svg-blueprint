# Settings

| Name               | Type    | Default                     | Description                                                      |
| ------------------ | ------- | --------------------------- | ---------------------------------------------------------------- |
| `width`            | string  | "400px"                     | Blueprint width with unit (px, %).                               |
| `height`           | string  | "300px"                     | Blueprint height with unit (px, %).                              |
| `parentElement`    | Element | null                        | Parent DOM Element reference.                                    |
| `parentSelector`   | string  | "body"                      | Parent element selector, ignored if `parentElement` is not NULL. |
| `className`        | string  | "svg-blueprint"             | Blueprint wrapper class name.                                    |
| `backgroundColor`  | string  | "#3177C6"                   | Background color.                                                |
| `gridColor`        | string  | "#fff"                      | Grid lines color.                                                |
| `gridOpacity`      | float   | 0.3                         | Grid lines opacity.                                              |
| `cursorColor`      | string  | "#0b64c4"                   | Cursor lines color.                                              |
| `cursorOpacity`    | float   | 1                           | Cursor lines opacity.                                            |
| `axisColor`        | string  | "#f4b916"                   | Axis lines color.                                                |
| `axisOpacity`      | float   | 0.5                         | Axis lines opacity.                                              |
| `zoomFactor`       | float   | 0.05                        | Zoom factor.                                                     |
| `zoomDirection`    | uint    | 1                           | Zoom direction [ 1, -1 ].                                        |
| `zoomLimit`        | object  | { min: 0.0001, max: 10000 } | Zoom ratio limit.                                                |
| `fitPadding`       | int     | 42                          | Fit to view padding.                                             |
| `nonScalingStroke` | bool    | true                        | Emulate `vector-effect: non-scaling-stroke`.                     |
| `strokeWidth`      | int     | 2                           | Workspace objects stroke width.                                  |
| `stroke`           | string  | "#fff"                      | Workspace objects stroke color.                                  |
| `fill`             | string  | "none"                      | Workspace objects fill color.                                    |
| `statusbarStyle`   | object  | (see below)                 | Statusbar CSS style                                              |

## Statusbar

| Name               | Type   | Default      |
| ------------------ | ------ | ------------ |
| `left`             | string | "5px",       |
| `bottom`           | string | "5px",       |
| `padding`          | string | "5px",       |
| `color`            | string | "#222",      |
| `background-color` | string | "#fff",      |
| `border-radius`    | string | "5px",       |
| `font-family`      | string | "monospace", |
| `text-transform`   | string | "uppercase"  |

## Defaults

Defaults settings are accessible and modifiable via the `settings` property of the main object.

```js
const sbp = require("svg-blueprint");

sbp.settings.axisColor = "red"; // set the axis color for all Blueprint instances
```
