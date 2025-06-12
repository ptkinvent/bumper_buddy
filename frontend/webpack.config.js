const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, '../static/assets/js/'),
        filename: 'main.js',
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                include: [
                    path.resolve(__dirname, 'src'),
                ],
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                'targets': 'defaults'
                            }],
                            '@babel/preset-react'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
    ]
}
