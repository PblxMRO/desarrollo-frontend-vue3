<template>
  <BContainer>
    <div class="s2 px-4 py-4 my-4 text-center">
          <h1 class="display-4 fw-bold">DESARROLLO FRONTEND CON VUE3</h1>
          <p class="lead mb-4">Sistema de gestión de citas médicas</p>
    </div>
  <BRow>
    <BCol cols="4">
      <BListGroup flush="true">
          <BListGroupItem class="s1 text-end display-6 fs-3">Desarrollado por:</BListGroupItem>
          <BListGroupItem class="s1 text-end display-6 fs-3">Objetivo:</BListGroupItem>
          <BListGroupItem class="s1 text-end display-6 fs-3">Descripción:</BListGroupItem>
        </BListGroup>
    </BCol>
      <BCol cols="8">
        <BListGroup >
          <BListGroupItem class="text-start display-6 fs-3">Ing. Juan Pablo Montesinos Reyes Ortiz</BListGroupItem>
          <BListGroupItem class="text-start display-6 fs-3">Desarrollo de un sistema web utilizando VUE3</BListGroupItem>
          <BListGroupItem class="text-start display-6 fs-3">Sistema para reserva de citas médicas con 4 entidades, CRUD para cada entidad, utilización de formularios, filtros y buscadores. </BListGroupItem>
          <BListGroupItem class="text-start display-6 fs-3">Backend realizado con Json-server.</BListGroupItem>
        </BListGroup>
    </BCol >
  </BRow>
</BContainer>
</template>

<script setup>
import { ref } from 'vue';
const show = ref(false);
</script>
<style scoped>
.s1 {
  background-color: #eff6ff;
  color: #1e40af;
}

.s2 {
  background-color: #e9ecef;
  color: #19488d;
}
</style>