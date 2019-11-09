/**
 * Defaults settings.
 *
 * @type {object}
 */
const settings = {
  width: "400px",
  height: "300px",
  parentElement: null,
  parentSelector: "body",
  className: "svg-blueprint",
  backgroundColor: "#3177C6",
  gridColor: "#fff",
  gridOpacity: 0.3,
  cursorColor: "#0b64c4",
  cursorOpacity: 1,
  axisColor: "#f4b916",
  axisOpacity: 0.5,
  nonScalingStroke: true,
  strokeWidth: 2,
  zoomFactor: 0.05,
  zoomDirection: 1,
  zoomLimit: { min: 0.0001, max: 10000 },
  fitPadding: 42,
  stroke: "#fff",
  fill: "none",
  statusbarStyle: {
    left: "5px",
    bottom: "5px",
    padding: "5px",
    color: "#222",
    "background-color": "#fff",
    "border-radius": "5px",
    "font-family": "monospace",
    "text-transform": "uppercase"
  }
};

export default settings;
