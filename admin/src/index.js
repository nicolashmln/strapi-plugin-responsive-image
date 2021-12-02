import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import pluginPermissions from './permissions';
import { getTrad } from './utils';
import { prefixPluginTranslations } from '@strapi/helper-plugin';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.registerPlugin({
      id: pluginId,
      name,
    })
  },
  bootstrap(app) {
    app.addSettingsLink(
      'global',
      {
        intLabel: { id: getTrad('plugin.name'), defaultMessage: 'Responsive image' },
        id: 'responsive-image',
        to: '/settings/responsive-image',
        Component: async () => {
          const component = await import(
            /* webpackChunkName: "responsive-image-settings-page" */ './containers/Settings'
          );

          return component;
        },
        permissions: pluginPermissions.settings
      }
    );
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(
          /* webpackChunkName: "responsive-image-translations-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  }
}
