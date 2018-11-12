<template>
  <div id="mainframe">
    <NavHeader/>
    <MapLayer/>
  </div>
</template>

<script>
import NavHeader from './NavHeader'
import MapLayer from './MapLayer'

export default {
  name: 'MainFrame',
  components: {
    NavHeader,
    MapLayer
  }
}
</script>

<style scoped>

</style>


