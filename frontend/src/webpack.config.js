const path = require('path');

module.exports = {
  entry: './src/index.js',  // Pointez vers votre fichier d'entrée frontend
  output: {
    filename: 'bundle.js',  // Nom du fichier de sortie
    path: path.resolve(__dirname, 'dist'),  // Dossier de sortie
  },
};