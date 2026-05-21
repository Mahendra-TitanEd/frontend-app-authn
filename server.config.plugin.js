from tutor import hooks

hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-env-config-runtime-definitions-authn",
        """
// Runtime plugin configuration injected by Tutor (auth / login & registration overrides)

const { PLUGIN_OPERATIONS, DIRECT_PLUGIN } = await import('@openedx/frontend-plugin-framework');
const { default: CustomMainApp }         = await import('./src/CustomMainApp');

{% raw %}
const getPluginSlots = () => {
  return {
    authn_main_app_plugin_slot: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'authn_main_app_plugin_slot',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: () => <CustomMainApp />,
          },
        },
      ],
    },
  };
};

// Attach plugin slots to runtime config
config.pluginSlots = getPluginSlots();
{% endraw %}
"""
    )
)