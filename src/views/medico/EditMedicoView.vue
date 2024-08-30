<template>
    <div class="container">
      <h4>Editar Médico</h4>
       <form @submit.prevent="submitForm()">
       
        <div class="form-group">
          <label for="name">Nombre:</label> 
           <input type="text" id="nombres" v-model="form.nombres" :class="{ 'is-invalid': errors.nombres }"
            placeholder="Ingrese el nombre" />
           <div v-if="errors.nombres" class="invalid-feedback">{{ errors.nombres }}</div>
        </div>
        
        <div class="form-group">
          <label for="name">Apellidos:</label>
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
               <label for="phone">Celular:</label>
              <input type="text" id="celular" v-model="form.celular" :class="{ 'is-invalid': errors.celular }" placeholder="Ingresar número" />
              <div v-if="errors.celular" class="invalid-feedback">{{ errors.celular }}</div>
            </div>
        </div>

        <div class="form-group">
          <label for="correo">Correo:</label>
          <input type="text" id="correo" v-model="form.correo" :class="{ 'is-invalid': errors.correo }"
            placeholder="Ingrese el correo electrónico"/>
            <div v-if="errors.correo" class="invalid-feedback">{{ errors.correo }}</div>
        </div>
     
        <div class="form-group">
            <label for="area">Area:</label>
            <select id="areaId" v-model="form.areaId" :class="{ 'is-invalid': errors.areaId }" >
              <option value=null>Selecionar</option>
              <option :value="area.id" v-for="(area, index) in areasList" :key="`area-${index}`">{{ area.nombre }}
              </option>
            </select>
            <div v-if="errors.areaId" class="invalid-feedback">{{ errors.areaId }}</div>
        </div> 

        <div class="input_container">
          <div class="form-group input_div">
            <label for="piso">Piso:</label>
            <select id="piso" v-model="form.planta" :class="{ 'is-invalid': errors.piso }" >
              <option value=null>Selecionar</option>
              <option :value="piso.value" v-for="(piso,index) in pisoList" :key="`${index}`">{{ piso.text }}
              </option>
            </select>
            <div v-if="errors.piso" class="invalid-feedback">{{ errors.piso }}</div>
          </div>
          <div class="form-group input_div">
            <label for="consultorio">Consultorio:</label>
            <select id="piso" v-model="form.consultorio" :class="{ 'is-invalid': errors.consultorio }" >
              <option value=null>Selecionar</option>
              <option :value="consultorio.value" v-for="(consultorio,index) in consultorioList" :key="`${index}`">{{ consultorio.text }}
              </option>
            </select>
            <div v-if="errors.consultorio" class="invalid-feedback">{{ errors.consultorio }}</div>
           </div>
        </div>
        
        <div class="mt-3">
          <BFormCheckbox id="estado" v-model="form.estado"><p>{{ form.estado  ? 'Habilitado' : 'Deshabilitado' }}</p></BFormCheckbox>
        </div>
          <button type="submit" class="btn btn-primary">Guardar</button>
      </form>
      </div>
  </template>
    
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  const sexo = [{text: 'Masculino', value: 'M'}, {text: 'Femenino', value: 'F'}]
  const piso = [{text: 'Planta baja', value: 0}, {text: 'Primer piso', value: 1}, {text: 'Segundo piso', value: 2}]
  const consultorio = [{text: 'Consultorio Nº1', value: '1'}, {text: 'Consultorio Nº2', value: '2'}, {text: 'Consultorio Nº3', value: '3'}, {text: 'Consultorio Nº4', value: '4'}, {text: 'Consultorio Nº5', value: '5'}]

  export default {
    name: 'EditMedico',
    data() {
      return {
        areasList: [],
        errors: {},
        sexoList: sexo,
        pisoList: piso,
        consultorioList: consultorio,
      };
    },
    props: ['item'],
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

        if (!this.form.areaId) {
        this.errors.areaId = 'El área es obligatoria, seleccione una opción.';
       }else if(this.form.areaId=='null'){
        this.errors.areaId = 'Selecione una opcíon.';
       }

       if (!this.form.correo) {
        this.errors.correo = 'El correo es obligatorio.';
       } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.form.correo)){
        this.errors.correo = 'Correo no valido.';
       }

       if (!this.form.celular) {
        this.errors.celular = 'El celular es obligatorio.';
      } else if (!/^(\d{8})+$/.test(this.form.celular)){
        this.errors.celular = 'Solamente números (8 digitos).';
       }
       
       if (this.form.sexo=='null') {
          this.errors.sexo = 'Selecione una opcíon.';
        }

        if (this.form.planta=='null') {
          this.errors.piso = 'Selecione una opcíon.';
        }

        if (this.form.consultorio=='null') {
          this.errors.consultorio = 'Selecione una opcíon.';
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
        this.axios.patch(this.baseUrl + "/medicos/" + this.item.id, this.form)
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
    },
  }
  </script>
    
  <style scoped></style>
    