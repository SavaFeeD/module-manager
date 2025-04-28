import { container, Container } from "./container";
import { ModuleRef } from "./module.reference";
import { Controller } from "./decorators/controller.decorator";
import { Module } from "./decorators/module.decorator";
import { Inject, Injectable } from "./decorators/provider.decorator";
import { of } from "./utils/map-processing";
import { AbstractModule, FoundModuleDTO, ModuleOptions } from "./types/module.abstract";
import { E_TOKENS } from "./types/tokens.enum";
import {
  ModuleToken,
  ControllerToken,
  ProviderToken,
  ControllerPrefix,
  InjectTokenObject,
  InjectProviderModel
} from "./types/tokens.types";
import { Queue } from "./utils/queue";
import { TypeSpecifier } from "./utils/type-specifier";
import { E_PROVIDER_TYPES } from "./types/provider-types.enum";


export {
  // '@core'
  Container,
  ModuleRef,
  container,
  // '@decorators'
  Module,
  Controller,
  Injectable,
  Inject,
  // '@utils'
  TypeSpecifier,
  Queue,
  of,
  // '@types'
  AbstractModule,
  E_PROVIDER_TYPES,
  E_TOKENS,
  FoundModuleDTO,
  ModuleOptions,
  ModuleToken,
  ControllerToken,
  ProviderToken,
  ControllerPrefix,
  InjectTokenObject,
  InjectProviderModel,
};