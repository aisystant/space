import { Injectable } from '@nestjs/common';
import type { NcContext } from '~/interface/config';
import { AppHooksService } from '~/services/app-hooks/app-hooks.service';
import CustomUrl from 'src/models/CustomUrl';

@Injectable()
export class CustomUrlsService {
  constructor(private readonly appHooksService: AppHooksService) {}

  async checkAvailability(
    context: NcContext,
    params: Pick<CustomUrl, 'id' | 'custom_path'>,
  ) {
    return await CustomUrl.checkAvailability(context, params);
  }

  async getOriginalPath(context: NcContext, custom_path: string) {
    return await CustomUrl.getOriginUrlByCustomPath(context, custom_path);
  }
}
