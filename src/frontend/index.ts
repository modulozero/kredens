import Vue from "vue";
import App from "./App.vue";

export const app = new Vue({
  components: {
    App
  },
  el: "#body",
  render(createElement) {
    return createElement(App, {
      props: {
        message: "blab"
      }
    });
  }
});
