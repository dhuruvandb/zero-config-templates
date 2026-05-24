export interface JwtPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

export interface User {
    id: string;
    email: string;
    password: string;
    refreshTokens: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Item {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthResponse {
    accessToken: string;
}

export interface RegisterBody {
    email: string;
    password: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface CreateItemBody {
    name: string;
}