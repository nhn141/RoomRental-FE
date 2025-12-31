import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRentalPosts } from '../../hooks/useRentalPosts';
import rentalPostService from '../../services/rentalPostService';

vi.mock('../../services/rentalPostService');

describe('useRentalPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAllPosts', () => {
    it('TC01: Fetch tất cả posts thành công', async () => {
      const mockPosts = [
        { id: '1', title: 'Post 1', price: 5000000 },
        { id: '2', title: 'Post 2', price: 7000000 },
      ];

      rentalPostService.getAllPosts.mockResolvedValueOnce({
        posts: mockPosts,
        pagination: { page: 1, total: 2 },
      });

      const { result } = renderHook(() => useRentalPosts());

      await act(async () => {
        await result.current.fetchAllPosts();
      });

      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.pagination).toEqual({ page: 1, total: 2 });
      expect(result.current.error).toBeNull();
    });

    it('TC02: Fetch posts với filters', async () => {
      const filters = {
        min_price: 3000000,
        max_price: 8000000,
        province_code: '79',
      };

      rentalPostService.getAllPosts.mockResolvedValueOnce({
        posts: [],
      });

      const { result } = renderHook(() => useRentalPosts());

      await act(async () => {
        await result.current.fetchAllPosts(filters);
      });

      expect(rentalPostService.getAllPosts).toHaveBeenCalledWith(filters);
    });

    it('TC03: Fetch posts thất bại', async () => {
      const errorMessage = 'Lỗi server';
      rentalPostService.getAllPosts.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useRentalPosts());

      await act(async () => {
        try {
          await result.current.fetchAllPosts();
        } catch (error) {
          // Expected
        }
      });

      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('fetchMyPosts', () => {
    it('TC04: Fetch my posts thành công', async () => {
      const myPosts = [
        { id: '1', title: 'My Post', price: 5000000, status: 'pending' },
      ];

      rentalPostService.getMyPosts.mockResolvedValueOnce({
        posts: myPosts,
      });

      const { result } = renderHook(() => useRentalPosts());

      await act(async () => {
        await result.current.fetchMyPosts();
      });

      expect(result.current.myPosts).toEqual(myPosts);
    });

    it('TC05: Fetch my posts với status filter', async () => {
      rentalPostService.getMyPosts.mockResolvedValueOnce({
        posts: [],
      });

      const { result } = renderHook(() => useRentalPosts());

      await act(async () => {
        await result.current.fetchMyPosts({ status: 'approved' });
      });

      expect(rentalPostService.getMyPosts).toHaveBeenCalledWith({ status: 'approved' });
    });
  });

  describe('fetchPostById', () => {
    it('TC06: Fetch post detail thành công', async () => {
      const mockPost = {
        id: '123',
        title: 'Test Post',
        price: 5000000,
        landlord_name: 'John Doe',
      };

      rentalPostService.getPostById.mockResolvedValueOnce({
        post: mockPost,
      });

      const { result } = renderHook(() => useRentalPosts());

      await act(async () => {
        await result.current.fetchPostById('123');
      });

      expect(result.current.currentPost).toEqual(mockPost);
      expect(rentalPostService.getPostById).toHaveBeenCalledWith('123');
    });

    it('TC07: Fetch post không tồn tại', async () => {
      const errorMessage = 'Bài đăng không tồn tại';
      rentalPostService.getPostById.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useRentalPosts());

      await act(async () => {
        try {
          await result.current.fetchPostById('fake-id');
        } catch (error) {
          // Expected
        }
      });

      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('createPost', () => {
    it('TC08: Tạo post thành công', async () => {
      const newPost = {
        title: 'New Post',
        price: 5000000,
        area: 30,
        province_code: '79',
        ward_code: '27109',
      };

      rentalPostService.createPost.mockResolvedValueOnce({
        message: 'Tạo bài đăng thành công',
        post: { id: '999', ...newPost },
      });

      const { result } = renderHook(() => useRentalPosts());

      let response;
      await act(async () => {
        response = await result.current.createPost(newPost);
      });

      expect(response.post.id).toBe('999');
      expect(rentalPostService.createPost).toHaveBeenCalledWith(newPost);
    });

    it('TC09: Tạo post thất bại - thiếu required fields', async () => {
      const errorMessage = 'Thiếu thông tin bắt buộc';
      rentalPostService.createPost.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useRentalPosts());

      await act(async () => {
        try {
          await result.current.createPost({ title: 'Incomplete' });
        } catch (error) {
          // Expected
        }
      });

      expect(result.current.error).toBe(errorMessage);
    });
  });
});
