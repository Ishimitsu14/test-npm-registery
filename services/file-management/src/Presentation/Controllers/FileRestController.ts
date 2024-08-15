import { Controller, DefaultValuePipe, Get, Inject, Param, ParseBoolPipe, ParseFilePipe, Post, Query, Res, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

import { FileDownload, FileDownloadProps, FileUpload, FileUploadProps } from '../../Application';
import { NestRestExceptionFilter } from '../Filters';

@Controller()
@UseFilters(new NestRestExceptionFilter())
export class FileRestController {
  @Inject(ModuleRef)
  private moduleRef: ModuleRef;

  @Post('file.upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Query('id') id: string, @Query('prefix') prefix: string, @Query('signature') signature: string, @UploadedFile(new ParseFilePipe()) file: Express.Multer.File) {
    try {
      const handler = this.moduleRef.get(FileUpload);

      const params: FileUploadProps = {
        id,
        signature,
        prefix,
        buffer: file?.buffer,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      };
      await handler.validate(params);
      await handler.execute(params);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Get('file.get/:file_id')
  async download(
    @Res() res: Response,
    @Param('file_id') id: string,
    @Query('signature') signature: string,
    @Query('attachment', new DefaultValuePipe(false), new ParseBoolPipe()) asAttachment: boolean,
  ) {
    const handler = this.moduleRef.get(FileDownload);
    const params: FileDownloadProps = {
      id,
      signature,
    };

    await handler.validate(params);
    const result = await handler.execute(params);

    const buffer = await result.getBuffer();

    res.set({
      'Content-Type': result.file.mimeType,
      'Content-Disposition': `${asAttachment ? 'attachment' : 'inline'}; filename="${result.file.originalName}"`,
    });
    res.send(buffer);
  }
}
