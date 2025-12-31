# Frontend Testing Guide

## Setup

### 1. Cài đặt dependencies

```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom happy-dom
```

### 2. Cài coverage tools (optional)

```bash
npm install --save-dev @vitest/coverage-v8
```

## Chạy Tests

### Chạy tất cả tests
```bash
npm test
```

### Chạy tests với UI (interactive mode)
```bash
npm run test:ui
```

### Chạy tests với coverage report
```bash
npm run test:coverage
```

### Watch mode (tự động chạy lại khi file thay đổi)
```bash
npm test -- --watch
```

### Chạy một file test cụ thể
```bash
npm test -- src/__tests__/services/authService.test.js
```

## Test Structure

```
src/
├── __tests__/
│   ├── setup.js              # Test configuration
│   ├── mocks/
│   │   └── apiMock.js        # Mock data
│   ├── services/
│   │   ├── authService.test.js      # 14 test cases
│   │   └── profileService.test.js   # 7 test cases
│   └── hooks/
│       ├── useProfile.test.js       # 6 test cases
│       └── useRentalPosts.test.js   # 9 test cases
```

## Test Coverage

### Services Tests
- **authService** (14 TCs):
  - ✅ Register tenant/landlord
  - ✅ Login (tenant/landlord/admin)
  - ✅ Logout
  - ✅ Get current user
  - ✅ Get token
  - ✅ Check authentication

- **profileService** (7 TCs):
  - ✅ Get profile
  - ✅ Update profile (tenant/landlord/admin)
  - ✅ Error handling

### Hooks Tests
- **useProfile** (6 TCs):
  - ✅ Fetch profile
  - ✅ Update profile
  - ✅ Loading states
  - ✅ Error handling

- **useRentalPosts** (9 TCs):
  - ✅ Fetch all posts
  - ✅ Fetch my posts
  - ✅ Fetch post by ID
  - ✅ Create post
  - ✅ Filters & pagination

## Test Examples

### Testing a Service
```javascript
import { describe, it, expect, vi } from 'vitest';
import authService from '../../services/authService';

vi.mock('../../services/api');

it('should login successfully', async () => {
  const result = await authService.login('email', 'pass', 'tenant');
  expect(result.token).toBeDefined();
});
```

### Testing a Hook
```javascript
import { renderHook, act } from '@testing-library/react';
import { useProfile } from '../../hooks/useProfile';

it('should fetch profile', async () => {
  const { result } = renderHook(() => useProfile());
  
  await act(async () => {
    await result.current.fetchProfile();
  });
  
  expect(result.current.profile).toBeDefined();
});
```

## Next Steps

Để mở rộng test coverage, bạn có thể thêm:

1. **More Service Tests**:
   - rentalPostService
   - contractService
   - locationService
   - adminService

2. **More Hook Tests**:
   - useContracts
   - useLocation
   - useRecommendations
   - useAdmin

3. **Component Tests**:
   - Login/Register forms
   - Profile components
   - RentalPost components
   - Contract components

4. **E2E Tests** (với Playwright):
   - Complete user flows
   - Multi-page interactions
   - Real API integration

## Tips

- Sử dụng `vi.mock()` để mock dependencies
- Test cả success và error cases
- Verify loading states
- Test với different user roles
- Check localStorage operations
- Validate error messages
