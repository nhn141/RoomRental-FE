import { describe, it, expect, vi, beforeEach } from 'vitest';
import profileService from '../../services/profileService';
import api from '../../services/api';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('profileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('TC01: Lấy profile thành công - format có profile field', async () => {
      const mockProfile = {
        user_id: '123',
        phone_number: '0123456789',
        budget_min: 3000000,
        budget_max: 8000000,
      };

      api.get.mockResolvedValueOnce({
        data: {
          message: 'Lấy thông tin hồ sơ thành công',
          profile: mockProfile,
        },
      });

      const result = await profileService.getProfile();

      expect(api.get).toHaveBeenCalledWith('/profile');
      expect(result).toEqual(mockProfile);
    });

    it('TC02: Lấy profile thành công - format không có profile field', async () => {
      const mockData = {
        user_id: '123',
        phone_number: '0123456789',
      };

      api.get.mockResolvedValueOnce({
        data: mockData,
      });

      const result = await profileService.getProfile();

      expect(result).toEqual(mockData);
    });

    it('TC03: Lấy profile thất bại - không có token', async () => {
      api.get.mockRejectedValueOnce({
        response: { data: { message: 'Không có quyền truy cập' } },
      });

      await expect(profileService.getProfile()).rejects.toThrow();
    });
  });

  describe('updateProfile', () => {
    it('TC04: Cập nhật tenant profile thành công', async () => {
      const updateData = {
        phone_number: '0987654321',
        budget_min: 5000000,
        budget_max: 10000000,
        target_province_code: '79',
        target_ward_code: '27109',
      };

      const mockProfile = {
        user_id: '123',
        ...updateData,
      };

      api.put.mockResolvedValueOnce({
        data: {
          message: 'Cập nhật hồ sơ thành công',
          profile: mockProfile,
        },
      });

      const result = await profileService.updateProfile(updateData);

      expect(api.put).toHaveBeenCalledWith('/profile/edit-profile', updateData);
      expect(result).toEqual(mockProfile);
    });

    it('TC05: Cập nhật landlord profile thành công', async () => {
      const updateData = {
        phone_number: '0111222333',
        identity_card: '123456789012',
        identity_card_date: '2020-01-01',
        identity_card_place: 'TP.HCM',
      };

      api.put.mockResolvedValueOnce({
        data: {
          message: 'Cập nhật hồ sơ thành công',
          profile: { user_id: '456', ...updateData },
        },
      });

      const result = await profileService.updateProfile(updateData);

      expect(result.identity_card).toBe('123456789012');
    });

    it('TC06: Cập nhật admin profile thành công', async () => {
      const updateData = {
        phone_number: '0999888777',
        department: 'IT Support',
      };

      api.put.mockResolvedValueOnce({
        data: {
          message: 'Cập nhật hồ sơ thành công',
          profile: { user_id: '999', ...updateData },
        },
      });

      const result = await profileService.updateProfile(updateData);

      expect(result.department).toBe('IT Support');
    });

    it('TC07: Cập nhật thất bại - không có token', async () => {
      api.put.mockRejectedValueOnce({
        response: { data: { message: 'Không có quyền truy cập' } },
      });

      await expect(profileService.updateProfile({})).rejects.toThrow();
    });
  });
});
