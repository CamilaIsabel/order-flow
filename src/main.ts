import './tailwind.css';
import './assets/sass/styles.scss';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router/index';
import { globalComponents } from './plugins/global-components.plugin';
import './global-validation-rules';

const app = createApp(App);

app.use(globalComponents);
app.use(router);
app.mount('#app');
