const { join } = require('path')
const node_modules = join(process.cwd(), 'node_modules')

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: 'unit\\.spec\\.(ts|js)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  coverageReporters: ['json', 'text', 'lcov', 'clover', 'coverage'],
  reporters: [
    'default',
    [
      join(node_modules, '/jest-html-reporter/dist'),
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
