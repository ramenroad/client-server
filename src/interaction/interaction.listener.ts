import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InteractionService } from './interaction.service';

@Injectable()
export class InteractionListener {
  constructor(private readonly interactionService: InteractionService) {}

  // 'async: true'로 설정하여 메인 스레드(조회 응답)를 차단하지 않음
  @OnEvent('ramenya.viewed', { async: true })
  async handleRamenyaViewedEvent(payload: { userId: string; ramenyaId: string }) {
    const { userId, ramenyaId } = payload;

    try {
      await this.interactionService.logRamenyaViewHistory(userId, ramenyaId);
    } catch (error) {
      // 로그 저장이 실패해도 사용자에게 에러를 띄우지 않고 서버 로그만 남김
      throw new Error(`[Interaction] 라멘야 조회 이벤트 처리 실패(handleRamenyaViewedEvent) ${error}`);
    }
  }
}