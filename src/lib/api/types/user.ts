
export type UserResponse = {
  id: string;
  email: string;
  name: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthMeResponse = {
  user: UserResponse;
  active_household_id: string;
};

export type LoginResponse extends AuthMeResponse = { 
    access_token: string; 
    refresh_token: string; 
    token_type: string;
};