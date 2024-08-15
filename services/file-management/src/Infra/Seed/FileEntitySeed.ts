import LINQ from '@berish/linq';
import { Inject } from '@nestjs/common';
import { paths } from '@packages/berish-configurator-env';
import { InjectContext } from '@packages/nestjs-request-context';
import { SeedUtils } from '@shared/db';
import { fromBuffer } from 'file-type';
import fs from 'fs';
import path from 'path';

import { FILE_ENTITY_REPOSITORY, FileGetUploadURL, FileUpload } from '../../Application';

export class FileEntitySeed {
  @Inject(SeedUtils)
  private seedUtils: SeedUtils;

  @InjectContext(FILE_ENTITY_REPOSITORY)
  private readonly fileEntityRepository: InjectContext<FILE_ENTITY_REPOSITORY>;

  @Inject(FileGetUploadURL)
  private readonly fileGetUploadURL: FileGetUploadURL;

  @Inject(FileUpload)
  private readonly fileUpload: FileUpload;

  async createDemo() {
    const assetPath = 'assets_seed_images';
    const files = await this.readPublicDir(assetPath);
    await Promise.all(files.map((file) => this.createFileEntity(file)));
  }

  async readPublicDir(dir: string): Promise<string[]> {
    const files = await fs.promises.readdir(path.join(paths.appPublic, dir), { withFileTypes: true, recursive: true });
    const recursiveFiles = await Promise.all(files.filter((m) => m.isDirectory()).map((dirName) => this.readPublicDir(dir + '/' + dirName.name)));

    return LINQ.from(recursiveFiles)
      .selectMany((m) => m)
      .concat(files.filter((m) => m.isFile()).map((m) => dir + '/' + m.name));
  }

  async createFileEntity(fileName: string) {
    return this.seedUtils.newRequest('fileEntity.create', async () => {
      const logoStream = fs.createReadStream(path.join(paths.appPublic, fileName));
      const buffer = await this.streamToBuffer(logoStream);
      // const { uploadUrl } = await this.fileGetUploadURL.execute({});

      const { ext, mime } = await this.getInfo(buffer);
      await this.fileUpload.execute({
        id: fileName.replaceAll('/', '_'),
        buffer,
        signature: 'signature',
        originalname: fileName,
        size: buffer.byteLength,
        mimetype: mime,
      });
    });
  }

  private async getInfo(buffer: Buffer) {
    const info = await fromBuffer(buffer);
    return info;
  }

  private async streamToBuffer(stream: fs.ReadStream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
}
