import { Amplify } from 'aws-amplify';

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

if (!userPoolId) {
  throw new Error('Missing VITE_COGNITO_USER_POOL_ID environment variable');
}

if (!userPoolClientId) {
  throw new Error('Missing VITE_COGNITO_CLIENT_ID environment variable');
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
    },
  },
});

export default Amplify.getConfig();
