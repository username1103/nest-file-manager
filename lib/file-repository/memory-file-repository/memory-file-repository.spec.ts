import { MemoryFileRepository } from './memory-file-repository';
import { UploadStrategy } from '../../enum';
import { File } from '../../File';
import { expectNonNullable } from '../../test/expect/expect-non-nullable';
import { MemoryFileRepositoryConfiguration } from '../interface/file-repository-configuration';

describe('MemoryFileRepository', () => {
  describe('save', () => {
    it('save file in storage', async () => {
      // given
      const config: MemoryFileRepositoryConfiguration = {
        strategy: UploadStrategy.MEMORY,
        options: {
          path: './test',
        },
      };
      const file = new File('test.txt', Buffer.from('hello'));

      const memoryFileRepository = new MemoryFileRepository(config);

      // when
      const result = await memoryFileRepository.save(file);

      // then
      expect(result).toBe('test/test.txt');
      const savedFile = await memoryFileRepository.get(result);
      expect(file).toBe(savedFile);
    });

    it('save file in storage when no path in options of config', async () => {
      // given
      const config: MemoryFileRepositoryConfiguration = {
        strategy: UploadStrategy.MEMORY,
      };
      const file = new File('test.txt', Buffer.from('hello'));

      const memoryFileRepository = new MemoryFileRepository(config);

      // when
      const result = await memoryFileRepository.save(file);

      // then
      expect(result).toBe('test.txt');
      const savedFile = await memoryFileRepository.get(result);
      expect(file).toBe(savedFile);
    });

    it('return null when querying data that does not exist', async () => {
      // given
      const config: MemoryFileRepositoryConfiguration = {
        strategy: UploadStrategy.MEMORY,
      };

      const memoryFileRepository = new MemoryFileRepository(config);

      // when
      const result = await memoryFileRepository.get('test.txt');

      // then
      expect(result).toBeNull();
    });
  });

  describe('get', () => {
    it('return file that exists in the key', async () => {
      // given
      const file = new File('test.txt', Buffer.from('123'));

      const memoryFileRepository = new MemoryFileRepository({
        strategy: UploadStrategy.MEMORY,
      });

      await memoryFileRepository.save(file);

      // when
      const result = await memoryFileRepository.get('test.txt');

      // then
      expectNonNullable(result);
      expect(result.filename).toBe('test.txt');
      expect(result.data.toString()).toBe('123');
    });

    it('return null if file does not exist', async () => {
      // given
      const config: MemoryFileRepositoryConfiguration = {
        strategy: UploadStrategy.MEMORY,
      };
      const memoryFileRepository = new MemoryFileRepository(config);

      // when
      const result = await memoryFileRepository.get('test-file.txt');

      // then
      expect(result).toBeNull();
    });
  });

  describe('getUrl', () => {
    it('return url for getting file', async () => {
      // given
      const memoryFileRepository = new MemoryFileRepository({
        strategy: UploadStrategy.MEMORY,
        options: {
          endPoint: new URL('https://example.com/path1/path2'),
        },
      });
      // when
      const url = await memoryFileRepository.getUrl('/path2/test.txt');

      // then
      expect(url).toBe('https://example.com/path1/path2/path2/test.txt');
    });

    it('throw Error if url option does not exists', async () => {
      // given
      const memoryFileRepository = new MemoryFileRepository({
        strategy: UploadStrategy.MEMORY,
      });

      // when, then
      await expect(() =>
        memoryFileRepository.getUrl('test.txt'),
      ).rejects.toThrow(Error);
    });
  });

  describe('getSignedUrlForRead', () => {
    it('return url for getting file', async () => {
      // given
      const memoryFileRepository = new MemoryFileRepository({
        strategy: UploadStrategy.MEMORY,
        options: {
          endPoint: new URL('https://example.com/path1/path2'),
        },
      });
      // when
      const url = await memoryFileRepository.getSignedUrlForRead(
        '/path2/test.txt',
      );

      // then
      expect(url).toBe('https://example.com/path1/path2/path2/test.txt');
    });

    it('throw Error if url option does not exists', async () => {
      // given
      const memoryFileRepository = new MemoryFileRepository({
        strategy: UploadStrategy.MEMORY,
      });

      // when, then
      await expect(() =>
        memoryFileRepository.getSignedUrlForRead('test.txt'),
      ).rejects.toThrow(Error);
    });
  });

  describe('getSignedUrlForUpload', () => {
    it('return url for getting file', async () => {
      // given
      const memoryFileRepository = new MemoryFileRepository({
        strategy: UploadStrategy.MEMORY,
        options: {
          endPoint: new URL('https://example.com/path1/path2'),
        },
      });
      // when
      const url = await memoryFileRepository.getSignedUrlForUpload(
        '/path2/test.txt',
      );

      // then
      expect(url).toBe('https://example.com/path1/path2/path2/test.txt');
    });

    it('throw Error if url option does not exists', async () => {
      // given
      const memoryFileRepository = new MemoryFileRepository({
        strategy: UploadStrategy.MEMORY,
      });

      // when, then
      await expect(() =>
        memoryFileRepository.getSignedUrlForUpload('test.txt'),
      ).rejects.toThrow(Error);
    });
  });
});
