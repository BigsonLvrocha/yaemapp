<template>
  <v-app id="app">
    <v-app-bar app>
      <v-toolbar-title>YAEMAPP</v-toolbar-title>
      <v-toolbar-items class="mx-3">
        <v-btn
          text
          to="/"
        >
          Home
        </v-btn>
        <v-btn
          text
          to="/historyAnalisys"
        >
          History Analisys
        </v-btn>
      </v-toolbar-items>
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
