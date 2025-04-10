module.exports = {
    moduleNameMapper: {
      "^react-router-dom$": "<rootDir>/node_modules/react-router-dom",
      "^axios$": "axios/dist/node/axios.cjs"
    },
    transformIgnorePatterns: ["node_modules/(?!axios)"]
  };