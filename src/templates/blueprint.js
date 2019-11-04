import { templateFactory } from "../template";

export default templateFactory(`
<div data-key="blueprint" class="{{className}} {{className}}-{{uid}}" style="width: {{width}}; height: {{height}};">

  <svg class="{{className}}-grid" style="width: 100%; height: 100%; overflow: hidden;">
    <defs>
      <pattern id="gridPattern10" width="0.1" height="0.1">
        <path data-key="gridPattern10" d="M 10 0 L 0 0 0 10" fill="none" stroke="{{gridColor}}" stroke-width="0.1" />
      </pattern>
      <pattern id="gridPattern100" width="1" height="1">
        <path data-key="gridPattern100" d="M 100 0 L 0 0 0 100" fill="none" stroke="{{gridColor}}" stroke-width="1" />
      </pattern>
      <pattern data-key="gridPattern" id="gridPattern" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect data-key="gridFill10" fill="url(#gridPattern10)" width="100" height="100" />
        <rect data-key="gridFill100" fill="url(#gridPattern100)" width="100" height="100" opacity="{{gridOpacity}}" />
      </pattern>
    </defs>
    <rect data-key="background" class="{{className}}-background" width="100%" height="100%" fill="{{backgroundColor}}" />
    <rect data-key="grid" class="{{className}}-grid" width="100%" height="100%" fill="url(#gridPattern)" />
    <g data-key="axis" class="{{className}}-axis" style="opacity: {{axisOpacity}};">
      <line data-key="axisX" x1="0" y1="0" x2="100%" y2="0" stroke="{{axisColor}}" stroke-width="1" transform="translate(0 0)" />
      <line data-key="axisY" x1="0" y1="0" x2="0" y2="100%" stroke="{{axisColor}}" stroke-width="1" transform="translate(0 0)" />
    </g>
    <g data-key="cursor" class="{{className}}-cursor" style="opacity: {{cursorOpacity}}; display: none;">
      <line data-key="cursorX" x1="0" y1="0" x2="100%" y2="0" stroke="{{cursorColor}}" stroke-width="1" transform="translate(0 0)" />
      <line data-key="cursorY" x1="0" y1="0" x2="0" y2="100%" stroke="{{cursorColor}}" stroke-width="1" transform="translate(0 0)" />
    </g>

    <g data-key="workspace" class="{{className}}-workspace">
      <rect x="10" y="10" width="100" height="100" fill="none" stroke="#fff" stroke-width="2" vector-effect="non-scaling-stroke" />
      <circle cx="10" cy="10" r="100" fill="none" stroke="#fff" stroke-width="2" vector-effect="non-scaling-stroke" />
    </g>
  </svg>

</div>
`);
