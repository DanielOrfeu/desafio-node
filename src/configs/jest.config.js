export const JestConfig = () => {
    return {
        testEnviroment: 'node',
        testMatch: [
            '**/__tests__/**/*.js',
            '**/?(*.)+(spec|test).js'
        ]
    }
}