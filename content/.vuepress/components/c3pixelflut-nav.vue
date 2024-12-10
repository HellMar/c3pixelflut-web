<template>
  <section>
    <nav>
      <router-link to="/index" class="nav-link">Start</router-link>
      <router-link to="/how" class="nav-link">Wie geht das?</router-link>
      <router-link to="/where" class="nav-link">Wo?</router-link>
      <router-link to="/faq" class="nav-link">F.A.Q.</router-link>
    </nav>
  </section>
</template>

// @ToDo: rainbow colors, responsive side margin

<style scoped>
section {
  position: sticky;
  top: 0;
  z-index: 20;
}
nav {
  min-height: 38px;
  max-width: 920px;

  padding: 8px 0;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;

  border-radius: var(--border-radius);
  background-color: var(--background);
  box-shadow: 0 4px 12px var(--shadow);
}
@media (max-width: 920px) {
  nav {
    border-radius: 0;
  }
}
a {
  padding: 2px 4px;

  color: var(--foreground);
  font-size: 18px;
  font-weight: 400;
  text-align: center;
  text-decoration: none;
}
</style>
