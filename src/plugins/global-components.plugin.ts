import { App, defineAsyncComponent } from 'vue';

const modulesComponentsIcons = import.meta.glob(
  '../components/icons/Icon*.vue'
);

function registerComponentModules(
  modules: Record<string, () => Promise<unknown>>,
  app: App,
  logName: string
): void {
  Object.entries(modules).forEach(([key, dynamicModule]) => {
    const componentName = key.split('/').pop().replace('.vue', '');

    app.component(componentName, defineAsyncComponent(dynamicModule));
    console.debug(`${logName} <${componentName}/> registered`);
  });
}

export const globalComponents = {
  install(app: App): void {
    registerComponentModules(modulesComponentsIcons, app, 'Icon');
  },
};
