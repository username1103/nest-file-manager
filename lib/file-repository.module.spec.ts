import { Test } from '@nestjs/testing';

import { DiskFileRepository } from './disk-file-repository';
import { UploadStrategy } from './enum/upload-strategy';
import { FileRepository } from './file-repository';
import { FileRepositoryModule } from './file-repository.module';
import {
  CONFIG,
  DiskFileUploadConfiguration,
  MemoryFileUploadConfiguration,
  S3FileUploadConfiguration,
} from './interface/file-upload-configuration';
import { MemoryFileRepository } from './memory-file-repository';
import { S3FileRepository } from './s3-file-repository';

describe('FileRepositoryModule', () => {
  it('make disk file repository by disk config', async () => {
    // given
    const diskConfig: DiskFileUploadConfiguration = {
      strategy: UploadStrategy.DISK,
      options: { path: '.' },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(diskConfig)],
    }).compile();

    // when
    const fileService = module.get(FileRepository);
    const config = module.get(CONFIG);

    // then
    expect(fileService).toBeInstanceOf(DiskFileRepository);
    expect(config).toBe(diskConfig);
  });

  it('make s3 file repository by s3 config', async () => {
    // given
    const s3Config: S3FileUploadConfiguration = {
      strategy: UploadStrategy.S3,
      options: {
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
        acl: 'public-read',
        bucket: 'test',
        region: 'test',
      },
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(s3Config)],
    }).compile();

    // when
    const fileService = module.get(FileRepository);
    const config = module.get(CONFIG);

    // then
    expect(fileService).toBeInstanceOf(S3FileRepository);
    expect(config).toBe(s3Config);
  });

  it('make memory file repository by memory config', async () => {
    // given
    const memoryConfig: MemoryFileUploadConfiguration = {
      strategy: UploadStrategy.MEMORY,
    };
    const module = await Test.createTestingModule({
      imports: [FileRepositoryModule.register(memoryConfig)],
    }).compile();

    // when
    const fileService = module.get(FileRepository);
    const config = module.get(CONFIG);

    // then
    expect(fileService).toBeInstanceOf(MemoryFileRepository);
    expect(config).toBe(memoryConfig);
  });
});
