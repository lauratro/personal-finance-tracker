import {
  getRefreshCookieOptions,
  REFRESH_COOKIE_PATH,
} from '../../../main/auth/utils/auth.constants';

describe('auth constants', () => {
  it('uses the supplied validated duration for the refresh cookie', () => {
    expect(getRefreshCookieOptions(123_000)).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      path: REFRESH_COOKIE_PATH,
      maxAge: 123_000,
    });
  });
});
