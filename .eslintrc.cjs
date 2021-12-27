module.exports = {
    extends: ['airbnb-typescript/base'],
    parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['import'],
    rules: {
        indent: 'off',
        '@typescript-eslint/no-shadow': ['error', { allow: ['userName'] }],
        '@typescript-eslint/no-unused-expressions': [
            'error',
            { allowTernary: true, allowShortCircuit: true },
        ],
        '@typescript-eslint/indent': ['error', 4],
        'no-underscore-dangle': ['error'],
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'import/no-cycle': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'max-len': [
            'error',
            {
                code: 150,
                tabWidth: 2,
                ignoreRegExpLiterals: true,
            },
        ],
    },
};
