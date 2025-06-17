# Summary

*IOC (Inversion of Control)* - is a design principle in object-oriented programming where the control over the creation and relationships of objects is delegated to an external system or framework, rather than being handled by the object itself.

Key points:
- Purpose of IOC : to reduce coupling between components in an application;
- How it works : instead of creating dependencies internally, an object receives them from the outside;
- Common implementation : through Dependency Injection (DI) — a technique where dependencies are provided to an object externally;


# Base sample

An example of using all the features in one example is in the `__tests__` folder.


# Start

NPM package:

```bash
npm i @savafeed/module-manager
```

or CDN:

```bash
https://unpkg.com/@savafeed/module-manager@1.1.3/dist/index.cjs.js
https://unpkg.com/@savafeed/module-manager@1.1.3/dist/index.esm.js
https://unpkg.com/@savafeed/module-manager@1.1.3/dist/index.umd.js
```

Main dependency - `reflect-metadata`


# Consists of

The library consists of:
- `Module`:
  - `@Module` - class decorator;
- `Controller`:
  - `@Controller` - class decorator;
- `Dependency`:
  - `@Inectable` - class decorator;
  - `@Inject` - property decorator;
- `Container`;

 
## Constroller and Dependency

The difference between a `Controller` and a `Dependency` is that a controller cannot be passed as a dependency and can be obtained from a `Module` and its methods can be used.

Also, a `Controller` belongs only to a `Module` at a time, while a `Dependency` belongs to the entire container.

Controller sample:
```ts
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
```

Dependency sample:
```ts
@Injectable()
export class AppRepository {
  
  constructor(
    @Inject('PRICE_SERVICE') private priceService: AbstractPriceService,
  ) {};
  
  mock() {
    return schema || {};
  }

  getPrice() {
    const currentCurrency = 'USD';
    const { price, currency } = this.priceService.getPrice(currentCurrency);
    return `${price} ${currency}`;
  }

}
```


## Module

*Module* - is a logical block of an application that groups related components (classes, services, repositories, etc.) and defines how they interact with each other and with the outside world.

Modules are often used for:
- Registering dependencies in the IoC container;
- Configuring the application's behavior;
- Structuring code into functional areas;

Module sample:
```ts
@Module({
  name: 'app-module',
  providers: [
    AppService,
    AppRepository,
    {
      token: 'CONFIG_TOKEN',
      useValue: { configVersion: 1 },
    },
    {
      token: 'PRICE_SERVICE',
      useFactory: PriceService,
    }
  ],
  controllers: [AppController],
})
export class AppModule {};
```


## Container

*IoC Container* - is a key component that implements the *Inversion of Control* principle in practice. It automates dependency management and the lifecycle of objects.

Example of registering a module in a container:
```ts
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
```
