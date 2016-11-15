module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        // browsers: ['PhantomJS'],
        browsers: ['Chrome'],
        plugins: [
            'karma-jasmine',
            'karma-webpack',
            'karma-chrome-launcher'
        ],
        files: [
            'src/**/*.spec.ts'
        ],
        exclude: [],
        preprocessors: {
            '**/*.spec.ts': ['webpack'],
            '**/*.ts': ['webpack']
        }
    });
};
