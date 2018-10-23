import { UserInputError } from 'apollo-server';

export const validate = async (schema, data) => {
  try {
    await schema.validate(data);
  } catch (e) {
    throw new UserInputError('Bad stuff!', {
      validationErrors: {
        [e.path]: e.errors,
      },
    });
  }
};
