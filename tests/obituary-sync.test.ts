import { describe, it, expect } from 'vitest';
import {
  FuneralSetting,
  createObituaryFromSetting,
  DEFAULT_FUNERAL_SETTING
} from '../src/life-archive/index.js';
import { FuneralHallService } from '../src/funeral-halls/index.js';
import { VirtualCallService } from '../src/tracking/index.js';

describe('Obituary & Funeral Hall Sync (모바일 부고장과 장례식장 원클릭 오토필)', () => {
  it('기본 장례 설정에서 부고장 객체가 정상 생성되어야 한다', () => {
    const obit = createObituaryFromSetting(DEFAULT_FUNERAL_SETTING);
    expect(obit.title).toContain('故 김철수 님 부고');
    expect(obit.funeralHallLinkedName).toContain('서울아산병원장례식장');
    expect(obit.crematoriumName).toContain('서울시립승화원');
    expect(obit.accountForCondolence).toContain('신한은행');
  });

  it('장례식장 검색 결과의 특정 식장(예: 분당 서울대병원) 선택 시 부고장 제원이 정확히 동기화되어야 한다', () => {
    const hall = FuneralHallService.getHallById('fh-gyeonggi-bundang-snu');
    expect(hall).toBeDefined();
    if (!hall) return;

    const virtPhone = VirtualCallService.getVirtualNumberForHall(hall.id);
    const crematoriumText = hall.nearestCrematorium
      ? `${hall.nearestCrematorium.name} (차량 ${hall.nearestCrematorium.distanceKm}km)`
      : '성남영생관리사업소 (성남 화장장)';

    const updatedSetting: FuneralSetting = {
      ...DEFAULT_FUNERAL_SETTING,
      funeralHallId: hall.id,
      funeralHallName: hall.name,
      address: hall.address,
      phone: hall.phone,
      virtualPhone: virtPhone,
      nearestSubway: hall.nearestSubway || '신분당선 미금역',
      discountRate: Math.round(hall.discountRate * 100),
      crematoriumName: crematoriumText,
      roomName: hall.roomTypes?.[0]?.name || '특실 1호실',
      navigationLink: `https://map.kakao.com/link/search/${encodeURIComponent(hall.name)}`
    };

    const synchronizedObituary = createObituaryFromSetting(updatedSetting);

    expect(synchronizedObituary.funeralHallLinkedName).toBe(`${hall.name} ${updatedSetting.roomName}`);
    expect(updatedSetting.address).toBe(hall.address);
    expect(updatedSetting.virtualPhone).toMatch(/^0507-1420-\d{4}$/);
    expect(updatedSetting.navigationLink).toContain('map.kakao.com');
  });
});
