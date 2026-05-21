// chatbot.engine.js
const utils = require('./chatbot.utils');

const PRODUCT_CATALOG = [
  {
    id: "soft-plus",
    name: "Soft Plus",
    category: "orthopedique",
    tags: ["orthopedique", "soft plus", "venise plus", "ortho", "dhar", "dos"],
    price: 310
  },
  {
    id: "venise-plus",
    name: "Venise Plus",
    category: "orthopedique",
    tags: ["orthopedique", "venise plus", "soft plus", "ortho", "dhar", "dos"],
    price: 380
  },
  {
    id: "medico-plus",
    name: "Medico Plus",
    category: "orthomedical",
    tags: ["orthomedical", "orthomedicale", "medico plus", "medico"],
    price: 520
  },
  {
    id: "relax-plus",
    name: "Relax Plus",
    category: "ergonomique",
    tags: ["ergonomique", "haut gamme", "haut de gamme", "relax plus", "relax", "premium", "luxe"],
    price: 580
  },
  {
    id: "tendresse-plus",
    name: "Tendresse Plus",
    category: "ergonomique",
    tags: ["ergonomique", "haut gamme", "haut de gamme", "tendresse plus", "tendresse", "premium", "luxe"],
    price: 650
  }
];

const INTENTS = [
  {
    tag: "salutation",
    patterns: ["bonjour", "salut", "aslema", "ahla"],
    response: "Aslema, ena Dali mte3 Star Mousse. 9olli chniya l 9yes (dimension) lli 7achtek biha ?"
  },
  {
    tag: "gamme_orthomedical",
    patterns: ["orthomedical", "orthomedicale", "medico plus", "medico"],
    response: "La gamme orthomédicale contient Medico Plus."
  },
  {
    tag: "gamme_orthopedique",
    patterns: ["orthopedique", "ortho", "venise plus", "soft plus", "dhar", "dos"],
    response: "La gamme orthopédique contient Soft Plus et Venise Plus."
  },
  {
    tag: "gamme_ergonomique",
    patterns: ["ergonomique", "haut gamme", "haut de gamme", "relax plus", "tendresse plus", "relax", "tendresse", "premium", "luxe"],
    response: "La gamme ergonomique haut de gamme contient Relax Plus et Tendresse Plus."
  }
];

function predictIntent(message) {
  const text = utils.normalizeText(message);
  const dim = utils.extractDimension(text);

  if (dim) return { tag: "dimension_captured", value: dim };
  for (let intent of INTENTS) {
    if (intent.patterns.some(p => text.includes(p))) return { tag: intent.tag };
  }
  return { tag: "fallback" };
}

function buildChatReply(message) {
  const intent = predictIntent(message);

  if (intent.tag === "dimension_captured") {
    return {
      response: `9yes ${intent.value} mrigel ! Chnowa t7eb l gamme : Orthopédique, Orthomédicale, wala Ergonomique haut de gamme ?`
    };
  }

  const found = INTENTS.find(i => i.tag === intent.tag);
  return {
    response: found
      ? found.response
      : "Sam7ni, ma fhimtech. 9olli t7eb gamme Orthopédique, Orthomédicale wela Ergonomique haut de gamme ?"
  };
}

module.exports = { buildChatReply, PRODUCT_CATALOG };