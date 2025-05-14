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
import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@temporalio/client';
import { v4 as uuid } from 'uuid';

import { WORKFLOW_CLIENT } from '../temporal/temporal.providers';
import {
  ClusterManagementTaskQueue,
  CreateClusterWorkflowType,
} from './cluster.constants';
import { CreateClusterResult } from './cluster.interfaces';
import { CreateClusterDTO } from './dto/createCluster.dto';

@Injectable()
export class ClusterService {
  @Inject(WORKFLOW_CLIENT)
  private readonly temporalClient: Client;

  // @todo(sje): save cluster info to database
  async create(cluster: CreateClusterDTO): Promise<CreateClusterResult> {
    const workflow = await this.temporalClient.workflow.start(
      CreateClusterWorkflowType,
      {
        taskQueue: `${ClusterManagementTaskQueue}.${cluster.provider}`,
        workflowId: `createCluster-${uuid()}`,
        args: [
          {
            cluster,
          },
        ],
      },
    );

    return { workflowId: workflow.workflowId };
  }
}
