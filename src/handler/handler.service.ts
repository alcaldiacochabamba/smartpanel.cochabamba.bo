import { Injectable } from '@nestjs/common';

@Injectable()
export class HandlerService {
    sendResponse(message: string, data?: any) {
      return data != null ? {
        message,
        data: data || null,
      }: {
        message
      };
    }
}
