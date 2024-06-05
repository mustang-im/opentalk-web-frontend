import convertToCamelCase from 'camelcase-keys';

import { removeTokens } from './utils';

export interface AuthAdapterConfiguration {
  authority: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  baseUrl: string;
  signOutRedirectUri: string;
}

export interface CodeResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  idToken: string;
  scope: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  idToken: string;
  scope: string;
}

export interface AuthenticationProviderUrls {
  authorizationEndpoint: string;
  endSessionEndpoint: string;
  revocationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  [key: string]: string | Record<string, string>;
}

/*  This class serves as an adapter for handling authentication.
	This class uses Singleton patern for initialization and should be initilized with
	getInstance method/
*/
export class AuthAdapter {
  private _configuration: AuthAdapterConfiguration;
  private _oidcConfiguration?: AuthenticationProviderUrls;
  private static _instance: AuthAdapter;

  private constructor(configuration: AuthAdapterConfiguration) {
    this._configuration = configuration;
  }

  public static getInstance(configuration: AuthAdapterConfiguration): AuthAdapter {
    if (!AuthAdapter._instance) {
      AuthAdapter._instance = new AuthAdapter(configuration);
    }
    return AuthAdapter._instance;
  }

  public async fetchOidcConfig() {
    try {
      const response = await fetch(new URL(`${this._configuration.authority}/.well-known/openid-configuration`));

      if (!response.ok) {
        throw `OIDC config not available. Status: ${response.status} ${response.statusText}`;
      }

      if (response.body === null) {
        throw `OIDC config empty. Response: ${response} (${response.status} ${response.statusText})`;
      }

      return convertToCamelCase(await response.json(), { deep: true });
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.debug('Syntax error during OIDC config fetch', error);
      }
      throw new Error(String(error));
    }
  }

  public getConfigurationEndpoints = async () => {
    if (!this._oidcConfiguration) {
      this._oidcConfiguration = await this.fetchOidcConfig();
    }
    return this._oidcConfiguration as AuthenticationProviderUrls;
  };

  public getBaseUrl() {
    return this._configuration.baseUrl;
  }

  public async getLoginUrl(codeChallenge?: string) {
    const { authorizationEndpoint } = await this.getConfigurationEndpoints();

    const authorizationEndpointURL = new URL(authorizationEndpoint);
    authorizationEndpointURL.searchParams.append('response_type', 'code');
    authorizationEndpointURL.searchParams.append('client_id', this._configuration.clientId);
    authorizationEndpointURL.searchParams.append('redirect_uri', this._configuration.redirectUri);
    authorizationEndpointURL.searchParams.append('scope', this._configuration.scope);

    if (codeChallenge) {
      authorizationEndpointURL.searchParams.append('code_challenge', codeChallenge);
      authorizationEndpointURL.searchParams.append('code_challenge_method', 'S256');
    }

    return authorizationEndpointURL;
  }

  public getSavedLocation = () => sessionStorage.getItem('saved_location') || undefined;
  public saveLocationForRedirect = (location: string) => sessionStorage.setItem('saved_location', location);

  /**
   * Redirect user to sign in provider
   */
  public async startOidcSignIn(redirectUrl = window.location.pathname, codeChallenge?: string) {
    this.saveLocationForRedirect(redirectUrl);
    window.location.replace(await this.getLoginUrl(codeChallenge));
  }

  public getAccessToken = () => localStorage.getItem('access_token');

  public getIdToken = () => localStorage.getItem('id_token');

  public async signOut(signOutUrl?: string): Promise<void> {
    const { endSessionEndpoint } = await this.getConfigurationEndpoints();
    const logoutUrl = new URL(endSessionEndpoint);
    logoutUrl.searchParams.append('client_id', this._configuration.clientId);

    const idToken = localStorage.getItem('id_token');
    if (idToken) {
      logoutUrl.searchParams.append('id_token_hint', idToken);
    }
    logoutUrl.searchParams.append(
      'post_logout_redirect_uri',
      signOutUrl ? signOutUrl : this._configuration.signOutRedirectUri
    );
    window.location.replace(logoutUrl);
    removeTokens();
  }
}
