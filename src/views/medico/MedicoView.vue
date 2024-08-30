<template>
   <BContainer>
    <Modal v-model="showModalNuevo">
            <RegisterMedicoView @on-register="onRegister($event)" />
     </Modal>
     <Modal v-model="showModalEdit">
            <EditMedicoView @on-update="onUpdate($event)" :item="itemToEdit" />
     </Modal>
    <div class="row options-container">
    <div class="col-md-6" style="align-content: end;"><h4 class="fw-bold">Lista de médicos</h4></div>
    <div class="col-md-4">
            <select id="areaId" @change="onChange($event)" style="width: -webkit-fill-available;"> 
              <option value=''>Todas las areas</option>
              <option :value="area.id" v-for="(area, index) in areasList" :key="`area-${index}`">{{ area.nombre }}
              </option>
            </select></div> 
    <div class="col-md-2"><BButton variant="primary" @click="showModalNuevo = true" style="width: 100%;">Nuevo</BButton></div>
   </div>
     <BTableSimple responsive style="width: inherit;">
            <BThead>
                <BTr>
                    <BTh>ID</BTh>
                    <BTh>Nombre</BTh>
                    <BTh>Area</BTh>
                    <BTh>Correo</BTh>
                    <BTh>Celular</BTh>
                    <BTh>Piso</BTh>
                    <BTh>Consultorio</BTh>
                    <BTh>Estado</BTh>
                    <BTh>Acciones</BTh>
                </BTr>
            </BThead>
            <BTbody>
                <BTr v-for="(item, index) in itemList" :key="index">
                    <BTd style="align-content: center;">{{ 1 + index }}</BTd>
                    <BTd style="align-content: center;"><span v-if="item.sexo === 'M'">Dr. </span><span v-else>Dra. </span>{{ item.nombres }} {{ item.apellidos }}</BTd>
                    <BTd style="align-content: center;">{{ item.area.nombre }}</BTd>
                    <BTd style="align-content: center;">{{ item.correo }}</BTd>
                    <BTd style="align-content: center;">{{ item.celular }}</BTd>
                    <BTd style="align-content: center;">{{ item.planta }}</BTd>
                    <BTd style="align-content: center;">{{ item.consultorio }}</BTd>
                    <BTd style="align-content: center;"> <b-badge v-if="item.estado" variant="success">Habilitado</b-badge><b-badge v-else variant="danger">Deshabilitado</b-badge></BTd>
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
import RegisterMedicoView from './RegisterMedicoView.vue'
import EditMedicoView from './EditMedicoView.vue'

export default {
    name: 'Medico',
    data() {
        return {
            message: 'Hola Mundo',
            currentPage: 1,
            totalPages: 100, // Este valor debe ser calculado según tus datos
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToFilter: '',
            textToSearch: '',
            itemList: [],
            areasList: [],
            errors: {}
        }
    },
    components: {
        // Registro de componentes que se utilizaran.
       Modal,
       RegisterMedicoView,
       EditMedicoView 
    },
    methods: {
        // métodos que se pueden llamar desde la plantilla o desde otras partes del componente.
        ...mapActions(['increment']),
        getList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/medicos?_expand=area" + this.textToFilter)
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
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id) {
            if (confirm("¿Esta Seguro de eliminar el registro?")) {
                const vm = this;
                this.axios.delete(this.baseUrl + "/medicos/" + id)
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
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Edicion exitosa', 'info'); 
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

table td:nth-child(2), td:nth-child(3), td:nth-child(4) {
     text-align: left;
}
th:nth-child(1), td:nth-child(1), th:nth-child(6), td:nth-child(6),th:nth-child(7), td:nth-child(7) {
  width: 5%;
  text-align: center;
}
th:nth-child(2), td:nth-child(2), th:nth-child(3), td:nth-child(3), th:nth-child(4), td:nth-child(4) {
  width: 19%;
}

th:nth-child(5), td:nth-child(5), th:nth-child(6), td:nth-child(6),th:nth-child(7), td:nth-child(7),th:nth-child(8), td:nth-child(8) {
  width: 7%;
}
th:nth-child(9), td:nth-child(9) {
  width: 10%;
  text-align: center;
}
</style>
