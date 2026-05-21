const { PRODUCT_CATALOG } = require('../services/recommendationEngine');

function normalizeDimension(dimension=''){
  return String(dimension).toLowerCase().replace(/\s*[xX\*\/\/]\s*/g,'x');
}

function findVariantPrice(productId, dimension){
  const norm = normalizeDimension(dimension);
  const item = PRODUCT_CATALOG.find(p=>p.id===productId);
  if(!item) return null;
  if(Array.isArray(item.variants)){
    const v = item.variants.find(vv=>String(vv.dimension).toLowerCase()===norm);
    if(v) return v.price;
  }
  return item.price;
}

['soft-plus','venise-plus','medico-plus'].forEach(id=>{
  console.log(id, '160x190 =>', findVariantPrice(id, '160x190'));
});
