module.exports = {
  "presets": [
    ["@babel/preset-env", { targets: { node: 'current' } }],
    ["@babel/preset-react",  { runtime: 'automatic' }],
  ],
  "env": {
    "development": {
      "plugins": [
        ['babel-plugin-direct-import', { modules: ['@mui/material', '@mui/icons-material'] }],
      ],          
    },
    "production": {
      "plugins": [
        ['babel-plugin-direct-import', { modules: ['@mui/material', '@mui/icons-material'] }],
      ],    
    }
  }
}
