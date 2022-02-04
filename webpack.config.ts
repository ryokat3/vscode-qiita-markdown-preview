import { RuleSetRule, ModuleOptions, Configuration } from "webpack"
import * as path from "path"

const rules: RuleSetRule[] = [
    {
        test: /\.ts$/,
        exclude: /node_modules/,	    
        use: [
            {
                loader: "ts-loader"
            }
        ]
    }
]

const moduleOptions: ModuleOptions = {
    rules: rules
}

const commonConfig: Configuration = {    
    module: moduleOptions,
    mode: 'development',
    devtool: "source-map",
    target: "node",
    externals: {
        vscode: "commonjs vscode"
    },
    resolve: {                
        extensions: ['.ts', '.js']
    }
}

const commonOutputConfig: Configuration['output'] = {
    path: path.join(__dirname, "out"),
    libraryTarget: 'commonjs2',
    devtoolFallbackModuleFilenameTemplate: '../[resource-path]'
}

const qiitaMarkdownPreviewConfig: Configuration = {
    ...commonConfig,
    entry: "./src/extension.ts",    
    output: {
        ...commonOutputConfig,
        filename: 'extension.js',
    }
}

export default [qiitaMarkdownPreviewConfig]
