import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfile } from '../../hooks/useProfile';
import profileService from '../../services/profileService';

vi.mock('../../services/profileService');

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchProfile', () => {
    it('TC01: Fetch profile thành công', async () => {
      const mockProfile = {
        user_id: '123',
        phone_number: '0123456789',
        budget_min: 3000000,
        budget_max: 8000000,
      };

      profileService.getProfile.mockResolvedValueOnce({
        message: 'Success',
        profile: mockProfile,
      });

      const { result } = renderHook(() => useProfile());

      expect(result.current.loading).toBe(false);
      expect(result.current.profile).toBeNull();
      expect(result.current.error).toBeNull();

      await act(async () => {
        await result.current.fetchProfile();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.error).toBeNull();
    });

    it('TC02: Fetch profile thất bại - hiển thị error', async () => {
      const errorMessage = 'Không có quyền truy cập';
      profileService.getProfile.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        try {
          await result.current.fetchProfile();
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.profile).toBeNull();
      expect(result.current.error).toBe(errorMessage);
    });

    it('TC03: Loading state đúng trong quá trình fetch', async () => {
      const mockProfile = { user_id: '123', phone_number: '0123456789' };
      
      profileService.getProfile.mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ profile: mockProfile }), 100))
      );

      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.fetchProfile();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('updateProfile', () => {
    it('TC04: Update profile thành công', async () => {
      const updatedProfile = {
        user_id: '123',
        phone_number: '0987654321',
        budget_min: 5000000,
        budget_max: 10000000,
      };

      profileService.updateProfile.mockResolvedValueOnce({
        message: 'Cập nhật thành công',
        profile: updatedProfile,
      });

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        await result.current.updateProfile({
          phone_number: '0987654321',
          budget_min: 5000000,
          budget_max: 10000000,
        });
      });

      expect(result.current.profile).toEqual(updatedProfile);
      expect(result.current.error).toBeNull();
    });

    it('TC05: Update profile thất bại', async () => {
      const errorMessage = 'Budget min phải nhỏ hơn budget max';
      profileService.updateProfile.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        try {
          await result.current.updateProfile({
            budget_min: 10000000,
            budget_max: 5000000,
          });
        } catch (error) {
          // Expected
        }
      });

      expect(result.current.error).toBe(errorMessage);
    });

    it('TC06: Update profile với dữ liệu không có nested profile field', async () => {
      const updatedData = {
        user_id: '123',
        phone_number: '0111222333',
      };

      profileService.updateProfile.mockResolvedValueOnce(updatedData);

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        await result.current.updateProfile({ phone_number: '0111222333' });
      });

      expect(result.current.profile).toEqual(updatedData);
    });
  });
});
