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
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

import { Providers } from '../cluster/cluster.constants';

export function IsCloudProvider(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCloudProvider',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        defaultMessage: (): string => 'Provider ID ($value) is not registered',
        validate: (value: string): boolean => {
          const providers = Object.values(Providers);

          return providers.includes(value as Providers);
        },
      },
    });
  };
}

export function IsGreaterThanOrEqualToProperty(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanOrEqualToProperty',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        defaultMessage: (args: ValidationArguments): string =>
          `Value for $property ($value) must be greater than or equal to $constraint1 (${args.object[property as keyof object] as string})`,
        validate: (value: number, args: ValidationArguments): boolean =>
          value >= args.object[property as keyof object],
      },
    });
  };
}
