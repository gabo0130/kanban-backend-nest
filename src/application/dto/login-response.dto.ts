export interface LoginResponseDto {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
