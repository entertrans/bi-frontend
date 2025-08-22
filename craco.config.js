// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore warnings untuk html2pdf.js
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        { 
          module: /html2pdf\.js/, 
          message: /Failed to parse source map/ 
        }
      ];
      return webpackConfig;
    }
  }
};