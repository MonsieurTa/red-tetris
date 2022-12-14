module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  moduleDirectories: [
    'node_modules',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/client/**/*.{js,jsx}',
    'src/server/**/*.js',
  ],
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'text-summary'],
};
