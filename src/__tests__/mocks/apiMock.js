// Mock API responses
export const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@test.com',
  full_name: 'Test User',
  role: 'tenant',
  is_active: true,
  created_at: '2025-01-01T00:00:00Z',
};

export const mockProfile = {
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  phone_number: '0123456789',
  budget_min: 3000000,
  budget_max: 8000000,
  target_province_code: '79',
  target_ward_code: '27109',
};

export const mockRentalPost = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  landlord_id: '123e4567-e89b-12d3-a456-426614174002',
  title: 'Test Post',
  price: 5000000,
  area: 30,
  address_detail: '123 Test Street',
  province_code: '79',
  ward_code: '27109',
  status: 'approved',
  created_at: '2025-01-01T00:00:00Z',
};

export const mockContract = {
  id: '123e4567-e89b-12d3-a456-426614174003',
  post_id: '123e4567-e89b-12d3-a456-426614174001',
  tenant_id: '123e4567-e89b-12d3-a456-426614174000',
  landlord_id: '123e4567-e89b-12d3-a456-426614174002',
  monthly_rent: 5000000,
  deposit_amount: 10000000,
  start_date: '2025-02-01',
  end_date: '2025-08-01',
  status: 'active',
  created_at: '2025-01-01T00:00:00Z',
};

export const mockProvince = {
  id: '79',
  name: 'Thành phố Hồ Chí Minh',
};

export const mockWard = {
  id: '27109',
  name: 'Phường Bến Nghé',
  province_id: '79',
};
