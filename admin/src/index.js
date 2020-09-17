import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import SettingsPage from './containers/Settings';
import Initializer from './containers/Initializer';
import lifecycles from './lifecycles';
import trads from './translations';
import { getTrad } from './utils';

export default strapi => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    leftMenuLinks: [],
    leftMenuSections: [],
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    settings: {
      global: {
        links: [
          {
            title: {
              id: getTrad('plugin.name'),
              defaultMessage: 'Responsive image',
            },
            name: 'responsive-image',
            to: `${strapi.settingsBaseURL}/responsive-image`,
            Component: SettingsPage,
          },
        ],
      },
    },
    trads,
  };

  return strapi.registerPlugin(plugin);
};
