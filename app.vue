<template>
  <div>
    <NuxtPage />
    
    <!-- SVG Filters for hand-drawn effects -->
    <svg width="0" height="0" style="position: absolute;">
      <defs>
        <filter id="roughPaper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence baseFrequency="0.04" numOctaves="5" result="noise" seed="1"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
        </filter>
        <filter id="pencilTexture">
          <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise" seed="5"/>
          <feColorMatrix values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5"/>
          <feComposite in="SourceGraphic" in2="noise" operator="multiply"/>
        </filter>
      </defs>
    </svg>
  </div>
</template>