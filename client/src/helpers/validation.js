export const isValidationError = e =>
  e.graphQLErrors.length > 0 &&
  e.graphQLErrors[0].extensions &&
  e.graphQLErrors[0].extensions.exception &&
  e.graphQLErrors[0].extensions.exception.validationErrors;

export const getValidationErrors = e => {
  if (!e.graphQLErrors) return null;
  return e.graphQLErrors.length > 0 &&
    e.graphQLErrors[0].extensions &&
    e.graphQLErrors[0].extensions.exception &&
    e.graphQLErrors[0].extensions.exception.validationErrors
    ? e.graphQLErrors[0].extensions.exception.validationErrors
    : null;
};
