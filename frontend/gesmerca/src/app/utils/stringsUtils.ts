export default class StringUtils {
  private static removeAccents = (str: string): string =>
    str!.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  static removeSpacesAccentsAndUpperCase = (str: string): string =>
    str !== undefined ? this.removeAccents(str.toLocaleUpperCase().trimStart().trimEnd()) : '';
}
