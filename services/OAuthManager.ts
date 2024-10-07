// src/OAuthManager.js

import OAuth from "oauth-1.0a";
import axios, { AxiosError, AxiosResponse, Method } from "axios";
import CryptoJS from "crypto-js";
import "react-native-url-polyfill/auto"; // Polyfill for URLSearchParams in React Native
import { SecureKeyStore } from "./SecureKeyStore";
import { CustomKeyType, CustomResponse, StatusType } from "@/types/types";
import Constants from "expo-constants";

type Token = { oauth_token: string; oauth_token_secret: string };

export default class OAuthManager {
  private oauth: OAuth;
  private token: Token | undefined;
  private callback_url: string;
  private o19_api_base_url: string;
  constructor() {
    let client_key = SecureKeyStore.getKey(CustomKeyType.CLIENT_KEY);
    let client_secret = SecureKeyStore.getKey(CustomKeyType.CLIENT_SECRET);
    let o19_api_base_url = `${SecureKeyStore.getKey(
      CustomKeyType.O19_BASE_URL
    )}/ws`;
    let callback_url = Constants.experienceUrl;

    if (!client_key || !client_secret) {
      throw new Error("Client key or secret not found");
    }

    if (!callback_url) {
      throw new Error("Callback URL not found");
    }

    if (!o19_api_base_url) {
      throw new Error("O19 API base URL not found");
    }

    this.oauth = new OAuth({
      consumer: { key: client_key, secret: client_secret },
      signature_method: "HMAC-SHA1",
      hash_function(base_string, key) {
        return CryptoJS.HmacSHA1(base_string, key).toString(
          CryptoJS.enc.Base64
        );
      },
    }); // This will store your request and access tokens
    this.callback_url = callback_url;
    this.o19_api_base_url = o19_api_base_url;
  }

  // Helper function to get the headers for the request
  getHeaders(request_data: OAuth.RequestOptions, token?: Token) {
    if (!token) {
      return this.oauth.toHeader(this.oauth.authorize(request_data));
    }
    return this.oauth.toHeader(
      this.oauth.authorize(request_data, {
        key: token.oauth_token,
        secret: token.oauth_token_secret,
      })
    );
  }

  // Helper function to parse the response from O19
  parseResponse(response: AxiosResponse): Token {
    const params = new URLSearchParams(response.data);
    return {
      oauth_token: params.get("oauth_token") || "",
      oauth_token_secret: params.get("oauth_token_secret") || "",
    };
  }

  parseError(error: AxiosError): CustomResponse {
    if (error.response) {
      return {
        status: StatusType.ERROR,
        message: `${error.code} ${
          (error.response.data as { message: string }).message ||
          `Unknown server error`
        }`,
      };
    } else if (error.request) {
      return {
        status: StatusType.ERROR,
        message: "No response received from server",
      };
    } else {
      return {
        status: StatusType.ERROR,
        message: error.message || "Unknown error occurred",
      };
    }
  }

  // Step 1: Get the Request Token from O19
  async getRequestToken(): Promise<CustomResponse> {
    const request_data = {
      url: `${this.o19_api_base_url}/oauth/initiate`,
      method: "POST",
      data: {
        oauth_callback: this.callback_url,
      },
    };

    try {
      const headers = this.getHeaders(request_data);
      const response = await axios.post(
        request_data.url,
        {},
        { headers: { ...headers } }
      );

      this.token = this.parseResponse(response);
      return { status: StatusType.SUCCESS, message: "Token Received" };
    } catch (error) {
      return this.parseError(error as AxiosError);
    }
  }

  // Step 2: Get the Authorization URL to redirect the user to O19 for authorization
  getAuthorizationUrl() {
    if (!this.token?.oauth_token) {
      throw new Error("Request token not found");
    }
    return `${this.o19_api_base_url}/oauth/authorize?oauth_token=${this.token?.oauth_token}`;
  }

  // Step 3: Exchange the request token for an access token
  async getAccessToken(oauth_verifier: string): Promise<CustomResponse> {
    const request_data = {
      url: `${this.o19_api_base_url}/oauth/token`,
      method: "POST",
      data: {
        oauth_token: this.token?.oauth_token,
        oauth_verifier,
      },
    };

    try {
      const headers = this.getHeaders(request_data, this.token);
      const response = await axios.post(
        request_data.url,
        {},
        { headers: { ...headers } }
      );
      const { oauth_token, oauth_token_secret } = this.parseResponse(response);
      SecureKeyStore.saveKey(CustomKeyType.ACCESS_TOKEN, oauth_token);
      SecureKeyStore.saveKey(CustomKeyType.SECRET_KEY, oauth_token_secret);
      return { status: StatusType.SUCCESS, message: "Access Token Received" };
    } catch (error) {
      return this.parseError(error as AxiosError);
    }
  }

  // Make authorized API requests using the access token
  async makeAuthorizedRequest(
    method: Method,
    endpoint: string,
    data?: any
  ): Promise<CustomResponse> {
    const request_data = {
      url: `${this.o19_api_base_url}/services/${endpoint}`,
      method: method,
    };

    try {
      const headers = this.getHeaders(request_data, {
        oauth_token: SecureKeyStore.getKey(CustomKeyType.ACCESS_TOKEN) || "",
        oauth_token_secret:
          SecureKeyStore.getKey(CustomKeyType.SECRET_KEY) || "",
      });

      const response = await axios.request({
        ...request_data,
        data,
        headers: { ...headers },
      });

      return {
        status: StatusType.SUCCESS,
        message: "Request Succeded",
        data: response.data,
      };
    } catch (error) {
      return this.parseError(error as AxiosError);
    }
  }
}
