import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import authService from '../../services/authService';
import api from '../../services/api';

// Mock api module
vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('registerTenant', () => {
    it('TC01: Đăng ký tenant thành công và lưu token', async () => {
      const mockResponse = {
        data: {
          token: 'test-token-123',
          user: {
            id: '123',
            email: 'tenant@test.com',
            role: 'tenant',
          },
        },
      };

      api.post.mockResolvedValueOnce(mockResponse);

      const userData = {
        email: 'tenant@test.com',
        password: 'Test@123456',
        full_name: 'Test Tenant',
        phone_number: '0123456789',
      };

      const result = await authService.registerTenant(userData);

      expect(api.post).toHaveBeenCalledWith('/auth/tenant/register', userData);
      expect(result).toEqual(mockResponse.data);
      expect(localStorage.getItem('token')).toBe('test-token-123');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));
    });

    it('TC02: Đăng ký tenant thất bại - email đã tồn tại', async () => {
      api.post.mockRejectedValueOnce({
        response: { data: { message: 'Email đã tồn tại' } },
      });

      const userData = {
        email: 'existing@test.com',
        password: 'Test@123456',
        full_name: 'Test',
      };

      await expect(authService.registerTenant(userData)).rejects.toThrow();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('registerLandlord', () => {
    it('TC03: Đăng ký landlord thành công', async () => {
      const mockResponse = {
        data: {
          token: 'landlord-token',
          user: {
            id: '456',
            email: 'landlord@test.com',
            role: 'landlord',
          },
        },
      };

      api.post.mockResolvedValueOnce(mockResponse);

      const userData = {
        email: 'landlord@test.com',
        password: 'Test@123456',
        full_name: 'Test Landlord',
        identity_card: '123456789012',
      };

      const result = await authService.registerLandlord(userData);

      expect(api.post).toHaveBeenCalledWith('/auth/landlord/register', userData);
      expect(result.token).toBe('landlord-token');
      expect(localStorage.getItem('token')).toBe('landlord-token');
    });
  });

  describe('login', () => {
    it('TC04: Login tenant thành công', async () => {
      const mockResponse = {
        data: {
          token: 'login-token',
          user: {
            id: '789',
            email: 'tenant@test.com',
            role: 'tenant',
          },
        },
      };

      api.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login('tenant@test.com', 'Test@123456', 'tenant');

      expect(api.post).toHaveBeenCalledWith('/auth/tenant/login', {
        email: 'tenant@test.com',
        password: 'Test@123456',
      });
      expect(result.token).toBe('login-token');
      expect(localStorage.getItem('token')).toBe('login-token');
    });

    it('TC05: Login landlord thành công', async () => {
      const mockResponse = {
        data: {
          token: 'landlord-login-token',
          user: { id: '101', email: 'landlord@test.com', role: 'landlord' },
        },
      };

      api.post.mockResolvedValueOnce(mockResponse);

      await authService.login('landlord@test.com', 'Test@123456', 'landlord');

      expect(api.post).toHaveBeenCalledWith('/auth/landlord/login', {
        email: 'landlord@test.com',
        password: 'Test@123456',
      });
    });

    it('TC06: Login admin thành công', async () => {
      const mockResponse = {
        data: {
          token: 'admin-token',
          user: { id: '999', email: 'admin@test.com', role: 'admin' },
        },
      };

      api.post.mockResolvedValueOnce(mockResponse);

      await authService.login('admin@test.com', 'Admin@123456', 'admin');

      expect(api.post).toHaveBeenCalledWith('/auth/admin/login', {
        email: 'admin@test.com',
        password: 'Admin@123456',
      });
    });

    it('TC07: Login thất bại - sai password', async () => {
      api.post.mockRejectedValueOnce({
        response: { data: { message: 'Thông tin đăng nhập không chính xác' } },
      });

      await expect(
        authService.login('tenant@test.com', 'wrong-password', 'tenant')
      ).rejects.toThrow();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('TC08: Logout xóa token và user khỏi localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '123' }));

      authService.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('TC09: Lấy current user từ localStorage', () => {
      const user = { id: '123', email: 'test@test.com' };
      localStorage.setItem('user', JSON.stringify(user));

      const result = authService.getCurrentUser();

      expect(result).toEqual(user);
    });

    it('TC10: Trả về null khi không có user', () => {
      const result = authService.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('getToken', () => {
    it('TC11: Lấy token từ localStorage', () => {
      localStorage.setItem('token', 'my-token');
      expect(authService.getToken()).toBe('my-token');
    });

    it('TC12: Trả về null khi không có token', () => {
      expect(authService.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('TC13: Trả về true khi có token', () => {
      localStorage.setItem('token', 'valid-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('TC14: Trả về false khi không có token', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
