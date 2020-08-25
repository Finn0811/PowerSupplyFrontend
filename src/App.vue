<template>
  <div id="app">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <strong>PowerSupplyLogger</strong>
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          Messwerte
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/power-supplies' }">
          Stromversorgungen
        </b-navbar-item>
      </template>
    </b-navbar>

    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
</style>
