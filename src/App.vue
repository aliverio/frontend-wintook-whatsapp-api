<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container">
      <a class="navbar-brand" href="https://app.wintook.com/" target="_blank">
        <img
          src="https://app.wintook.com/brand-assets/logo.svg"
          alt="Wintook"
          height="45"
        />
      </a>
    </div>
  </nav>

  <div class="container mt-3">
    <div class="card">
      <div class="card-header">Información de Cuenta y Usuario</div>
      <div class="card-body">
        <div class="container row g-3 mb-3">
          <div class="col-md-3">
            <label for="inputDominio" class="form-label">Dominio </label>
            <select v-model="urlDomain" class="form-select">
              <option selected></option>
              <option value="https://app.wintook.com/">app.wintook.com</option>
              <option value="https://chatzeus.com/">chatzeus.com</option>
            </select>
          </div>

          <div class="col-md-4">
            <label for="inputToken" class="form-label">Token de Cuenta</label>
            <input type="text" class="form-control" v-model="apiAccessToken" />
          </div>

          <div class="col-md-2">
            <label for="inputWhatsAppContacto" class="form-label"
              >Contacto (WhatsApp)</label
            >
            <input
              type="text"
              class="form-control text-end"
              id="inputWhatsAppContacto"
              v-model="contactoWhatsApp"
            />
          </div>

          <div class="col-md-3 mt-4 text-end">
            <button
              type="button"
              class="btn btn-primary mt-4 w-100"
              @click="getProfile"
              :disabled="startParams"
            >
              Ejecutar
            </button>
          </div>
        </div>

        <div class="container row g-3 mb-2" v-if="existeContacto">
          <div class="col-md-2">
            <label class="form-label">Id</label>
            <input
              type="text"
              class="form-control"
              v-model="payload.id"
              readonly
            />
          </div>
          <div class="col-md-3">
            <label class="form-label">Contacto Nombre</label>
            <input
              type="text"
              class="form-control"
              v-model="payload.name"
              readonly
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">Número WhatsApp</label>
            <input
              type="text"
              class="form-control"
              v-model="payload.phone_number"
              readonly
            />
          </div>
          <div class="col-md-2">
            <label class="form-label">No. Conversaciones</label>
            <input
              type="text"
              class="form-control"
              v-model="payload.conversations_count"
            />
          </div>

          <div class="col-md-3">
            <label for="inputDominio" class="form-label">Dominio </label>
            <select class="form-select">
              <option v-for="item in contactInboxes" :key="item.inbox.id">
                {{ item.inbox.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="container row g-3 mb-3">
          <div class="col-md-12 mt-4 text-end">
            <button
              type="button"
              class="btn btn-primary w-100"
              @click="sendWhatsApp"
              :disabled="startParams"
            >
              Enviar WhatsApp -> Archivo Adjunto
            </button>
          </div>
        </div>

        <div class="container row g-3 mb-3">
          <div class="accordion" id="accordionExample">
            <div class="accordion-item" v-if="accountId > 0">
              <h2 class="accordion-header">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Se ejecutó la API de perfil correctamente para obtener la
                  cuenta de Wintook ( account_id = {{ accountId }} )
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <pre>{{ profile }}</pre>
                </div>
              </div>
            </div>
            <div class="accordion-item" v-if="existeContacto">
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Se ejecutó la API de obtención de la información del contacto.
                </button>
              </h2>
              <div
                id="collapseTwo"
                class="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <pre>{{ dataContact }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div class="container row g-3 mb-3">
          <div class="accordion" id="accordionExample1">
            <div class="accordion-item" v-if="payload.conversations_count > 0">
              <h2 class="accordion-header">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne1"
                  aria-expanded="true"
                  aria-controls="collapseOne1"
                >
                  Se ejecutó la API de perfil correctamente para obtener la
                  cuenta de Wintook ( account_id = {{ accountId }} )
                </button>
              </h2>
              <div
                id="collapseOne1"
                class="accordion-collapse collapse"
                data-bs-parent="#accordionExample1"
              >
                <div class="accordion-body">
                  <pre>{{ conversations }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
// import SendWhatsApp from "./services/SendWhatsApp"
// import  form-data from "form-data";

//Datos v-model
const urlDomain = ref("");
const apiAccessToken = ref("");
const contactoWhatsApp = ref("");
const accountId = ref(0);
const profile = ref({});

let payload = ref({});
let dataContact = ref({});
let conversations = ref({});

const existeContacto = ref(false);
let contactInboxes = ref({});

// Computed para el Botón de la validación de parametros iniciales.
const startParams = computed(() => {
  return !(
    urlDomain.value.length &&
    apiAccessToken.value.length &&
    contactoWhatsApp.value.length > 9
  );
});

const getProfile = () => {
  const config = {
    method: "get",
    url: `${urlDomain.value}api/v1/profile`,
    headers: {
      api_access_token: `${apiAccessToken.value}`,
    },
  };

  axios(config)
    .then(function (response) {
      console.log("Resultado de la ejecución de API Profile!!!");
      console.log(response.data);

      profile.value = response.data;

      accountId.value = response.data.account_id;
      searchContact();
    })
    .catch(function (error) {
      console.log(error);
    });
};

const searchContact = () => {
  const config = {
    method: "get",
    url: `${urlDomain.value}api/v1/accounts/${accountId.value}/contacts/search?include_contact_inboxes=true&q=${contactoWhatsApp.value}`,
    headers: {
      api_access_token: `${apiAccessToken.value}`,
    },
  };

  axios(config)
    .then(function (response) {
      console.log("Información del Contacto y sus canales de wintook...");
      dataContact.value = response.data;
      console.log(dataContact.value);

      if (response.data.meta.count === 1) {
        existeContacto.value = true;
        payload.value = response.data.payload[0];
        contactInboxes.value = payload.value.contact_inboxes;
        getConversations();
        console.log(contactInboxes.value);
      } else {
        existeContacto.value = false;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const ConversationId = ref(0);
const getConversations = () => {
  const config = {
    method: "get",
    url: `${urlDomain.value}api/v1/accounts/${accountId.value}/contacts/${payload.value.id}/conversations`,
    headers: {
      api_access_token: `${apiAccessToken.value}`,
    },
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
      conversations.value = response.data;
      ConversationId.value = response.data.payload[0].id;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const sendWhatsApp = () => {
  var data = JSON.stringify({
    apiAccessToken: `${apiAccessToken.value}`,
    urlDomain: `${urlDomain.value}`,
    accountId: `${accountId.value}`,
    ConversationId: `${ConversationId.value}`,
    file: "A00012.pdf",
  });

  var config = {
    method: "post",
    url: "https://wtook-wapp-api.onrender.com/whatsapp",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};
</script>

<style>
</style>