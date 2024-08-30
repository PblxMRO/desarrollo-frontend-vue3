<template>
    <div class="container">
      <h4>Registrar paciente</h4>
      <form @submit.prevent="submitForm()">
       
        <div class="form-group">
          <label for="nombres">Nombre:</label> 
           <input type="text" id="nombres" v-model="form.nombres" :class="{ 'is-invalid': errors.nombres }"
            placeholder="Ingrese el nombre" />
           <div v-if="errors.nombres" class="invalid-feedback">{{ errors.nombres }}</div>
        </div>
        
        <div class="form-group">
          <label for="apellidos">Apellidos:</label>
          <input type="text" id="apellidos" v-model="form.apellidos" :class="{ 'is-invalid': errors.apellidos }"
            placeholder="Ingrese los apellidos" />
          <div v-if="errors.apellidos" class="invalid-feedback">{{ errors.apellidos }}</div>
        </div>
        
        <div class="input_container">
          <div class="form-group input_div">
            <label for="area">Sexo:</label>
            <select id="sexo" v-model="form.sexo" :class="{ 'is-invalid': errors.sexo }" >
              <option value=null>Selecionar</option>
              <option :value="sexo.value" v-for="(sexo,index) in sexoList" :key="`${index}`">{{ sexo.text }}
              </option>
            </select>
            <div v-if="errors.sexo" class="invalid-feedback">{{ errors.sexo }}</div>
          </div>
          <div class="input_div">
               <label for="fecha_nacimiento">Fecha de nacimiento:</label>
              <input type="date" id="fecha_nacimiento" v-model="form.fecha_nacimiento" :class="{ 'is-invalid': errors.fecha }"/>
              <div v-if="errors.fecha" class="invalid-feedback">{{ errors.fecha }}</div>
            </div>
        </div>

        <div class="form-group">
          <label for="correo">Correo:</label>
          <input type="text" id="correo" v-model="form.correo" :class="{ 'is-invalid': errors.correo }"
            placeholder="Ingrese el correo electrónico"/>
            <div v-if="errors.correo" class="invalid-feedback">{{ errors.correo }}</div>
        </div>
     
         <div class="input_container">
          <div class="form-group input_div">
            <label for="ci">C.I.:</label>
              <input type="text" id="ci" v-model="form.ci" :class="{ 'is-invalid': errors.ci }" placeholder="Ingresar C.I." />
              <div v-if="errors.ci" class="invalid-feedback">{{ errors.ci }}</div>
           </div>
          <div class="input_div">
               <label for="celular">Celular:</label>
              <input type="text" id="celular" v-model="form.celular" :class="{ 'is-invalid': errors.celular }" placeholder="Ingresar número" />
              <div v-if="errors.celular" class="invalid-feedback">{{ errors.celular }}</div>
            </div>
        </div>
        
          <button type="submit" class="btn btn-primary">Registrar</button>
      </form>
      </div>
  </template>
    
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  const sexo = [{text: 'Masculino', value: 'M'}, {text: 'Femenino', value: 'F'}]
    
  export default {
    name: 'RegisterMedico',
    data() {
      return {
       form: {
          nombres: '',
          apellidos: '',
          sexo: null,
          celular: '',
          ci:'',
          correo: '',
          fecha_nacimiento: null,
         
        },
        errors: {},
        sexoList: sexo
      };
    },
    methods: {
      ...mapActions(['increment']),
      validateForm() {
        this.errors = {};
  
        if (!this.form.nombres) {
          this.errors.nombres = 'El nombre es obligatorio.';
        } else if (!/^[A-Za-z\s\u00f1\u00d1]+$/.test(this.form.nombres)){
        this.errors.nombres = 'Solamente se permiten letras.';
       }

        if (!this.form.apellidos) {
          this.errors.apellidos = 'El apellido es obligatorio.';
        } else if (!/^[A-Za-z\s\u00f1\u00d1]+$/.test(this.form.apellidos)){
        this.errors.apellidos = 'Solamente se permiten letras.';
       }

       if (!this.form.correo) {
        this.errors.correo = 'El correo es obligatorio.';
       } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.form.correo)){
        this.errors.correo = 'Correo no valido.';
       }

       if (!this.form.ci) {
        this.errors.ci = 'El C.I. es obligatorio.';
       } else if (!/^\d+$/.test(this.form.ci)){
        this.errors.ci = 'Solamente números.';
       }

       if (!this.form.celular) {
        this.errors.celular = 'El celular es obligatorio.';
      } else if (!/^(\d{8})+$/.test(this.form.celular)){
        this.errors.celular = 'Solamente números (8 digitos).';
       }

       if (this.form.sexo===null) {
          this.errors.sexo = 'Selecione una opcíon.';
        }

        if (!this.form.fecha_nacimiento) {
        this.errors.fecha = 'La fecha es obligatoria.';
      }

       return Object.keys(this.errors).length === 0;
      },
  
      submitForm() {
        if (this.validateForm()) {
          this.save();
          this.form = {
            nombres: '',
            apellidos: '',
            sexo: null,
            celular: '',
            ci:'',
            correo: '',
            fecha_nacimeinto: null,
          }; 
        }
      },
      save() {
        const vm = this;
        this.axios.post(this.baseUrl + "/pacientes", this.form)
          .then(function (response) {
            if (response.status == '201') {
              vm.$emit('on-register', response.data);
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
      }
    },
    mounted() {
        const hoy = new Date().toISOString().split('T')[0];
        const element = document.getElementById("fecha_nacimiento");
        element.setAttribute('max', hoy);
    },
  }
  </script>
    
  