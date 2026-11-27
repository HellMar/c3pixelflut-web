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
  gap: 4px;

  border: 2px solid var(--accent);
  border-radius: var(--border-radius);
  background-color: var(--background);
  box-shadow: var(--box-shadow);
}
@media (max-width: 920px) {
  nav {
    border-left: 0;
    border-right: 0;
  }
}
a {
  padding: 2px 10px;

  color: var(--foreground);
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 400;
  letter-spacing: 0.025em;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
}
a:hover {
  color: var(--hover);
}
a.router-link-active {
  color: var(--color-dark);
  background-color: var(--accent);
}
a.router-link-active:hover {
  color: var(--color-dark);
  background-color: var(--hover);
}
a:focus-visible {
  outline: 2px solid var(--hover);
  outline-offset: 2px;
}
</style>
