let config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '.spec\\.(ts|js)x?$',
  coverageDirectory: 'coverage',
  modulePathIgnorePatterns: ['mocks'],
  coveragePathIgnorePatterns: ['mocks'],
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  coverageReporters: ['json', 'text', 'lcov', 'clover', 'cobertura'],
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter/dist',
      {
        pageTitle: 'Test Report',
        outputPath: '.reports/test-report.html'
      }
    ],
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        outputDirectory: '.reports',
        outputName: 'test-report.xml',
        uniqueOutputName: 'false',
        classNameTemplate: '{classname}-{title}',
        titleTemplate: '{classname}-{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true'
      }
    ]
  ]
}

const profile = process.env['JEST_PROFILE']

if (process.env['JEST_PROFILE']) {
  config = require(`./.jest/jest-${profile}.config`)
}

module.exports = config
