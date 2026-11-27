<template>
  <figure>
    <router-link to="/" class="logo-link">
      <span class="logo" id="logo" aria-label="c3Pixelflut"><span class="logo-c3">c3</span>Pixelflut</span>
    </router-link>
    <no-ssr>
      <pixel-grid class="grid"></pixel-grid>
    </no-ssr>
  </figure>
</template>

<script>
  import NoSSR from 'vue-no-ssr'

  export default {
    components: {
      'no-ssr': NoSSR
    }
  }
</script>

<style scoped>
*::selection {
  appearance: none;
}
figure {
  display: flex;
  justify-content: center;
  align-items: center;

  padding-top: 52px;
  padding-bottom: 24px;
  margin: 0;
}
.logo-link {
  text-decoration: none;
}
/* Wordmark in Jersey 10. On larger screens it is invisible and only reserves
   the space - the pixel grid draws it (see energyLogo in pixel-grid.vue).
   187.5px = one Jersey-10 font pixel per 10px grid cell. */
.logo {
  position: relative;
  z-index: 10;
  display: inline-block;

  margin: 0 12px;

  color: var(--color-neutral);
  font-family: var(--font-heading);
  font-size: 187.5px;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;

  cursor: pointer;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
.logo-c3 {
  color: var(--color-primary);
}
@media (max-width: 760px) {
  .logo {
    font-size: 24vw;
    margin: 0 auto;
  }
}
@media (max-width: 420px) {
  .logo {
    opacity: 1;
  }
}
</style>

<style>
.p5Canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}
</style>
