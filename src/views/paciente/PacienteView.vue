<template>
    <BContainer>
     <Modal v-model="showModalNuevo">
             <AddPacienteView @on-register="onRegister($event)" />
      </Modal>
      <Modal v-model="showModalEdit">
             <EditPacienteView @on-update="onUpdate($event)" :item="itemToEdit" />
      </Modal>
     <div class="row options-container">
     <div class="col-md-6" style="align-content: end;"><h4 class="fw-bold">Lista de pacientes</h4></div>
     <div class="col-md-4">
        <input type="search" style="float:left" v-model="textToSearch" @search="buscar()" placeholder="Introducir apellido">
        <BButton @click="buscar()" variant="outline-primary" style="float:left; margin-left: 15px;">Buscar</BButton>
      </div>       
     <div class="col-md-2"><BButton variant="primary" @click="showModalNuevo = true" style="width: 100%;">Nuevo</BButton></div>
    </div>
      <BTableSimple responsive style="width: inherit;">
             <BThead>
                 <BTr>
                     <BTh>ID</BTh>
                     <BTh>Nombre</BTh>
                     <BTh>C.I.</BTh>
                     <BTh>Edad</BTh>
                     <BTh>Sexo</BTh>
                     <BTh>Correo</BTh>
                     <BTh>Celular</BTh>
                     <BTh>Acciones</BTh>
                 </BTr>
             </BThead>
             <BTbody>
                 <BTr v-for="(item, index) in itemList" :key="index">
                     <BTd style="align-content: center;">{{ 1 + index }}</BTd>
                     <BTd style="align-content: center;">{{ item.nombres }} {{ item.apellidos }}</BTd>
                     <BTd style="align-content: center;">{{ item.ci }}</BTd>
                     <BTd style="align-content: center;">{{ CalcularEdad(item.fecha_nacimiento) }}</BTd>
                     <BTd style="align-content: center;"><span v-if="item.sexo === 'M'">Masculino </span><span v-else>Femenino</span></BTd>
                     <BTd style="align-content: center;">{{ item.correo }}</BTd>
                     <BTd style="align-content: center;">{{ item.celular }}</BTd>
                     <BTd style="align-content: center;">
                         <b-button variant="secondary" @click="edit(item)" style="margin-right: 15px;"> <b-icon icon="bell-fill"></b-icon><i class="bi bi-pencil-square"></i></b-button>
                         <b-button variant="danger" @click="Eliminar(item.id)"><i class="bi bi-trash"></i></b-button>
                     </BTd>
                 </BTr>
             </BTbody>
         </BTableSimple>
     </BContainer>
 </template>
 <script>
 import { mapState, mapGetters, mapActions } from 'vuex'
 import Modal from '../../components/Modal.vue'
 import AddPacienteView from './AddPacienteView.vue'
 import EditPacienteView from './EditPacienteView.vue'
 
 export default {
     name: 'Paciente',
     data() {
         return {
             currentPage: 1,
             totalPages: 100, // Este valor debe ser calculado según tus datos
             showModalNuevo: false,
             showModalEdit: false,
             itemToEdit: null,
             textToFilter: '',
             textToSearch: '',
             itemList: [],
             errors: {}
         }
     },
     components: {
         // Registro de componentes que se utilizaran.
        Modal,
        AddPacienteView,
        EditPacienteView,
       
     },
     methods: {
         // métodos que se pueden llamar desde la plantilla o desde otras partes del componente.
         ...mapActions(['increment']),
         getList() {
             const vm = this;
             this.axios.get(this.baseUrl + "/pacientes?" + this.textToFilter + this.textToSearch)
                 .then(function (response) {
                    vm.itemList = response.data;
                 })
                 .catch(function (error) {
                     console.error(error);
                 });
         },
         CalcularEdad(fecha){
            var hoy = new Date();
            var cumpleanos = new Date(fecha);
            var edad = hoy.getFullYear() - cumpleanos.getFullYear();
            var m = hoy.getMonth() - cumpleanos.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
                edad--;
            }
            return edad;
        }, 
         edit(item) {
             this.itemToEdit = Object.assign({}, item);
             this.showModalEdit = true;
         },
         Eliminar(id) {
             if (confirm("¿Esta Seguro de eliminar el registro?")) {
                 const vm = this;
                 this.axios.delete(this.baseUrl + "/pacientes/" + id)
                     .then(function (response) {
                         console.log(response);
                         vm.getList();
                         vm.$toast.show("Registro eliminado.", "danger");
                     })
                     .catch(function (error) {
                         console.error(error);
                     });
             }
         },
         buscar() {
            if (this.textToSearch != null && this.textToSearch != '') {
                this.textToSearch = "&apellidos_like=" + this.textToSearch;
            }
             this.getList();
             this.textToSearch ='';
         },
         onChange(event) {
             const idArea= event.target.value;
             idArea==''? this.textToFilter='': this.textToFilter="&areaId=" + idArea;
             this.getList(); 
        },
         onRegister(event) {
             console.log("on register");
             this.getList();
             this.showModalNuevo = false;
             this.$toast.show('Registro exitoso', 'success');
         },
         onUpdate(event) {
            console.log(event);
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Edición exitosa', 'info'); 
        },
         showToast(message, type) {
             console.log("showToast");
             this.$toast.show(message, type);
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
     props: {
         // propiedades que el componente puede recibir.
     },
     mounted() {
         this.getList();
     },
     emits: [] // los eventos personalizados que el componente puede emitir.
 }
 </script>
 <style scoped>
  
 table {
     width: 85%;
     border-collapse: collapse;
     table-layout: fixed;
 }
 
 .filtro {
   margin-bottom: 25px;
   font-weight: bold;
 }
 
 .container {
   text-align: -webkit-center;
 }
 
 th, td {
     border: 1px solid #ddd;
     padding: 8px;
 }
 th {
     background-color: #f1f5f9 !important;
     text-align: left;
     color: #475569 !important;
 }
 
 th input,th button {
   width: -webkit-fill-available;
 }
 
 table td:nth-child(2), td:nth-child(6) {
      text-align: left;
 }
 th:nth-child(1), td:nth-child(1) {
   width: 5%;
   text-align: center;
 }
 th:nth-child(2), td:nth-child(2) {
   width: 25%;
 }

 th:nth-child(3), td:nth-child(3) {
   width: 10%;
   text-align: right;
 }

 th:nth-child(4), td:nth-child(4) {
   width: 5%;
   text-align: center;
 }
 th:nth-child(5), td:nth-child(5) {
   width: 10%;
   text-align: center;
 }
 th:nth-child(6), td:nth-child(6) {
   width: 25%;
 }
 th:nth-child(7), td:nth-child(7) {
   width: 10%;
   text-align: center;
 }
 
 th:nth-child(8), td:nth-child(8) {
   width: 10%;
   text-align: center;
 }
 </style>
 