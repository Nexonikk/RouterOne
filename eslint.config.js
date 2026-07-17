import js from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import next from "@next/eslint-plugin-next"
import prettier from "eslint-config-prettier"

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, prettier, {
    plugins: {
        react,
        "react-hooks": reactHooks,
        "@next/next": next,
    },

    rules: {
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            },
        ],

        "@typescript-eslint/no-explicit-any": "warn",

        "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",

        "@typescript-eslint/no-namespace": "off",

        "@next/next/no-img-element": "off",

        // Add this
        "padding-line-between-statements": [
            "error",
            {
                blankLine: "always",
                prev: "function",
                next: "*",
            },
            {
                blankLine: "always",
                prev: "*",
                next: "function",
            },
        ],
    },

    settings: {
        react: {
            version: "detect",
        },
    },
})
