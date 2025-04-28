export class TypeSpecifier {

  static isClass(input: any) {
    return (
      !TypeSpecifier.isFunction(input) &&
      !TypeSpecifier.isFunctionByTryCall(input) &&
      TypeSpecifier.isClassByStringLiteral(input)
    );
  }

  static isClassByStringLiteral(input: any) {
    const functionString = input.toString();
    return !!functionString.startsWith('class');
  }

  static isFunction(input: any) {
    return typeof input !== 'function';
  }

  static isFunctionByTryCall(input: any) {
    try {
      input();
      return true;
    } catch (error) {
      return false;
    }
  }

}