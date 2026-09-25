import { Inject, Injectable, Module } from '../../src';
import { SecretModule } from './secret.module';

@Injectable()
export class LeakyService {
  constructor(@Inject('SECRET_TOKEN') private readonly secret: string) {}
}

@Module({
  name: 'leaky-module',
  imports: [SecretModule],
  providers: [LeakyService],
})
export class LeakyModule {}
