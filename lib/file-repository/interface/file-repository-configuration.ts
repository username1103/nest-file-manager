import { GCSUploadOptionFactory } from './gcs-upload-option-factory';
import { S3UploadOptionFactory } from './s3-upload-option-factory';
import { UploadStrategy } from '../../enum';
import { CustomProvider } from '../../interface/custom-provider';
import { GCSAcl, S3Acl } from '../constant';

export const CONFIG = Symbol('CONFIG');

export type FileRepositoryConfiguration =
  | DiskFileRepositoryConfiguration
  | S3FileRepositoryConfiguration
  | GCSFileRepositoryConfiguration
  | MemoryFileRepositoryConfiguration;

export interface S3FileRepositoryConfiguration extends CommonConfiguration {
  strategy: UploadStrategy.S3;

  options: CommonOptions & {
    region: string;
    credentials: {
      secretAccessKey: string;
      accessKeyId: string;
    };
    bucket: string;
    acl?: S3Acl;
    forcePathStyle?: boolean;
    uploadOptionFactory?: CustomProvider<S3UploadOptionFactory>;
    signedUrlExpires?: number;
  };
}

export interface GCSFileRepositoryConfiguration extends CommonConfiguration {
  strategy: UploadStrategy.GCS;

  options: CommonOptions & {
    bucket: string;
    keyFile?: string;
    projectId?: string;
    acl?: GCSAcl;
    uploadOptionFactory?: CustomProvider<GCSUploadOptionFactory>;
    signedUrlExpires?: number;
  };
}

export interface DiskFileRepositoryConfiguration extends CommonConfiguration {
  strategy: UploadStrategy.DISK;

  options: CommonOptions;
}

export interface MemoryFileRepositoryConfiguration extends CommonConfiguration {
  strategy: UploadStrategy.MEMORY;

  options: CommonOptions;
}

export interface CommonOptions {
  bucket: string;

  path?: string;

  /**
   * The number of milliseconds a request can take before automatically being terminated.
   * 0 disables the timeout.
   */
  timeout?: number;

  endPoint?: URL;
}

export interface CommonConfiguration {
  name?: string | symbol;
}
