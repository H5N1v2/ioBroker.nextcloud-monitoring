// This file extends the AdapterConfig type from "@iobroker/types"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            // Tab 1: Connection Settings
            servers: NextcloudServer[];
            
            // Tab 2: Data Options
            interval: number;
            skipApps: boolean;
            skipUpdate: boolean;
        }
e
        interface NextcloudServer {
            name: string;
            domain: string;
            token: string;
            createWidget?: boolean;
            widgetFontSize?: number;
            widgetDarkMode?: boolean;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};