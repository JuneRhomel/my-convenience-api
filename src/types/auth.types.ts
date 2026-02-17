/** Request body for email/password login. */
export interface LoginRequestBody {
    email: string;
    password: string;
}

/** Request body for email/password sign-up. */
export interface SignUpRequestBody {
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

/** Request body for Google login/sign-up. */
export interface GoogleAuthRequestBody {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
}

/** User data returned in API responses (no password). */
export interface SafeUserResponse {
    id: number;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    createdAt: Date;
    updatedAt: Date;
}

/** Response body for login and loginWithGoogle (user + tokens). */
export interface AuthTokenResponse {
    user: SafeUserResponse;
    accessToken: string;
    refreshToken: string;
}

/** Request body for refresh token endpoint. */
export interface RefreshTokenRequestBody {
    refreshToken: string;
}
