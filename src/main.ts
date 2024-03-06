import './style.css';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router/index';
import { globalComponents } from './plugins/global-components.plugin';

const app = createApp(App);

app.use(globalComponents);
app.use(router);
app.mount('#app');
