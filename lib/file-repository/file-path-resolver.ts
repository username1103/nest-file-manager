import path from 'path';

import { Inject, Injectable } from '@nestjs/common';

import { InvalidPathException } from './exception/invalid-path.exception';
import {
  CONFIG,
  FileRepositoryConfiguration,
} from './interface/file-repository-configuration';
import { File } from '../File';

@Injectable()
export class FilePathResolver {
  constructor(@Inject(CONFIG) private config: FileRepositoryConfiguration) {}

  getPathByFile(file: File): string {
    const filePath = path.join(this.getDirectoryPath(), file.filename);

    this.checkPathIncludedBucket(filePath);

    return filePath;
  }

  getPathByKey(key: string): string {
    const filePath = path.join(this.getBucketPath(), key);

    this.checkPathIncludedBucket(filePath);

    return filePath;
  }

  getKeyByFile(file: File): string {
    return path.join(this.config.options.path ?? '', file.filename);
  }

  getDirectoryPath(): string {
    return path.join(this.getBucketPath(), this.config.options.path ?? '');
  }

  private getBucketPath(): string {
    return path.join(this.config.options.bucket);
  }

  private checkPathIncludedBucket(inputPath: string) {
    if (path.relative(this.config.options.bucket, inputPath).includes('../')) {
      throw new InvalidPathException('Can not access files outside of bucket');
    }
  }
}
