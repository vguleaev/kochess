import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, Context } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const CLERK_ISSUER = process.env.CLERK_ISSUER;
const CLERK_JWKS_URL = process.env.CLERK_JWKS_URL;

if (!CLERK_ISSUER || !CLERK_JWKS_URL) {
  throw new Error('Missing required Clerk configuration');
}

const client = jwksClient({
  cache: true,
  cacheMaxAge: 600000,
  jwksUri: CLERK_JWKS_URL,
});

const getSigningKey = (kid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err: Error | null, key?: jwksClient.SigningKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(key?.getPublicKey() || '');
      }
    });
  });
};

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const token = event.authorizationToken.replace('Bearer ', '');

    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
      throw new Error('Invalid token structure');
    }

    const signingKey = await getSigningKey(decoded.header.kid);

    const verified = jwt.verify(token, signingKey, {
      issuer: CLERK_ISSUER,
      algorithms: ['RS256'],
    }) as jwt.JwtPayload;

    const userId = verified.sub;
    if (!userId) {
      throw new Error('User ID not found in token');
    }

    return generatePolicy(userId, 'Allow', event.methodArn, { userId });
  } catch (error) {
    console.error('Authorization failed:', error);
    throw new Error('Unauthorized');
  }
};

const generatePolicy = (
  principalId: string,
  effect: 'Allow' | 'Deny',
  resource: string,
  context?: Record<string, string>
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };
};
