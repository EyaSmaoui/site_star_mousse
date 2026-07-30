const express = require('express');
const router = express.Router();

const deliveryZones = [
  { region: 'Tunis', cost: 8, minDays: 1, maxDays: 2 },
  { region: 'Ariana', cost: 10, minDays: 2, maxDays: 3 },
  { region: 'Ben Arous', cost: 10, minDays: 2, maxDays: 3 },
  { region: 'Manouba', cost: 12, minDays: 2, maxDays: 4 },
  { region: 'Nabeul', cost: 15, minDays: 3, maxDays: 5 },
  { region: 'Sousse', cost: 18, minDays: 3, maxDays: 5 },
  { region: 'Monastir', cost: 20, minDays: 3, maxDays: 6 },
  { region: 'Mahdia', cost: 20, minDays: 4, maxDays: 6 },
  { region: 'Sfax', cost: 22, minDays: 4, maxDays: 6 },
  { region: 'Gabes', cost: 25, minDays: 4, maxDays: 7 },
  { region: 'Medenine', cost: 25, minDays: 5, maxDays: 7 },
  { region: 'Tataouine', cost: 28, minDays: 5, maxDays: 8 },
  { region: 'Gafsa', cost: 24, minDays: 5, maxDays: 7 },
  { region: 'Tozeur', cost: 26, minDays: 5, maxDays: 8 },
  { region: 'Kebili', cost: 26, minDays: 5, maxDays: 8 },
  { region: 'Sidi Bouzid', cost: 22, minDays: 5, maxDays: 7 },
  { region: 'Kairouan', cost: 20, minDays: 4, maxDays: 6 },
  { region: 'Kasserine', cost: 24, minDays: 5, maxDays: 7 },
  { region: 'Jendouba', cost: 22, minDays: 4, maxDays: 7 },
  { region: 'Le Kef', cost: 22, minDays: 4, maxDays: 7 },
  { region: 'Siliana', cost: 22, minDays: 4, maxDays: 7 },
  { region: 'Bizerte', cost: 18, minDays: 3, maxDays: 5 },
];

router.get('/', (req, res) => res.json(deliveryZones));
router.get('/:region', (req, res) => {
  const region = String(req.params.region || '').trim().toLowerCase();
  const zone = deliveryZones.find((item) => item.region.toLowerCase() === region);
  if (!zone) {
    return res.status(404).json({ message: 'Zone de livraison introuvable.' });
  }
  res.json(zone);
});

module.exports = router;
