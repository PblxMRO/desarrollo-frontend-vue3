<template>
    <BContainer>
     <Modal v-model="showModalNuevo">
             <AddCitaView @on-register="onRegister($event)" />
      </Modal>
      <Modal v-model="showModalEdit">
             <EditCitaView @on-update="onUpdate($event)" :item="itemToEdit" :paciente="nombrePaciente" />
      </Modal>
     <div class="row options-container">
     <div class="col-md-9" style="align-content: end;"><h4 class="fw-bold">Citas médicas</h4></div>
     <div class="col-md-3"><BButton variant="primary" @click="showModalNuevo = true" style="width: 100%;">Nuevo</BButton></div>
    </div>
    <div class="row options-container-m">
        <form @submit.prevent="filtrar()" class="row options-container-m">
            <div class="col-md-3" style="align-content: end;">
                <label for="fecha"> Fecha: </label>
                <input type="date" id="fecha" v-model="filter.fecha" placeholder="Ingrese la fecha" />
            </div>
            <div class="col-md-3">
                <label for="area"> Areas: </label>
                        <select id="area" v-model="filter.areaId">
                            <option value="">Todas</option>
                            <option :value="area.id" v-for="(area, index) in areasList" :key="`area-${index}`">{{ area.nombre }}
                            </option>
                    </select>
            </div>       
            <div class="col-md-6"><button class="btn btn-md btn-outline-primary" type="submit" style="float: left; margin-left: 15px;">Buscar</button>  </div>
        </form>   
      </div>
      <BTableSimple responsive style="width: inherit;">
             <BThead>
                 <BTr>
                     <BTh>Nº</BTh>
                     <BTh>Fecha</BTh>
                     <BTh>Hora</BTh>
                     <BTh>Area</BTh>
                     <BTh>Médico</BTh>
                     <BTh>Paciente</BTh>
                     <BTh>Acciones</BTh>
                 </BTr>
             </BThead>
             <BTbody>
                 <BTr v-for="(item, index) in itemList" :key="index">
                     <BTd style="align-content: center;">{{ 1 + index }}</BTd>
                     <BTd style="align-content: center;">{{ item.fecha }}</BTd>
                     <BTd style="align-content: center;">{{ item.hora }}</BTd>
                     <BTd style="align-content: center;">{{ item.area.nombre }}</BTd>
                     <BTd style="align-content: center;"><span v-if="item.medico.sexo === 'M'">Dr. </span><span v-else>Dra. </span> {{ item.medico.nombres }} {{ item.medico.apellidos }}</BTd>
                     <BTd style="align-content: center;"> {{ item.paciente.nombres }} {{ item.paciente.apellidos }}</BTd>
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
 import AddCitaView from './AddCitaView.vue'
 import EditCitaView from './EditCitaView.vue'
 
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
             nombrePaciente: '',
             itemList: [],
             areasList: [],
             errors: {},
             filter: {
                fecha: null,
                areaId:''
            }
         }
     },
     components: {
         // Registro de componentes que se utilizaran.
        Modal,
        AddCitaView,
        EditCitaView,
     },
     methods: {
         // métodos que se pueden llamar desde la plantilla o desde otras partes del componente.
         ...mapActions(['increment']),
         getList() {
             const vm = this;
             this.axios.get(this.baseUrl + "/citas?_sort=fecha,hora&_order=asc&_expand=area&_expand=medico&_expand=paciente" + this.textToFilter)
                 .then(function (response) {
                    vm.itemList = response.data;
                 })
                 .catch(function (error) {
                     console.error(error);
                 });
         },
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
             this.nombrePaciente = item.paciente.nombres+' '+item.paciente.apellidos;
             this.showModalEdit = true;
         },
         Eliminar(id) {
             if (confirm("¿Esta Seguro de eliminar el registro?")) {
                 const vm = this;
                 this.axios.delete(this.baseUrl + "/citas/" + id)
                     .then(function (response) {
                         vm.getList();
                         vm.$toast.show("Registro eliminado.", "danger");
                     })
                     .catch(function (error) {
                         console.error(error);
                     });
             }
 
         },
         buscar() {
             this.getList();
         },
         filtrar() {
            this.textToFilter = '';
            if (this.filter.fecha != null && this.filter.fecha != '') {
                this.textToFilter += "&fecha=" + this.filter.fecha;
            }
            if (this.filter.areaId != null && this.filter.areaId != '') {
                this.textToFilter += "&areaId=" + this.filter.areaId;
            }
            this.getList();
        },
         onChange(event) {
             const idArea= event.target.value;
             idArea==''? this.textToFilter='': this.textToFilter="&areaId=" + idArea;
             this.getList(); 
        },
         onRegister(event) {
             this.getList();
             this.showModalNuevo = false;
             this.$toast.show('Registro exitoso', 'success');
         },
         onUpdate(event) {
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Edición exitosa', 'info'); 
        },
         showToast(message, type) {
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
         this.getAreasList();
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
 
 
 th:nth-child(1), td:nth-child(1) {
   width: 5%;
   text-align: center;
 }
 th:nth-child(2), td:nth-child(2), th:nth-child(3), td:nth-child(3) {
   width: 9%;
   text-align: center;
 }

 th:nth-child(4), td:nth-child(4) {
   width: 20%;
   text-align: left;
 }
 th:nth-child(5), td:nth-child(5), th:nth-child(6), td:nth-child(6) {
   width: 23%;
   text-align: left;
 }

 th:nth-child(7), td:nth-child(7) {
   width: 11%;
   text-align: center;
 }
 
 </style>