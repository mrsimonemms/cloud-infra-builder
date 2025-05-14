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
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiBody } from '@nestjs/swagger';

import { ClusterService } from './cluster.service';
import { CreateClusterDTO } from './dto/createCluster.dto';

@Controller('cluster')
export class ClusterController {
  @Inject(ClusterService)
  private readonly clusterService: ClusterService;

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBody({
    type: CreateClusterDTO,
  })
  @ApiAcceptedResponse({
    description: 'Create a new cluster',
    type: CreateClusterDTO,
  })
  create(@Body() createClusterDTO: CreateClusterDTO) {
    return this.clusterService.create(createClusterDTO);
  }
}
