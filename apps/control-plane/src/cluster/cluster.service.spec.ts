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
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { WORKFLOW_CLIENT } from '../temporal/temporal.providers';
import {
  ClusterManagementTaskQueue,
  CreateClusterWorkflowType,
  Providers,
} from './cluster.constants';
import { ClusterService } from './cluster.service';
import { CreateClusterDTO } from './dto/createCluster.dto';

jest.mock('uuid');

describe('ClusterService', () => {
  let service: ClusterService;
  let temporalClient: {
    workflow: {
      start: jest.Mock;
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClusterService],
    })
      .useMocker((token) => {
        if (token === WORKFLOW_CLIENT) {
          temporalClient = {
            workflow: {
              start: jest.fn(),
            },
          };
          return temporalClient;
        }
      })
      .compile();

    service = module.get<ClusterService>(ClusterService);

    expect(service).toBeDefined();
  });

  describe('#create', () => {
    it('should send to Temporal', async () => {
      const randomUUID = 'some-uuid';
      (uuid as jest.Mock).mockReturnValue(randomUUID);
      temporalClient.workflow.start.mockResolvedValue({
        workflowId: `createCluster-${randomUUID}`,
      });

      const data: CreateClusterDTO = {
        provider: Providers.VIRTUAL,
        maxNodeCount: 3,
        minNodeCount: 3,
        networkCIDR: '10.0.0.0/24',
        name: 'some-name',
        nodeSizeId: 'size-id',
        regionId: 'region-id',
      };

      expect(await service.create(data)).toEqual({
        workflowId: `createCluster-${randomUUID}`,
      });

      expect(temporalClient.workflow.start).toHaveBeenCalledWith(
        CreateClusterWorkflowType,
        {
          taskQueue: `${ClusterManagementTaskQueue}.${data.provider}`,
          workflowId: `createCluster-${randomUUID}`,
          args: [
            {
              cluster: data,
            },
          ],
        },
      );
    });
  });
});
