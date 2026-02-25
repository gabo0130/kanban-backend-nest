export interface TokenService {
  generate(userId: number): string;
  verify(token: string): { userId: number };
}
