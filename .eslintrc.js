const path = require('path');

module.exports = {
  "extends": ["@uncinc/eslint-config"],
  "globals": {
    "strapi": true
  },
  "overrides": [
    {
      "files": [
        "**/*.cy.*",
        "./cypress/**/*.*"
      ],
      "extends": [
        "plugin:cypress/recommended"
      ],
      "parserOptions": {
        "project": [path.join(__dirname, './tsconfig.cypress.json')],
      }
    },
    {
      "files": [
        "**/*.test.*"
      ],
      "plugins": ["jest-dom"],
      "extends": [
        "plugin:jest/recommended",
        "plugin:jest-dom/recommended"
      ],
      "env": {
        "jest": true
      },
      "parserOptions": {
        "project": [path.join(__dirname, './tsconfig.jest.json')],
      },
      "rules": {
        "@typescript-eslint/await-thenable": "off"
      }
    }
  ],
  "rules": {
    "import/no-unresolved": [2, {
      "ignore": [
        "@strapi/strapi/admin",
        "@strapi/icons/symbols",
        "@strapi/admin/strapi-admin"
      ]
    }],
    "import/prefer-default-export": "off",
    "arrow-body-style": "off",
    "@typescript-eslint/unbound-method": "off"
  }
}
