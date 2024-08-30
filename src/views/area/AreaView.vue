<template>
   <BContainer>
    <div class="s2 px-2 py-2 my-2 text-center">
          <h4 class="fw-bold">Lista de áreas de atención</h4>
    </div>     
    <BTableSimple responsive style="width: fit-content;">
            <BThead>
                <BTr>
                    <BTh>ID</BTh>
                    <BTh>Nombre</BTh>
                    <BTh>Estado</BTh>
                    <BTh>Acciones</BTh>
                </BTr>
                <BTr>
                    <BTh></BTh>
                    <BTh><input type="text" v-model="nombreArea"></BTh>
                    <BTh><BFormCheckbox id="checkbox-estado" v-model="isActive"><p>{{ isActive ? 'Habilitado' : 'Deshabilitado' }}</p></BFormCheckbox></BTh>
                    <BTh><BButton variant="primary" @click="save()">Nuevo</BButton></BTh>
                 </BTr>
                 <BTr v-if="idParaEditar !== null">
                    <BTd></BTd>
                    <BTd style="align-content: center;"><input type="text" v-model="areaEditarObj.nombre" style="width: 100%;"/></BTd>
                    <BTd style="align-content: center;"><BFormCheckbox id="checkbox-estado1" v-model="areaEditarObj.estado"><p>{{ areaEditarObj.estado ? 'Habilitado' : 'Deshabilitado' }}</p></BFormCheckbox></BTd>
                    <BTd><BButton variant="outline-primary" @click="editSave()" style="width: -webkit-fill-available;">Editar</BButton></BTd>
                </BTr>
            </BThead>
            <BTbody>
                <BTr v-for="(item, index) in itemList" :key="index">
                    <BTd style="align-content: center;">{{ 1 + index }}</BTd>
                    <BTd style="align-content: center;">{{ item.nombre }}</BTd>
                    <BTd style="align-content: center;"> <b-badge v-if="item.estado" variant="success">Habilitado</b-badge><b-badge v-else variant="danger">Deshabilitado</b-badge></BTd>
                    <BTd style="align-content: center;">
                        <b-button variant="secondary" @click="edit(item.id, item.nombre, item.estado)" style="margin-right: 15px;"> <b-icon icon="bell-fill"></b-icon><i class="bi bi-pencil-square"></i></b-button>
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

export default {
    name: 'Cliente',
    data() {
        return {
            message: 'Hola Mundo',
            currentPage: 1,
            totalPages: 100, // Este valor debe ser calculado según tus datos
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            itemList: [],
            isActive: false,
            nombreArea:"",
            areaEditarObj:{
                id: "",
                nombre:"",
                estado: false
            },
            idParaEditar:null, 
            
        }
    },
    components: {
        // Registro de componentes que se utilizaran.
        Modal,
    },
    methods: {
        // métodos que se pueden llamar desde la plantilla o desde otras partes del componente.
        ...mapActions(['increment']),
        validate() {
            const vm = this;
        if (!this.nombreArea) {
            vm.$toast.show("El nombre del área es obligatorio.", "danger");
           }else if (!/^[A-Za-z\s\u00f1\u00d1]+$/.test(this.nombreArea)){
            vm.$toast.show("Solamente se permiten letras.", "danger");}
            else{
                return true;
           }

        },
        validateEdit() {
            const vm = this;
        if (!this.areaEditarObj.nombre) {
            vm.$toast.show("El nombre del área es obligatorio.", "danger");
           }else if (!/^[A-Za-z\s\u00f1\u00d1]+$/.test(this.areaEditarObj.nombre)){
            vm.$toast.show("Solamente se permiten letras.", "danger");
            
          }else{
                return true;
           }

        },
        getList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/areas")
                .then(function (response) {
                   vm.itemList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        save() {
            if (this.validate()) {
           const vm = this;
           this.axios.post(this.baseUrl + "/areas", {nombre: this.nombreArea, estado: this.isActive })
                .then(function (response) {
                if (response.status == '201') {
                    window.location.reload();     
                }
                })
                .catch(function (error) {
                   console.error(error);
                });
            } 
        },
        edit(id,nombre, estado) {
            this.areaEditarObj.id = id;
            this.areaEditarObj.nombre = nombre;
            this.areaEditarObj.estado = estado;
            this.idParaEditar = id;
        },
        editSave() {
            if (this.validateEdit()) {
            const vm = this;
            this.axios.patch(this.baseUrl + "/areas/" +this.areaEditarObj.id, {nombre: this.areaEditarObj.nombre, estado: this.areaEditarObj.estado})
                .then(function (response) {
                if (response.status == '200') {
                    window.location.reload();
                }
               })
                    .catch(function (error) {
                    console.error(error);
                });
            }   
        },
        Eliminar(id) {
            if (confirm("¿Esta Seguro de eliminar el registro?")) {
                const vm = this;
                this.axios.delete(this.baseUrl + "/areas/" + id)
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
            this.getList();
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

table td:nth-child(2), td:nth-child(3), td:nth-child(4) {
     text-align: left;
}
th:nth-child(1), td:nth-child(1) {
  width: 5%;
  text-align: center;
}
th:nth-child(2), td:nth-child(2) {
  width: 50%;
}

th:nth-child(3), td:nth-child(3) {
  width: 30%;
}

th:nth-child(4), td:nth-child(4) {
  width: 15%;
}
</style>
