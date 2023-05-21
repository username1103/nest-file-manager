import path from 'path';

import { Inject, Injectable } from '@nestjs/common';

import { File } from '../../File';
import { FileRepository } from '../file-repository';
import {
  CONFIG,
  MemoryFileRepositoryConfiguration,
} from '../interface/file-repository-configuration';

@Injectable()
export class MemoryFileRepository implements FileRepository {
  private readonly storage = new Map<string, File>();
  constructor(
    @Inject(CONFIG) private readonly config: MemoryFileRepositoryConfiguration,
  ) {}

  async save(file: File): Promise<string> {
    const filePath = path.join(this.config.options?.path ?? '', file.filename);

    this.storage.set(filePath, file);

    return filePath;
  }

  async get(filePath: string): Promise<File | null> {
    return this.storage.get(filePath) ?? null;
  }
}
