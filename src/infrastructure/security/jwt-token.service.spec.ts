import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
  const jwtService: jest.Mocked<Pick<JwtService, 'sign' | 'verify'>> = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const service = new JwtTokenService(jwtService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates token using jwt service', () => {
    jwtService.sign.mockReturnValue('token-value');

    expect(service.generate(9)).toBe('token-value');
    expect(jwtService.sign).toHaveBeenCalledWith({ userId: 9 });
  });

  it('verifies token and returns payload', () => {
    jwtService.verify.mockReturnValue({ userId: 9 });

    expect(service.verify('token-value')).toEqual({ userId: 9 });
  });

  it('throws UnauthorizedException when verify fails', () => {
    jwtService.verify.mockImplementation(() => {
      throw new Error('invalid');
    });

    expect(() => service.verify('bad-token')).toThrow(UnauthorizedException);
  });
});
