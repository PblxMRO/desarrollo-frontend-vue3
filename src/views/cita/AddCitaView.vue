<template>
    <div class="container">
      <h4>Registrar cita médica</h4>
      <p style="text-align: left;">Buscar paciente:</p>
      <div class="input_container">
          <div class="form-group input_div">
              <input type="search" v-model="textToSearch" id="searchCI" :class="{ 'is-invalid': errors.ci }" placeholder="Ingrese el C.I."  @search="buscar()"/>
            <div v-if="errors.ci" class="invalid-feedback">{{ errors.ci }}</div>
          </div>
          <div class="form-group input_div">
            <BButton @click="buscar()" variant="outline-primary" style="float:left; margin-left: 15px;">Buscar</BButton>
           </div>
        </div>
        
        <form @submit.prevent="submitForm()">
        
        <div class="form-group">
          <label for="paciente">Paciente:</label>
          <input type="text" v-model="nombrePaciente">
          
        </div>

         <div class="form-group">
           <input type="hidden" id="pacienteId"  v-model="form.pacienteId" :class="{ 'is-invalid': errors.paciente }"/>
           <div v-if="errors.paciente" class="invalid-feedback">{{ errors.paciente }}</div>
        </div>

        <div class="form-group">
            <label for="area">Area:</label>
            <select id="areaId" v-model="form.areaId" :class="{ 'is-invalid': errors.areaId }" @change="setMedicos()">
              <option value=null>Selecionar</option>
              <option :value="area.id" v-for="(area, index) in areasList" :key="`area-${index}`">{{ area.nombre }}
              </option>
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
        <button type="submit" class="btn btn-primary">Registrar</button>
      </form>
      </div>
  </template>
    
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
 
  export default {
    name: 'RegisterCita',
    data() {
      return {
        areasList: [],
        medicosList: [],
        form: {
          areaId: null,
          pacienteId: '',
          medicoId: null,
          fecha: '',
          hora: '',
        },
        textToSearch: '',
        nombrePaciente: '',
        errors: {},
      };
    },
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
      setMedicos(){
      const vm = this;
            this.axios.get(this.baseUrl + "/medicos?areaId=" + this.form.areaId)
                .then(function (response) {
                    vm.medicosList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
    },
    buscar(){
      const vm = this;
      if(this.textToSearch!==''){
        this.axios.get(this.baseUrl + "/pacientes?ci=" + this.textToSearch)
                .then(function (response) {
                  const paciente = response.data;
                  vm.nombrePaciente =  paciente[0].nombres+' '+paciente[0].apellidos;
                  vm.form.pacienteId = paciente[0].id;
                  vm.errors.ci ='';
                })
                .catch(function (error) {
                   vm.errors.ci ='El C.I. no está registrado.';
                });
      }else{
        vm.errors.ci='Introduzca el C.I.';
      }
    },
      validateForm() {
        this.errors = {};
  
        if (!this.form.pacienteId) {
          this.errors.paciente = 'El paciente es obligatorio.';
          console.log(this.form.pacienteId);
        }

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
          this.form = {
            areaId: null,
            pacienteId: '',
            medicoId: null,
            fecha: '',
            hora: '',
          }; 
          this.nombrePaciente= '';
          this.textToSearch= '';
        }
      },
      save() {
        const vm = this;
       this.axios.post(this.baseUrl + "/citas", this.form)
          .then(function (response) {
            if (response.status == '201') {
              vm.$emit('on-register', response.data);
            }
            console.log(response);
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
      }
    },
    mounted() {
        this.getAreasList();
        const hoy = new Date().toISOString().split('T')[0];
        const element = document.getElementById("fecha");
        element.setAttribute('min', hoy);
    
    },
  }
  </script>
    
  
    