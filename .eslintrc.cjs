module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 13,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        indent: "off",
        "@typescript-eslint/indent": ["error", 4],
        "no-underscore-dangle": ["error", { allow: ["_id"] }],
        "import/prefer-default-export": "off",
        "import/no-cycle": "off",
        "import/no-named-as-default": "off",
        "import/no-named-as-default-member": "off",
        "max-len": [
            "error",
            {
                code: 150,
                tabWidth: 2,
                ignoreRegExpLiterals: true,
            },
        ],
    },
};
