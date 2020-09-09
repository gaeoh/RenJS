import Config = Phaser.Core.Config;
// eslint-disable-next-line @typescript-eslint/class-name-casing
export interface i18nInterface {
    langs: string[];
    path: string;
    format: string;
    w: number;
    h: number;
    current?: string;
}

export interface RJSGameConfig extends Config {
    name: string;
    w: number;
    h: number;
    splash: {
        loadingScreen: string;
        loadingBar: {
            asset: string;
            position: {
                x: number;
                y: number;
            };
            size: {
                w: number;
                h: number;
            };
            fullBar?: string;
        };
    };
    logChoices: boolean;
    fonts: string;
    guiConfig: string;
    storySetup: string;
    storyText: string[];
    i18n?: i18nInterface;
}
