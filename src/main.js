import { createApp } from "vue";
import { Quasar } from "quasar";

import App from "./App.vue";
import router from "./router";
import { i18n } from "./i18n";
import quasarUserOptions from "./quasar-user-options";

import "quasar/dist/quasar.css";
import "@quasar/extras/material-icons/material-icons.css";

createApp(App)
  .use(router)
  .use(i18n)
  .use(Quasar, quasarUserOptions)
  .mount("#app");
