export type App = {
  registerPlugin: (plugin: {
    [key: string]: any;
  }) => void;
  createSettingSection: (id: any, sections: any[]) => void;

  injectContentManagerComponent: (a: string, b: string, ...args: any[]) => void;

  getPlugin: (name: string) => null | undefined | {
    [key: string]: any;
  };

  [key: string]: any;
};
