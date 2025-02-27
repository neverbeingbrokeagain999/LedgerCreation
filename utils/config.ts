// Configuration for different environments
const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api',
  },
  prod: {
    apiUrl: 'https://ledgercreationserver.vercel.app/api',
  },
};

// Determine environment based on the build type
const environment = __DEV__ ? 'dev' : 'prod';

// Export the configuration based on environment
export const config = ENV[environment];

// For debugging
if (__DEV__) {
  console.log('Running in development mode');
  console.log('API URL:', config.apiUrl);
} else {
  console.log('Running in production mode');
  console.log('API URL:', config.apiUrl);
}
