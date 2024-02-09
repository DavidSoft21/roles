<template>
  <v-container>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Compumundohipermegared</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/profile" v-if="session != null">Profile</v-btn>
      <v-btn text to="/logout" v-if="session != null">Logout</v-btn>
    </v-app-bar>
    <div v-if="loading" class="overlay">
      <v-progress-circular
        indeterminate
        :size="80"
        :width="6"
        color="primary"
      ></v-progress-circular>
    </div>
    <v-alert text :value="alert.visible" :type="alert.type">
      {{ alert.message }}
    </v-alert>
    <v-row justify="center">
      <v-col class="text-center" md="2" sm="2">
        <v-btn class="primary" @click="showSingUp"> sign up </v-btn>
      </v-col>

      <v-col class="text-center" md="2" sm="2">
        <v-btn class="success" @click="showSingIn"> sign in </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-12">
      <v-col class="text-center" md="8" sm="6">
        <v-card v-show="signUpForm">
          <v-card-title>Sign Up</v-card-title>
          <v-card-text>
            <v-form class="ma-3" @submit.prevent="signUp()" ref="signupForm">
              <v-row>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    label="First Name"
                    prepend-icon="mdi-account"
                    :rules="firstNameRules"
                    v-model="user.first_name"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    label="Last Name"
                    prepend-icon="mdi-account"
                    :rules="lastNameRules"
                    v-model="user.last_name"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    label="Email"
                    prepend-icon="mdi-email"
                    :rules="emailRules"
                    v-model="user.email"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    label="Adress"
                    prepend-icon="mdi-map-marker"
                    :rules="adressRules"
                    v-model="user.adress"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    label="Phone Number"
                    prepend-icon="mdi-phone"
                    :rules="phoneRules"
                    v-model="user.phone_number"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    label="Tax ID Number"
                    prepend-icon="mdi-card-account-details"
                    :rules="taxIdNumberRules"
                    v-model="user.tax_id_number"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    label="Business Name"
                    prepend-icon="mdi-store"
                    :rules="bussinessNameRules"
                    v-model="user.bussiness_name"
                  ></v-text-field>
                </v-col>

                <v-col cols="6" sm="6" md="6">
                  <v-text-field
                    prepend-icon="mdi-lock"
                    v-model="user.password"
                    :rules="passwordRules"
                    label="Password"
                    type="password"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-select
                label="Status"
                prepend-icon="mdi-account-check"
                :rules="statusRules"
                :items="status"
                v-model="user.current_status"
                v-if="false"
              ></v-select>

              <v-text-field
                label="Created at"
                prepend-icon="mdi-calendar-month"
                v-model="user.created_at"
                :rules="createdAtRules"
                v-if="false"
              ></v-text-field>

              <v-text-field
                label="Updated at"
                prepend-icon="mdi-calendar-month"
                v-model="user.update_at"
                :rules="updatedAtRules"
                v-if="false"
              ></v-text-field>

              <!-- <v-text-field
                prepend-icon="mdi-lock"
                v-model="passwordConfirm"
                :rules="passwordRules"
                label="Comfirm Password"
                type="password"
              ></v-text-field> -->

              <v-row>
                <v-col col="12" sm="6" md="6">
                  <v-radio-group
                    row
                    v-model="user.role_id"
                    :rules="[(v) => !!v || 'Please Choose One']"
                  >
                    <v-radio label="Client" value="3"></v-radio>
                    <v-radio label="Agent" value="2"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col col="12" sm="6" md="6">
                  <v-text-field
                    label="Agent ID"
                    prepend-icon="mdi-account"
                    v-model="user.agent_id"
                    v-if="user.role_id == 2"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-col cols="12" sm="6" md="6">
                  <v-btn block class="primary mt-3" type="submit"
                    >Sign Up</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card v-show="signInForm">
          <v-card-title>Sign In</v-card-title>
          <v-card-text>
            <v-form class="ma-3" @submit.prevent="signIn()" ref="signinForm">
              <v-text-field
                label="Email"
                prepend-icon="mdi-email"
                :rules="emailRules"
                v-model="user_signin.email"
              ></v-text-field>
              <!-- <v-text-field
                label="Agent ID"
                prepend-icon="mdi-account"
                v-model="user.agent_id"
                v-if="user.role_id == 2"
              ></v-text-field> -->
              <v-text-field
                prepend-icon="mdi-lock"
                v-model="user_signin.password"
                :rules="passwordRules"
                label="Password"
                type="password"
              ></v-text-field>
              <!-- <v-text-field
                prepend-icon="mdi-lock"
                v-model="passwordConfirm"
                :rules="passwordRules"
                label="Comfirm Password"
                type="password"
              ></v-text-field> -->

              <v-radio-group
                row
                v-model="user_signin.role_id"
                :rules="[(v) => !!v || 'Please Choose One']"
              >
                <v-radio label="Client" value="3"></v-radio>
                <v-radio label="Agent" value="2"></v-radio>
              </v-radio-group>

              <v-btn block class="success mt-3" type="submit">Sign In</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    session: null,
    loading: false,
    signUpForm: true,
    signInForm: false,
    //data alert
    alert: {
      visible: false,
      type: "success",
      message: "default message"
    },

    //data form
    status: [
      { text: "Active", value: "active" },
      { text: "Inactive", value: "inactive" },
      { text: "Pending", value: "pending" }
    ],

    user: {
      first_name: "",
      last_name: "",
      email: "",
      adress: "",
      phone_number: "",
      tax_id_number: "",
      bussiness_name: "",
      current_status: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
        { text: "Pending", value: "pending" }
      ],
      created_at: new Date().toISOString().substr(0, 10),
      update_at: new Date().toISOString().substr(0, 10),
      agent_id: "",
      password: [],
      role_id: null
    },

    user_signin: {
      email: "",
      password: [],
      role_id: null
    },
    // passwordConfirm: [],

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

  methods: {
    //signUp
    async signUp() {
      let validate = this.$refs.signupForm.validate();

      if (validate) {
        try {
          let response;
          this.loading = true;
          if (this.user.role_id == 2 || this.user.role_id == "2") {
            response = await this.axios.post("auth/signup/agent", {
              data: this.user,
              user_auth: {}
            });
          } else {
            response = await this.axios.post("clientes/crear", {
              data: this.user,
              user_auth: {}
            });
          }
          this.$router.push("/profile");
          this.signInForm = true;
          this.signUpForm = false;
          this.loading = false;
          sessionStorage.setItem("session", JSON.stringify(response.data));
        } catch (error) {
          this.alert.visible = true;
          this.alert.type = "error";
          this.alert.message = error.response.data.message;
          this.loading = false;
        }
        this.user.agent_id = "";
        this.$refs.signupForm.reset();
      }
    },

    //signIn
    async signIn() {
      let validate = this.$refs.signinForm.validate();

      if (validate) {
        try {
          this.loading = true;

          let response = await this.axios.post("auth/signin", {
            data: this.user_signin,
            user_auth: {}
          });
          sessionStorage.setItem("session", JSON.stringify(response.data));

          this.$router.push("/profile");
          this.loading = false;
        } catch (error) {
          this.alert.visible = true;
          this.alert.type = "error";
          this.alert.message = error.response.data.message;
          this.loading = false;
        }
        this.$refs.signinForm.reset();
      }
    },

    showSingUp() {
      this.signUpForm = true;
      this.signInForm = false;
    },
    showSingIn() {
      this.signUpForm = false;
      this.signInForm = true;
    }
  },
  beforeCreate() {
    this.session = JSON.parse(sessionStorage.getItem("session"));
    if (this.session != null) {
      this.$router.push("/profile");
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
