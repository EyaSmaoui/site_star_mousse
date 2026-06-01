const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Couleurs pour le terminal
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

async function testChatbotAPI() {
  console.log(`\n${colors.blue}=== TEST API CHATBOT ===\n${colors.reset}`);

  const testMessages = [
    { message: 'Bonjour', userId: 'test_user_001' },
    { message: '160x190', userId: 'test_user_001' },
    { message: 'orthopedique', userId: 'test_user_001' },
    { message: 'Combien coûte?', userId: 'test_user_001' },
    { message: 'Livraison', userId: 'test_user_002' },
    { message: 'Paiement à la livraison?', userId: 'test_user_002' },
  ];

  for (const testData of testMessages) {
    try {
      console.log(`${colors.yellow}➡️  Envoi:${colors.reset} "${testData.message}"`);
      const response = await axios.post(`${BASE_URL}/chat`, testData);
      console.log(`${colors.green}✓ Réponse:${colors.reset}`);
      console.log(`  - Intent: ${response.data.intent || 'N/A'}`);
      console.log(`  - Message: ${response.data.response || 'N/A'}`);
      console.log(`${colors.blue}─────────────────────────────────────\n${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}✗ Erreur: ${error.message}${colors.reset}\n`);
    }
  }
}

async function testProductsAPI() {
  console.log(`\n${colors.blue}=== TEST API PRODUITS ===\n${colors.reset}`);

  try {
    const response = await axios.get(`${BASE_URL}/products`);
    console.log(`${colors.green}✓ Produits récupérés:${colors.reset}`);
    console.log(`  Nombre: ${response.data.length || 'N/A'}`);
    console.log(`  Catégories: ${JSON.stringify(response.data.slice(0, 2), null, 2)}`);
  } catch (error) {
    console.error(`${colors.red}✗ Erreur: ${error.message}${colors.reset}`);
  }
}

async function runAllTests() {
  try {
    // Vérifier la connexion au serveur
    await axios.get(`${BASE_URL}/health`).catch(() => {
      // Endpoint peut ne pas exister, c'est ok
    });
    
    await testChatbotAPI();
    await testProductsAPI();

    console.log(`\n${colors.green}=== TESTS TERMINÉS ✓ ===${colors.reset}\n`);
  } catch (error) {
    console.error(
      `${colors.red}Erreur de connexion au serveur:${colors.reset}\n` +
      `Assurez-vous que le backend tourne sur le port 5000\n` +
      `${error.message}`
    );
  }
}

runAllTests();
