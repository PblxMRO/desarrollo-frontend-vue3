<template>
    <div class="container">
      <h4>Editar Cita</h4>
      <div class="form-group">
          <label for="paciente">Paciente:</label>
          <input type="text" v-model="nombrePaciente" readonly style="background-color: powderblue;">
      </div>

       <form @submit.prevent="submitForm" v-if="form">
       
         <div class="form-group">
            <label for="area">Area:</label>
            <select id="areaId" v-model="form.areaId" :class="{ 'is-invalid': errors.areaId }" @change="setMedicos()">
               <option :value="area.id" v-for="(area, index) in areasList" :key="`area-${index}`">{{ area.nombre }}</option>
            </select>
            <div v-if="errors.areaId" class="invalid-feedback">{{ errors.areaId }}</div>
        </div> 

       <div class="form-group">
            <label for="medico">Médico:</label>
            <select id="medico" v-model="form.medicoId" :class="{ 'is-invalid': errors.medico }">
              <option :value="medico.id" v-for="(medico, index) in medicosList" :key="`medico-${index}`"><span v-if="medico.sexo === 'M'">Dr. </span><span v-else>Dra. </span> {{ medico.nombres }} {{ medico.apellidos }} </option>
            </select>
            <div v-if="errors.medico" class="invalid-feedback">{{ errors.medico }}</div>
        </div> 


        <div class="input_container">
          <div class="form-group input_div">
            <label for="fecha">Fecha:</label>
            <input type="date" id="fecha" v-model="form.fecha" :class="{ 'is-invalid': errors.fecha }" placeholder="Ingrese la fecha" />
            <div v-if="errors.fecha" class="invalid-feedback">{{ errors.fecha }}</div>            
          </div>
          <div class="input_div">
            <label for="hora">Hora:</label>
            <input type="time" id="fecha" v-model="form.hora" :class="{ 'is-invalid': errors.hora }" placeholder="Ingrese la hora" />
            <div v-if="errors.hora" class="invalid-feedback">{{ errors.hora }}</div>
            </div>
        </div>
          <button type="submit" class="btn btn-primary">Guardar</button>
      </form>
      </div>
  </template>
    
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  
  export default {
    name: 'EditCita',
    data() {
      return {
        areasList: [],
        medicosList: [],
        errors: {},
        nombrePaciente:'',
        cita: {
          areaId: null,
          medicoId: null,
          pacienteId: null,
          hora: null,
          fecha: null,
                 
        },
      };
    },
    props: ['item', 'paciente'],
    methods: {
      ...mapActions(['increment']),
      getAreasList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/areas")
                .then(function (response) {
                   vm.areasList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
      },
      getMedicosList(areaId) {
            const vm = this;
            this.axios.get(this.baseUrl + "/medicos?areaId=" + areaId)
                .then(function (response) {
                   vm.medicosList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
      },
      setMedicos(){
      const vm = this;
      vm.form.medicoId='';
            this.axios.get(this.baseUrl + "/medicos?areaId=" + this.form.areaId)
                .then(function (response) {
                    vm.medicosList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
     },
      validateForm() {
        this.errors = {};
  
        if (!this.form.areaId) {
        this.errors.areaId = 'El área es obligatoria, seleccione una opción.';
       }

       if (!this.form.medicoId) {
        this.errors.medico = 'Debe seleccionar un médico.';
       }

       if (!this.form.fecha) {
        this.errors.fecha = 'La fecha es obligatoria.';
      }

      if (!this.form.hora) {
        this.errors.hora = 'La hora es obligatoria.';
      }
        return Object.keys(this.errors).length === 0;
      },
  
      submitForm() {
        if (this.validateForm()) {
            this.save();   
        }
      },
      save() {
        const vm = this;
        vm.cita.areaId= vm.form.areaId;
        vm.cita.medicoId= vm.form.medicoId;
        vm.cita.pacienteId= vm.form.pacienteId;
        vm.cita.hora= vm.form.hora;
        vm.cita.fecha= vm.form.fecha;
         this.axios.patch(this.baseUrl + "/citas/" + this.item.id, vm.cita)
          .then(function (response) {
            if (response.status == '200') {
              vm.$emit('on-update', response.data);
            }
            vm.itemList = response.data;
          })
          .catch(function (error) {
            console.error(error);
          }); 
      }
    },
    computed: {
      // propiedades computadas que dependen de otras propiedades reactivas
      ...mapState(['count']),
      ...mapGetters(['doubleCount', 'getBaseUrl']),
      baseUrl() {
        return this.getBaseUrl
      },
        form() {
           return Object.assign({}, this.item);
        }
    },
    mounted() {
        this.getAreasList();
        this.getMedicosList(this.item.areaId);
        this.nombrePaciente = this.paciente;
    },
  }
  </script>
    
  <style scoped></style>
    