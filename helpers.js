"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePluginOptions = void 0;
function validatePluginOptions(pluginOptions) {
    if (pluginOptions.entry == null) {
        throw new Error('gatsby-plugin-webpack-entry: Missing required option "entry". https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options');
    }
    if (typeof pluginOptions.entry !== 'object' || Object.keys(pluginOptions.entry).length === 0) {
        throw new Error('gatsby-plugin-webpack-entry: Option "entry" must be a non empty object. https://github.com/itmayziii/gatsby-plugin-webpack-entry#available-options');
    }
    return true;
}
exports.validatePluginOptions = validatePluginOptions;
//# sourceMappingURL=helpers.js.map