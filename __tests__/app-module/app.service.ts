import { Inject, Injectable } from "../../src";
import { AppRepository } from "./app.repository";

@Injectable()
export class AppService {
  constructor(
    private appRepository: AppRepository,
    @Inject('CONFIG_TOKEN') private config: any,
  ) {};

  getBuildInfo() {
    return {
      config: this.config,
      version: 1,
      time: new Date().toString(),
    };
  }

  getPrice() {
    return this.appRepository.getPrice();
  }

  personSchema() {
    const mock = this.appRepository.mock();
    console.log('schema:', mock.$schema);
    return mock.$schema;
  }
}