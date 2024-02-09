<template>
  <v-container>
    <v-alert text :value="alert.visible" :type="alert.type">
      {{ alert.message }}
    </v-alert>
    <div v-if="loading" class="overlay">
      <v-progress-circular
        indeterminate
        :size="80"
        :width="6"
        color="primary"
      ></v-progress-circular>
    </div>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Compumundohipermegared</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/profile" v-if="session != null">Profile</v-btn>
      <v-btn text to="/logout" v-if="session != null">Logout</v-btn>
    </v-app-bar>
    <v-row justify="center">
      <v-col md="4" sm="4">
        <v-card>
          <v-card-title>
            <h3 class="text-upper-case">Perfil de Usuarios</h3>
          </v-card-title>
          <v-card-text>
            <h3 class="text-lower-case">
              Bienvenid@! {{ user.first_name }}, {{ user.last_name }}
            </h3>
            <h4 class="text-lower-case">
              Tu rol es: {{ user.role_id == 2 ? "agente" : "cliente" }}
            </h4>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="list_users"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Gestionar Usuarios</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="900px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="success"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                v-if="user.role_id == 2 || user.role_id == 1"
              >
                New User
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6" v-if="false">
                      <v-text-field
                        v-model="editedItem.id"
                        label="id"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="First Name"
                        prepend-icon="mdi-account"
                        :rules="firstNameRules"
                        v-model="editedItem.first_name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Last Name"
                        prepend-icon="mdi-account"
                        :rules="lastNameRules"
                        v-model="editedItem.last_name"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="editedItem.role_id != 2"
                    >
                      <v-text-field
                        label="Business Name"
                        prepend-icon="mdi-store"
                        :rules="bussinessNameRules"
                        v-model="editedItem.bussiness_name"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="editedItem.role_id != 2"
                    >
                      <v-text-field
                        label="Tax ID Number"
                        prepend-icon="mdi-card-account-details"
                        :rules="taxIdNumberRules"
                        v-model="editedItem.tax_id_number"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="editedItem.role_id != 2"
                    >
                      <v-text-field
                        label="Phone Number"
                        prepend-icon="mdi-phone"
                        :rules="phoneRules"
                        v-model="editedItem.phone_number"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="editedItem.role_id != 2"
                    >
                      <v-text-field
                        label="Adress"
                        prepend-icon="mdi-map-marker"
                        :rules="adressRules"
                        v-model="editedItem.adress"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6" v-if="user.role_id == 2">
                      <v-select
                        label="Status"
                        prepend-icon="mdi-account-check"
                        :rules="statusRules"
                        :items="status"
                        v-model="editedItem.current_status"
                        v-if="true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-if="false">
                      <v-text-field
                        label="Created at"
                        prepend-icon="mdi-calendar-month"
                        v-model="editedItem.created_at"
                        :rules="createdAtRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-if="false">
                      <v-text-field
                        label="Updated at"
                        prepend-icon="mdi-calendar-month"
                        v-model="editedItem.update_at"
                        :rules="updatedAtRules"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        prepend-icon="mdi-lock"
                        v-model="editedItem.password"
                        :rules="passwordRules"
                        label="Password"
                        type="password"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6" v-if="user.role_id == 2">
                      <v-text-field
                        label="Agent ID"
                        prepend-icon="mdi-account"
                        v-model="editedItem.agent_id"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Email"
                        prepend-icon="mdi-email"
                        :rules="emailRules"
                        v-model="editedItem.email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-if="user.role_id == 2">
                      <v-radio-group
                        row
                        v-model="editedItem.role_id"
                        :rules="[(v) => !!v || 'Please Choose One']"
                        @change="setAgentId"
                      >
                        <v-radio label="Client" value="3"></v-radio>
                        <v-radio label="Agent" value="2"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="close"> Cancel </v-btn>
                <v-btn color="success darken-1" text @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="900px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this user?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          small
          color="red"
          @click="deleteItem(item)"
          v-if="user.role_id == 2 || user.role_id == 1"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "Profile",
  components: {},
  data: () => ({
    loading: false,
    dialog: false,
    dialogDelete: false,
    session: null,
    //data alert
    alert: {
      visible: false,
      type: "success",
      message: "default message"
    },
    status: [
      { text: "Active", value: "active" },
      { text: "Inactive", value: "inactive" },
      { text: "Pending", value: "pending" }
    ],
    user: {
      first_name: "",
      last_name: "",
      bussiness_name: "",
      tax_id_number: "",
      phone_number: "",
      adress: "",
      email: "",
      current_status: "",
      created_at: "",
      update_at: "",
      agent_id: "",
      role_id: "",
      password: "",
      id: ""
    },
    headers: [
      {
        text: "ID",
        align: "start",
        sortable: true,
        value: "id"
      },
      { text: "first name", value: "first_name" },
      { text: "last name", value: "last_name" },
      { text: "bussiness name", value: "bussiness_name" },
      { text: "tax id number", value: "tax_id_number" },
      { text: "phone number", value: "phone_number" },
      { text: "adress", value: "adress" },
      { text: "email", value: "email" },
      { text: "status", value: "current_status" },
      { text: "role", value: "role_id" },
      { text: "agent id", value: "agent_id" },
      { text: "created at", value: "created_at" },
      { text: "updated at", value: "update_at" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    list_users: [],
    editedIndex: -1,
    editedItem: {
      first_name: "",
      last_name: "",
      bussiness_name: "",
      tax_id_number: "",
      phone_number: "",
      adress: "",
      email: "",
      current_status: "",
      created_at: "",
      update_at: "",
      agent_id: "",
      role_id: "",
      password: ""
    },
    defaultItem: {
      // id: '1',]
      first_name: "",
      last_name: "",
      bussiness_name: "",
      tax_id_number: "",
      phone_number: "",
      adress: "",
      email: "",
      current_status: "",
      created_at: "",
      update_at: "",
      agent_id: "",
      role_id: "",
      password: ""
    },
    //rules
    firstNameRules: [
      (v) => !!v || "First Name is required",
      (v) => (v && v.length >= 5) || "First Name must be less than 5 characters"
    ],
    lastNameRules: [
      (v) => !!v || "Last Name is required",
      (v) => (v && v.length >= 5) || "Last Name must be less than 5 characters"
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => (v && /.+@.+\..+/.test(v)) || "E-mail must be valid"
    ],
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 8) || "Password must be at least 8 characters"
    ],
    adressRules: [
      (v) => !!v || "Adress is required",
      (v) => (v && v.length >= 10) || "Adress must be less than 10 characters"
    ],

    phoneRules: [
      (v) => !!v || "Phone Number is required",
      (v) =>
        (v && v.length >= 8) || "Phone Number must be less than 8 characters"
    ],

    taxIdNumberRules: [
      (v) => !!v || "Tax Id Number is required",
      (v) =>
        (v && v.length >= 8) || "Phone Number must be less than 8 characters"
    ],

    bussinessNameRules: [
      (v) => !!v || "Bussiness Name is required",
      (v) =>
        (v && v.length >= 5) || "Phone Number must be less than 5 characters"
    ],

    statusRules: [
      (v) => !!v || "Status is required",
      (v) => (v && v.length >= 5) || "Status must be less than 5 characters"
    ],

    createdAtRules: [
      (v) => !!v || "Created At is required",
      (v) =>
        (v && v.length <= 10) || "Created At must be less than 10 characters"
    ],

    updatedAtRules: [
      (v) => !!v || "Updated At is required",
      (v) =>
        (v && v.length <= 10) || "Updated At must be less than 10 characters"
    ]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit User";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },

  beforeCreate() {
    this.session = JSON.parse(sessionStorage.getItem("session"));
    if (this.session == null) {
      this.$router.push("/");
    }
  },

  created() {
    this.session = JSON.parse(sessionStorage.getItem("session"));
    if (this.session.hasOwnProperty("agent")) {
      this.user = this.session.agent;
    } else if (this.session.hasOwnProperty("client")) {
      this.user = this.session.client;
    } else if (this.session.hasOwnProperty("admin")) {
      this.user = this.session.admin;
    }
    this.initialize();
  },

  methods: {
    async getUsers() {
      try {
        this.loading = true;
        let response = await this.axios.get("clientes/consultar", {
          params: { role_id: this.user.role_id, id: this.user.email }
        });
        this.list_users = response.data.clients;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    initialize() {
      this.getUsers();
    },

    setAgentId() {
      this.editedItem.agent_id = this.user.id;
      this.setDate();
    },

    setDate() {
      this.editedItem.created_at == new Date().toISOString().substr(0, 18);
      this.editedItem.update_at == new Date().toISOString().substr(0, 18);
    },

    editItem(item) {
      this.editedIndex = this.list_users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.list_users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      let response = await this.axios.delete(
        `clientes/borrar/${this.editedItem.id}/${this.user.email}`
      );
      this.alert.visible = true;
      this.alert.type = "success";
      this.alert.message = "deleted successfully";
      this.list_users.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    validateFieldsClient() {
      if (
        //requeridos {first_name, last_name, email, adress, phone_number, tax_id_number, bussiness_name, current_status, agent_id, password, role_id}
        this.editedItem.first_name.length == 0 ||
        this.editedItem.last_name.length == "" ||
        !this.validateEmail(this.editedItem.email) ||
        this.editedItem.adress.length == 0 ||
        !this.validatePhoneNumber(this.editedItem.phone_number) ||
        this.editedItem.tax_id_number.length == 0 ||
        this.editedItem.bussiness_name.length == 0 ||
        this.editedItem.current_status.length == 0 ||
        this.editedItem.agent_id.length == 0 ||
        this.editedItem.password.length == 0 ||
        this.editedItem.role_id.length == 0
      ) {
        this.alert.visible = true;
        this.alert.type = "error";
        this.alert.message = "Please fill all the fields correctly";
        return 1;
      }
      return 0;
    },

    validateFieldsAgent() {
      if (
        //requeridos {first_name, last_name, email, current_status, agent_id, password, role_id}
        this.editedItem.first_name.length == 0 ||
        this.editedItem.last_name.length == "" ||
        !this.validateEmail(this.editedItem.email) ||
        this.editedItem.current_status.length == 0 ||
        this.editedItem.agent_id.length == 0 ||
        this.editedItem.password.length == 0 ||
        this.editedItem.role_id.length == 0
      ) {
        this.alert.visible = true;
        this.alert.type = "error";
        this.alert.message = "Please fill all the fields correctly";
        return 1;
      }
      return 0;
    },

    validateEmail(email) {
      var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    validatePhoneNumber(phoneNumber) {
      var re = /^\d{10}$/;
      return re.test(phoneNumber);
    },

    async save() {
      // this.setDate();

      if (this.editedIndex > -1) {
        if (this.editedItem.role_id == 2) {
          if (this.validateFieldsAgent() == 0) {
            this.loading = true;
            try {
              let response = await this.axios.put(
                "clientes/actualizar/" + this.editedItem.id,
                { data: this.editedItem, user_auth: this.user }
              );
              this.alert.visible = true;
              this.alert.type = "success";
              this.alert.message = response.data.message;
              this.loading = false;
            } catch (error) {
              this.alert.visible = true;
              this.alert.type = "error";
              if (error.response) {
                this.alert.message = error.response.data.message;
              } else {
                this.alert.message = "An error occurred";
              }
              this.loading = false;
            }
          }
        } else {
          if (this.validateFieldsClient() == 0) {
            this.loading = true;
            try {
              let response = await this.axios.put(
                "clientes/actualizar/" + this.editedItem.id,
                { data: this.editedItem, user_auth: this.user }
              );

              this.alert.visible = true;
              this.alert.type = "success";
              this.alert.message = response.data.message;
              this.loading = false;
            } catch (error) {
              this.alert.visible = true;
              this.alert.type = "error";
              if (error.response) {
                this.alert.message = error.response.data.message;
              } else {
                this.alert.message = "An error occurred";
              }
              this.loading = false;
            }
          }
        }

        Object.assign(this.list_users[this.editedIndex], this.editedItem);
      } else {
        if (this.editedItem.role_id == 2) {
          if (this.validateFieldsAgent() == 0) {
            try {
              let response;
              this.loading = true;

              if (this.user.role_id == 2 && this.editedItem.role_id == "2") {
                this.editedItem.created_at = new Date()
                  .toISOString()
                  .substr(0, 18);
                this.editedItem.update_at = new Date()
                  .toISOString()
                  .substr(0, 18);
                response = await this.axios.post("auth/signup/agent", {
                  data: this.editedItem,
                  user_auth: this.user
                });

                this.list_users.push(response.data.agent);
              }
              this.loading = false;
              this.alert.visible = true;
              this.alert.type = "success";
              this.alert.message = response.data.message;
            } catch (error) {
              this.alert.visible = true;
              this.alert.type = "error";
              if (error.response) {
                this.alert.message = error.response.data.message;
              } else {
                this.alert.message = "An error occurred";
              }
              this.loading = false;
            }
          }
        } else {
          if (this.validateFieldsClient() == 0) {
            try {
              let response;
              this.loading = true;
              if (this.user.role_id == 2 && this.editedItem.role_id == "3") {
                this.editedItem.created_at = new Date()
                  .toISOString()
                  .substr(0, 18);
                this.editedItem.update_at = new Date()
                  .toISOString()
                  .substr(0, 18);
                response = await this.axios.post("clientes/crear", {
                  data: this.editedItem,
                  user_auth: this.user
                });

                this.list_users.push(response.data.agent);
              }
              this.loading = false;
              this.alert.visible = true;
              this.alert.type = "success";
              this.alert.message = response.data.message;
            } catch (error) {
              this.alert.visible = true;
              this.alert.type = "error";
              if (error.response) {
                this.alert.message = error.response.data.message;
              } else {
                this.alert.message = "An error occurred";
              }
              this.loading = false;
            }
          }
        }
      }
      this.close();
      // this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
