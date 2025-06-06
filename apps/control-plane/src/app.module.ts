/*
 * Copyright 2025 Simon Emms <simon@simonemms.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { ClusterModule } from './cluster/cluster.module';
import config from './config';
import { HealthModule } from './health/health.module';
import { MetricsController } from './health/metrics.controller';
import { DatabaseLogger } from './lib/databaseLogger';
import { MessagingModule } from './messaging/messaging.module';
import { TemporalModule } from './temporal/temporal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const db = configService.getOrThrow<TypeOrmModuleOptions>('db');

        return {
          ...db,
          logger: new DatabaseLogger(),
        };
      },
    }),
    PrometheusModule.register({
      // Define the controller so it's not under /v1 namespaces
      controller: MetricsController,
    }),

    ClusterModule,
    HealthModule,
    MessagingModule,
    TemporalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
