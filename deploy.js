import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Liste des fichiers et dossiers à vérifier avant le déploiement
const filesToCheck = [
  'out',
  'public/api/contact.php',
  'public/.htaccess',
  '.env.local'
];

// Vérifier que tous les fichiers et dossiers nécessaires existent
console.log('Vérification des fichiers nécessaires pour le déploiement statique...');
let allFilesExist = true;

filesToCheck.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.error(`ERREUR: ${file} n'existe pas!`);
    allFilesExist = false;
  } else {
    console.log(`✓ ${file} trouvé`);
  }
});

if (!allFilesExist) {
  console.error('Certains fichiers nécessaires sont manquants. Veuillez les créer avant de déployer.');
  process.exit(1);
}

console.log('\nTous les fichiers nécessaires sont présents.');
console.log('\nÉtapes pour déployer sur OVH:');
console.log('1. Connectez-vous à votre hébergement OVH via FTP');
console.log('2. Transférez le contenu du dossier "out" vers votre serveur');
console.log('3. Assurez-vous que le fichier .htaccess est correctement transféré');
console.log('4. Transférez également le fichier .env.local et le dossier public/api');
console.log('\nNote: Votre site est maintenant statique et peut être hébergé sur n\'importe quel serveur web PHP.');
