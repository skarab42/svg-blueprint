# Quick start

- Create the index.html file below.
- Done !

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1" />
  </head>
  <body>
    <main></main>
    <script src="https://unpkg.com/svg-blueprint"></script>
    <script>
      // create the blueprint
      const blueprint = new svgBlueprint.Blueprint({ parentSelector: "main" });

      // add simple shape
      blueprint.append("rect", { x: -40, y: -40, width: 80, height: 80 });

      // fit to view
      blueprint.fit();
    </script>
  </body>
</html>
```
