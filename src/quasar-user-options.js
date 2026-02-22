import { Notify, Dialog, Loading } from "quasar";

export default {
  plugins: { Notify, Dialog, Loading },
  config: {
    notify: {
      position: "top",
      timeout: 2500,
    },
  },
};
