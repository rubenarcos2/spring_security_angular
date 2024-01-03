export default class TokenUtils {
  /*
   * Return a date of token life time from token
   */
  static tokenExpirationTime = (): number => {
    let token = JSON.parse(sessionStorage.getItem('authUser') as string).token;
    token = JSON.parse(atob(token.split('.')[1]));
    return token.exp;
  };

  /*
   * Return a object of token
   */
  static tokenUser = (): string => {
    let token = JSON.parse(sessionStorage.getItem('authUser') as string).token;
    token = JSON.parse(atob(token.split('.')[1]));
    return token.user;
  };
}
