// Configuration for different environments
const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api',
  },
  prod: {
    apiUrl: 'https://ledgercreationserver.vercel.app/api',
  },
};

// Set this to 'prod' when building APK
export const environment = 'prod';

// Export the configuration based on environment
export const config = ENV[environment];
