
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        buffer: require.resolve("buffer/")
      };
      return webpackConfig;
    }
  },
  fallback: {
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser")
  }
};