export interface FrontendTemplate {
    name: string;
    version: string;
    icon: string;
    port: number;
    type: "frontend";
}

export interface BackendTemplate {
    name: string;
    version: string;
    icon: string;
    port: number;
    type: "backend";
}