export default {
  testEnvironment: "jsdom",
  // setupFilesAfterEnv: ["./jest.setup.mjs"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx)$": [
      "babel-jest",
      { presets: ["@babel/preset-env", "@babel/preset-react"] },
    ],
    "^.+\\.(ts|tsx)$": [
      "babel-jest",
      { presets: ["@babel/preset-env", "@babel/preset-typescript"] },
    ], // If using TypeScript
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)", // Include 'axios' in the transformation process
  ],
};
