module.exports = {
  plugins: [
    require("autoprefixer"),
    require("postcss-clean"),
    require("cssnano")({
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true
          }
        }
      ]
    })
  ]
};
