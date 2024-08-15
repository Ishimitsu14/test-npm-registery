import { Body, Controller, Inject, Post, UseFilters } from '@nestjs/common';

import { IApplicantReviewed } from '../../Application';
import { SumsubWebhooksService } from '../../Application/Services/SumsubWebhooksService';
import { NestRestExceptionFilter } from '../Filters';

@Controller('sumsubWebhooks')
@UseFilters(new NestRestExceptionFilter())
export class SumsubWebhooksController {
  @Inject(SumsubWebhooksService)
  private readonly sumsubWebhooksService: SumsubWebhooksService;

  @Post('applicantReviewed')
  async applicantReviewed(@Body() body: IApplicantReviewed) {
    return this.sumsubWebhooksService.applicantReviewed(body);
  }
}
