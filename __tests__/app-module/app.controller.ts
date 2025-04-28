import { Controller } from "../../src";
import { AppService } from "./app.service";

@Controller('app-co')
export class AppController {
  constructor(
    private appService: AppService,
  ) {};

  buildInfo() {
    const bInfo = this.appService.getBuildInfo();
    console.log('bInfo:', bInfo);
    return bInfo;
  }

  createPerson({ name }: { name: string }) {
    const personSchema = this.appService.personSchema();
    const person = personSchema.person;
    person.id = Math.floor(2 + Math.random() * (999 + 2 - 2));
    person.name = name;
    console.log('new person:', person);
    return person;
  }

  pricing() {
    const price = this.appService.getPrice();
    console.log('price:', price);
    return price;
  }

}