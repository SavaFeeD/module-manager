import { container } from "../src";
import { AppController } from "./app-module/app.controller";
import { AppModule } from "./app-module/app.module";

container.registerModule(AppModule);
const appController = container.getController<AppController>('app-co');
appController?.buildInfo();
appController?.createPerson({
  name: 'Yuu'
});
appController?.pricing();
console.log(container.getModuleByName('app-module'));