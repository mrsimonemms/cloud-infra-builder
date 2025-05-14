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

import { Providers } from './cluster.constants';
import { ClusterController } from './cluster.controller';
import { ClusterService } from './cluster.service';
import { CreateClusterDTO } from './dto/createCluster.dto';

describe('ClusterController', () => {
  let controller: ClusterController;
  let service: {
    create: jest.Mock;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClusterController],
    })
      .useMocker((token) => {
        if (token === ClusterService) {
          service = {
            create: jest.fn(),
          };

          return service;
        }
      })
      .compile();

    controller = module.get<ClusterController>(ClusterController);
    expect(controller).toBeDefined();
  });

  describe('#create', () => {
    it('should call the service', async () => {
      const data: CreateClusterDTO = {
        provider: Providers.VIRTUAL,
        maxNodeCount: 3,
        minNodeCount: 3,
        networkCIDR: '10.0.0.0/24',
        name: 'some-name',
        nodeSizeId: 'size-id',
        regionId: 'region-id',
      };

      const res = 'some-response';
      service.create.mockResolvedValue(res);

      expect(await controller.create(data)).toBe(res);

      expect(service.create).toHaveBeenCalledWith(data);
    });
  });
});
