import { Injectable } from '@nestjs/common';
import { KeycloakConnectOptions, KeycloakConnectOptionsFactory, PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';

@Injectable()
export class KeycloakService implements KeycloakConnectOptionsFactory{

    createKeycloakConnectOptions(): KeycloakConnectOptions {
        return {
            authServerUrl: process.env.KEYCLOAK_SERVER,
            realm: 'ciudad-inteligente-realm',
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            secret: process.env.KEYCLOAK_SECRET,
            cookieKey: 'KEYCLOAK_JWT',
            logLevels: ['verbose'],
            useNestLogger: true,
            policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
            tokenValidation: TokenValidation.ONLINE,
          };
    }
}
