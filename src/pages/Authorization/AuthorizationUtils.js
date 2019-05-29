class AuthorizationUtils {
  static getAuthorizedColums(columns) {
    const { authorizeComponents } = window;
    const c = columns.filter(item => {
      if (!authorizeComponents || authorizeComponents.length < 1) return true;
      if (!item.code) return true;
      const v = authorizeComponents.filter(obj => obj.code === item.code);
      if (v && v.length > 0) return true;
      return false;
    });
    return c;
  }
}

export default AuthorizationUtils;
