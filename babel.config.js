module.exports = {
    presets: [
        ['@babel/preset-env', {targets: {node: 'current'}}],
        '@babel/preset-typescript',
        '@babel/preset-react'
    ],
    plugins: [
        'inline-react-svg'
    ]
};
