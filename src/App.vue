<template>
  <Menu>
    <router-link to="/">Inicio</router-link> 
    <router-link to="/area">Areas</router-link>
    <router-link to="/medico">Medicos</router-link>
    <router-link to="/paciente">Pacientes</router-link>
    <router-link to="/cita">Citas médicas</router-link>
  </Menu>
<router-view/>
</template>
<script>
import Menu from './components/Menu.vue'
export default {
  name:'App',
  data(){
    return {

    }
  },
  components:{
    Menu
  }
}  
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
