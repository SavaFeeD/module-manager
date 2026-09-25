import { Controller, Inject, Injectable, Module } from '../../src';
import { SecretModule } from './secret.module';

@Injectable()
export class FlagService {
  constructor(@Inject('FEATURE_FLAG') private readonly flag: boolean) {}

  getFlag() {
    return this.flag;
  }
}

@Controller('flag-co')
export class FlagController {
  constructor(private flagService: FlagService) {}

  getFlag() {
    return this.flagService.getFlag();
  }
}

@Module({
  name: 'flag-module',
  imports: [SecretModule],
  providers: [FlagService],
  controllers: [FlagController],
})
export class FlagModule {}
