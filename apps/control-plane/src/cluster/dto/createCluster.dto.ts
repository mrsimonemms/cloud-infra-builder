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
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Column } from 'typeorm';

import {
  IsCloudProvider,
  IsGreaterThanOrEqualToProperty,
} from '../../lib/validation';
import { Providers } from '../cluster.constants';

export class CreateClusterDTO {
  @ApiProperty({
    description: 'Cloud provider to use',
    type: 'string',
    example: Providers.VIRTUAL,
    required: true,
  })
  @Column()
  @IsNotEmpty()
  @IsCloudProvider()
  provider: string;

  @ApiProperty({
    description: 'Name for the cluster',
    type: 'string',
    example: 'cluster-1',
    required: true,
  })
  @Column()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Minimum number of nodes required for the cluster',
    type: 'number',
    example: 1,
    required: true,
  })
  @Column()
  @IsNotEmpty()
  @Min(1)
  minNodeCount: number = 1;

  @ApiProperty({
    description:
      'Maximum number of nodes required for the cluster. Must be greater than or equal to minNodeCount.',
    type: 'number',
    example: 3,
    required: true,
  })
  @Column()
  @IsNotEmpty()
  @IsGreaterThanOrEqualToProperty('minNodeCount')
  maxNodeCount: number = 3;

  @ApiProperty({
    description: 'IPv4 CIDR of the network',
    type: 'string',
    example: '10.0.0.0/24',
    required: true,
  })
  @Column()
  @IsNotEmpty()
  networkCIDR: string = '10.0.0.0/24';

  @ApiProperty({
    description: 'Cloud-specific reference to the node sizes',
    type: 'string',
    example: 'medium',
    required: true,
  })
  @Column()
  @IsNotEmpty()
  nodeSizeId: string;

  @ApiProperty({
    description: 'Cloud-specific reference to the region',
    type: 'string',
    example: 'eu-west-2',
  })
  @Column()
  @IsOptional()
  regionId: string;
}
