## Blueprint

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

const rect1 = b.append("rect", { width: 80, height: 80 });
const rect2 = b.createElement("rect", { width: 80, height: 80 });

b.remove(rect1);
```

### move

Move the workspace at position.

```js
// assuming start position = [0,0]
b.move({ x: 10, y: 10 }); // move at [10,10]
b.move([10, 10]);         // move at [10,10]
b.move({ y: 50 });        // move at [10,50]
```

### pan

Pan the workspace by offsets.

```js
// assuming start position = [0,0]
b.pan({ x: 10, y: 10 }); // move at [10,10]
b.pan([10, 10]);         // move at [20,20]
b.pan({ y: 50 });        // move at [20,70]
```

### zoom

Zoom in/out the workspace.

- Zoom factor can be set via the global `zoomFactor` settings.

```js
// assuming zoom ratio = 1 and zoomFactor = 0.05
b.zoom(2);             // zoom ratio = 2
b.zoom({ ratio: 2 });  // zoom ratio = 2
b.zoom({ delta: 10 }); // zoom ratio = 3
b.zoom({ delta: 10 }); // zoom ratio = 4.5
```

- Optionally, you can specify a target point (by default it is the center of the workspace).

```js
b.zoom({ ratio: 1, target: [50, 50] });
```

### show
### hide

Show/Hide blueprint elements [grid, axis, cursor, background, statusbar, workspace].

```js
b.hide("grid"); // hide the grid (wow!)
b.show("grid"); // show the grid (amazing!)

b.hide("grid axis"); // hide both grid and axis
b.show("grid axis"); // show both grid and axis

b.hide("grid", false); // show the grid
b.show("grid", false); // hide the grid
```

### center

Center the view at [0,0]

```js
b.center();
```

### fit

Fit the view to see all drawings.

- The padding can be set via the global `fitPadding` settings.

```js
b.fit();
```

### createElement

Create and return an SVG element with default properties.

- Remove "stroke-width" attribute.
- Remove "stroke-width, stroke, fill" css properties.
- Set default "stroke" and "fill" attributes from settings.
- "stroke-width, stroke, fill" can be overwritten by `attribute` parameter.

```js
const rect = b.createElement("rect", { width: 80, height: 80 });
```

### append

Create and append to the workspace an SVG element with default properties.

- See `createElement`.

```js
b.append("rect", { width: 80, height: 80 });
```

### remove

Remove an element from the workspace.

```js
const rect = b.append("rect", { width: 80, height: 80 });

b.remove(rect);
```

### redraw

Redraw the blueprint.

```js
b.redraw();
```

### getWorkspaceCenter

Return the workspace center point.

```js
b.getWorkspaceCenter(); // { x: 150, y: 100 }
```

### getRelativePosition

Return the relative position at current scale.

```js
// scale ratio = 1
b.getRelativePosition({ x: 10, y: 10 }); // { x: 10, y: 10 }
// scale ratio = 2
b.getRelativePosition({ x: 10, y: 10 }); // { x: 5, y: 5 }
```
