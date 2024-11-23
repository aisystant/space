import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GlobalGuard } from '~/guards/global/global.guard';
import { MetaApiLimiterGuard } from '~/guards/meta-api-limiter.guard';
import { CustomUrlsService } from 'src/services/custom-urls.service';

@Controller()
@UseGuards(MetaApiLimiterGuard, GlobalGuard)
export class CustomUrlsController {
  constructor(protected readonly customUrlsService: CustomUrlsService) {}

  @Get([
    '/api/v1/db/meta/custom-url/:customPath',
    '/api/v2/meta/custom-url/:customPath',
  ])
  async getOriginalPath(@Param('customPath') customPath: string) {
    return await this.customUrlsService.getOriginalPath(customPath);
  }

  @Post(['/api/v1/db/meta/custom-url/check-path', '/api/v2/meta/check-path'])
  @HttpCode(200)
  async checkAvailability(
    @Body()
    body: {
      id?: string;
      custom_path?: string;
    },
  ) {
    return await this.customUrlsService.checkAvailability(body);
  }
}
