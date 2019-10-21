import { templateFactory } from "../template";

export default templateFactory(`
<div data-key="blueprint" class="{{className}} {{className}}-{{uid}}" style="position: relative; width: {{width}}; height: {{height}}; overflow: hidden;">
  <svg data-key="canvas" class="{{className}}-canvas" style="width: 100%; height: 100%; min-width: 1000px; min-height: 1000px;">
    <defs>
      <pattern data-key="grid10" id="{{className}}-grid-pattern-10" width=".1" height=".1">
        <line x1="0" y1="0" x2="100%" y2="0" stroke="{{gridColor}}" stroke-width="1"></line>
        <line x1="0" y1="0" x2="0" y2="100%" stroke="{{gridColor}}" stroke-width="1"></line>
      </pattern>
      <pattern id="{{className}}-grid-pattern-100" width="1" height="1">
        <line x1="0" y1="0" x2="100%" y2="0" stroke="{{gridColor}}" stroke-width="2"></line>
        <line x1="0" y1="0" x2="0" y2="100%" stroke="{{gridColor}}" stroke-width="2"></line>
      </pattern>
      <pattern data-key="gridPattern" id="{{className}}-grid-pattern" patternUnits="userSpaceOnUse" width="100" height="100" x="0" y="0">
        <rect class="{{className}}-grid-10" width="100" height="100" fill="url(#{{className}}-grid-pattern-10)"></rect>
        <rect class="{{className}}-grid-100" width="100%" height="100%" fill="url(#{{className}}-grid-pattern-100)"></rect>
      </pattern>
    </defs>
    <rect data-key="background" class="{{className}}-background" width="100%" height="100%" fill="{{backgroundColor}}"></rect>
    <rect data-key="grid" class="{{className}}-grid" width="100%" height="100%" opacity="{{gridOpacity}}" fill="url(#{{className}}-grid-pattern)"></rect>
    <g data-key="axis" class="{{className}}-axis" transform="translate(0 0)" style="opacity: {{axisOpacity}};">
      <line x1="-10000%" y1="0" x2="10000%" y2="0" stroke="{{axisColor}}" stroke-width="2"></line>
      <line x1="0" y1="-10000%" x2="0" y2="10000%" stroke="{{axisColor}}" stroke-width="2"></line>
    </g>
    <g data-key="workspace" class="{{className}}-workspace" transform="translate(0 0) scale(1)"></g>
    <g data-key="cursor" class="{{className}}-cursor" transform="translate(0 0)" style="display: none; opacity: {{cursorOpacity}};">
      <line x1="-10000%" y1="0" x2="10000%" y2="0" stroke="{{cursorColor}}" stroke-width="2"></line>
      <line x1="0" y1="-10000%" x2="0" y2="10000%" stroke="{{cursorColor}}" stroke-width="2"></line>
    </g>
  </svg>
</div>
`);
