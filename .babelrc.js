module.exports = {
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "env": {
    "test": {
      "plugins": ["istanbul"]
    }
  },
  "plugins": [
    ['babel-plugin-direct-import', { modules: ['@mui/material', '@mui/icons-material'] }],
  ],
}
