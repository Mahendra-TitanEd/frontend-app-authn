import React from "react";
import {PLUGIN_OPERATIONS, DIRECT_PLUGIN} from "@openedx/frontend-plugin-framework";
import CustomMainApp from "./src/CustomMainApp";

const getPluginSlots = () => {
    return {
        authn_main_app_plugin_slot: {
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget:{
                        id: "authn_main_app_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: ()=>(
                            <CustomMainApp />
                        )
                    }
                }
            ]
        },
    }
}

const config = {
    ...process.env,
    get pluginSlots() {
        return getPluginSlots();
    }
}

export default config;