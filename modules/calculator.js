/**
 * ELECTROPLAN.AEA - Módulo de Cálculos Eléctricos Reglamentarios
 * Basado en la reglamentación AEA 90364 (Argentina) y guías asociadas (AEA 770).
 */

// Secciones nominales normalizadas en Argentina (mm²)
export const SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95];

// Resistividad del Cobre a temperatura de servicio de 70°C (PVC)
// En Argentina se suele utilizar rho = 0.0225 Ohm*mm²/m para condiciones de carga
export const RHO_COPPER = 0.0225; 
// Reactancia lineal estándar (Ohm/m) - Generalmente 0.00008 Ohm/m (0.08 Ohm/km)
export const XL_REACTANCE = 0.00008;

// Diámetros externos aproximados de conductores de cobre unipolares IRAM NM 247-3 (en mm)
// Utilizados para el cálculo de sección ocupada en cañerías.
export const CABLE_DIAMETERS = {
  1.5: 3.0,
  2.5: 3.7,
  4.0: 4.2,
  6.0: 4.8,
  10.0: 6.3,
  16.0: 7.4,
  25.0: 9.2,
  35.0: 10.5,
  50.0: 12.5,
  70.0: 14.5,
  95.0: 17.0
};

// Capacidad de corriente admisible (Iz) en Amperes a 30°C en aire (para B1/B2) o 25°C en tierra (para D)
// Valores correspondientes a cables de cobre con aislamiento de PVC (70°C)
// Fuente: AEA 90364-5-523 / AEA 770
export const IZ_TABLE = {
  // Método B1/B2: Conductores unipolares en cañería embutida o a la vista
  "conduit": {
    "monofasico": { // 2 conductores cargados
      1.5: 15,
      2.5: 21,
      4.0: 28,
      6.0: 36,
      10.0: 50,
      16.0: 66,
      25.0: 88,
      35.0: 109,
      50.0: 131,
      70.0: 167,
      95.0: 202
    },
    "trifasico": { // 3 conductores cargados
      1.5: 13,
      2.5: 18,
      4.0: 24,
      6.0: 31,
      10.0: 43,
      16.0: 57,
      25.0: 75,
      35.0: 93,
      50.0: 110,
      70.0: 141,
      95.0: 170
    }
  },
  // Método F/E: Bandeja portacables perforada
  "tray": {
    "monofasico": { // 2 conductores cargados
      1.5: 18.5,
      2.5: 25,
      4.0: 34,
      6.0: 43,
      10.0: 60,
      16.0: 80,
      25.0: 106,
      35.0: 131,
      50.0: 159,
      70.0: 202,
      95.0: 244
    },
    "trifasico": { // 3 conductores cargados
      1.5: 15.5,
      2.5: 21,
      4.0: 28,
      6.0: 36,
      10.0: 50,
      16.0: 67,
      25.0: 89,
      35.0: 110,
      50.0: 134,
      70.0: 171,
      95.0: 207
    }
  },
  // Método D: Conductores enterrados (subterráneo IRAM 2178 a 25°C en tierra)
  "underground": {
    "monofasico": {
      1.5: 29,
      2.5: 38,
      4.0: 49,
      6.0: 61,
      10.0: 81,
      16.0: 104,
      25.0: 135,
      35.0: 161,
      50.0: 191,
      70.0: 234,
      95.0: 280
    },
    "trifasico": {
      1.5: 24,
      2.5: 32,
      4.0: 42,
      6.0: 52,
      10.0: 70,
      16.0: 90,
      25.0: 115,
      35.0: 139,
      50.0: 164,
      70.0: 203,
      95.0: 242
    }
  }
};

// Factores de corrección por temperatura ambiente para cables de PVC (Temp base 30°C en aire, 25°C en tierra)
export const TEMP_CORRECTION = {
  "air": { // Para cañería y bandeja
    10: 1.22,
    15: 1.17,
    20: 1.12,
    25: 1.06,
    30: 1.00,
    35: 0.94,
    40: 0.87,
    45: 0.79,
    50: 0.71,
    55: 0.61,
    60: 0.50
  },
  "ground": { // Para subterráneo enterrado
    10: 1.15,
    15: 1.10,
    20: 1.05,
    25: 1.00,
    30: 0.94,
    35: 0.88,
    40: 0.82,
    45: 0.75,
    50: 0.67
  }
};

// Factores de corrección por agrupamiento de circuitos (conductores cargados en el mismo conducto)
// Fuente: AEA 90364-5-523 Tabla 52-C1
export const GROUPING_CORRECTION = {
  1: 1.00,
  2: 0.80,
  3: 0.70,
  4: 0.65,
  5: 0.60,
  6: 0.57,
  7: 0.54,
  8: 0.52,
  9: 0.50,
  12: 0.45
};

// Base de datos de cañerías comerciales (dimensiones internas en mm)
// Secciones útiles basadas en catálogo estándar (RL = Rígido Liviano, RS = Rígido Semipesado, COR = Corrugado)
export const CONDUITS = {
  "corrugado": [
    { name: "Corrugado 5/8\" (16mm)", extDia: 16.0, intDia: 11.2 },
    { name: "Corrugado 3/4\" (20mm)", extDia: 20.0, intDia: 14.8 },
    { name: "Corrugado 7/8\" (22mm)", extDia: 22.0, intDia: 16.2 },
    { name: "Corrugado 1\" (25mm)", extDia: 25.0, intDia: 18.7 },
    { name: "Corrugado 1 1/4\" (32mm)", extDia: 32.0, intDia: 24.2 },
    { name: "Corrugado 1 1/2\" (40mm)", extDia: 40.0, intDia: 31.0 },
    { name: "Corrugado 2\" (50mm)", extDia: 50.0, intDia: 39.6 }
  ],
  "rl": [
    { name: "PVC Rígido RL16 (5/8\")", extDia: 15.9, intDia: 13.9 },
    { name: "PVC Rígido RL19 (3/4\")", extDia: 19.0, intDia: 16.8 },
    { name: "PVC Rígido RL22 (7/8\")", extDia: 22.2, intDia: 19.8 },
    { name: "PVC Rígido RL25 (1\")", extDia: 25.4, intDia: 22.8 },
    { name: "PVC Rígido RL32 (1 1/4\")", extDia: 31.8, intDia: 29.0 },
    { name: "PVC Rígido RL38 (1 1/2\")", extDia: 38.1, intDia: 35.0 },
    { name: "PVC Rígido RL51 (2\")", extDia: 50.8, intDia: 47.2 }
  ],
  "rs": [
    { name: "Hierro Semipesado RS16", extDia: 15.9, intDia: 12.9 },
    { name: "Hierro Semipesado RS19", extDia: 19.0, intDia: 15.8 },
    { name: "Hierro Semipesado RS22", extDia: 22.2, intDia: 18.8 },
    { name: "Hierro Semipesado RS25", extDia: 25.4, intDia: 21.8 },
    { name: "Hierro Semipesado RS32", extDia: 31.8, intDia: 28.0 },
    { name: "Hierro Semipesado RS38", extDia: 38.1, intDia: 34.0 },
    { name: "Hierro Semipesado RS51", extDia: 50.8, intDia: 46.2 }
  ]
};

// Sección mínima según el tipo de aplicación (AEA 770 / 90364-5-52)
export const MIN_SECTION_BY_APP = {
  "lighting": 1.5,      // Circuitos de iluminación (IUG / IUE)
  "power": 2.5,         // Circuitos de tomacorrientes (TUG / TUE)
  "special": 2.5,       // Uso especial (TUE / APM)
  "main": 4.0           // Líneas principales y seccionales
};

/**
 * Calcula la sección óptima de un conductor según corriente, caída de tensión y límites normativos.
 * @param {Object} params Parámetros de cálculo
 * @returns {Object} Resultado del cálculo
 */
export function calculateConductor({
  loadType = 'power', // 'power' para kW, 'current' para Amperes
  loadValue = 10,     // Valor de potencia o corriente
  voltage = 220,      // 220 o 380 V
  cosPhi = 0.85,      // Factor de potencia
  length = 20,        // Longitud en metros
  method = 'conduit', // 'conduit', 'tray', 'underground'
  temp = 30,          // Temp ambiente
  circuits = 1,       // Circuitos agrupados
  appType = 'power',  // 'lighting', 'power', 'special', 'main'
  vDropLimit = null   // Límite de caída (por defecto 3% iluminación, 5% otros)
}) {
  // 1. Determinar corriente de proyecto (Ib)
  let Ib = 0;
  let powerkW = 0;
  
  const isTrifasico = (voltage === 380);

  if (loadType === 'power') {
    powerkW = loadValue;
    const powerW = powerkW * 1000;
    if (isTrifasico) {
      // Trifásico: P = V * I * sqrt(3) * cosPhi
      Ib = powerW / (Math.sqrt(3) * voltage * cosPhi);
    } else {
      // Monofásico: P = V * I * cosPhi
      Ib = powerW / (voltage * cosPhi);
    }
  } else {
    Ib = loadValue;
    // P = V * I * (sqrt(3) si es trifásico) * cosPhi
    if (isTrifasico) {
      powerkW = (Math.sqrt(3) * voltage * Ib * cosPhi) / 1000;
    } else {
      powerkW = (voltage * Ib * cosPhi) / 1000;
    }
  }

  // Límite de caída de tensión reglamentario
  const resolvedVDropLimit = vDropLimit || (appType === 'lighting' ? 3.0 : 5.0);

  // 2. Obtener factores de corrección
  const isAir = (method !== 'underground');
  const tempCorrectionMap = isAir ? TEMP_CORRECTION.air : TEMP_CORRECTION.ground;
  
  // Buscar temperatura más cercana disponible en tabla
  const availableTemps = Object.keys(tempCorrectionMap).map(Number);
  const closestTemp = availableTemps.reduce((prev, curr) => 
    Math.abs(curr - temp) < Math.abs(prev - temp) ? curr : prev
  );
  const ft = tempCorrectionMap[closestTemp] || 1.0;

  // Factor de agrupamiento
  let fg = 1.0;
  if (circuits >= 9) fg = GROUPING_CORRECTION[9];
  else if (circuits >= 5) fg = GROUPING_CORRECTION[5];
  else fg = GROUPING_CORRECTION[circuits] || 1.0;

  const totalCorrectionFactor = ft * fg;

  // 3. Evaluar secciones nominales secuencialmente
  let recommendedSection = SECTIONS[0];
  let finalIz = 0;
  let finalIzBase = 0;
  let finalVDrop = 0;
  let finalVDropPercent = 0;
  let sectionMetCriteria = false;

  const phaseType = isTrifasico ? 'trifasico' : 'monofasico';
  const minSection = MIN_SECTION_BY_APP[appType] || 1.5;

  for (let s of SECTIONS) {
    if (s < minSection) continue; // Saltar secciones menores a la permitida por uso

    // Capacidad de corriente base (Iz base a 30°C / 25°C)
    const izBase = IZ_TABLE[method][phaseType][s];
    // Capacidad de corriente corregida por temperatura y agrupamiento (Iz admisible)
    const izCorrected = izBase * totalCorrectionFactor;

    // Verificar criterio térmico: Iz >= Ib
    if (izCorrected < Ib) continue;

    // Calcular caída de tensión para esta sección
    // Usamos el método de impedancia simplificada: R = rho / S, X = XL_REACTANCE
    const R = RHO_COPPER / s;
    const X = XL_REACTANCE;
    const sinPhi = Math.sin(Math.acos(cosPhi));
    
    // Caída de tensión unitaria en V/A*m
    // Monofásica: dV = 2 * L * Ib * (R * cosPhi + X * sinPhi)
    // Trifásica: dV = sqrt(3) * L * Ib * (R * cosPhi + X * sinPhi)
    const multiplier = isTrifasico ? Math.sqrt(3) : 2.0;
    const vDrop = multiplier * length * Ib * (R * cosPhi + X * sinPhi);
    const vDropPercent = (vDrop / voltage) * 100;

    // Verificar criterio de caída de tensión: DV% <= limite
    if (vDropPercent <= resolvedVDropLimit) {
      recommendedSection = s;
      finalIzBase = izBase;
      finalIz = izCorrected;
      finalVDrop = vDrop;
      finalVDropPercent = vDropPercent;
      sectionMetCriteria = true;
      break; // Encontramos la menor sección que cumple ambos criterios
    }
  }

  // Si ninguna sección cumple el límite de caída de tensión, seleccionamos la máxima disponible
  // pero marcando el error correspondiente
  if (!sectionMetCriteria) {
    recommendedSection = SECTIONS[SECTIONS.length - 1];
    const s = recommendedSection;
    const R = RHO_COPPER / s;
    const X = XL_REACTANCE;
    const sinPhi = Math.sin(Math.acos(cosPhi));
    const multiplier = isTrifasico ? Math.sqrt(3) : 2.0;
    
    finalIzBase = IZ_TABLE[method][phaseType][s];
    finalIz = finalIzBase * totalCorrectionFactor;
    finalVDrop = multiplier * length * Ib * (R * cosPhi + X * sinPhi);
    finalVDropPercent = (finalVDrop / voltage) * 100;
  }

  const isOverload = Ib > finalIz;
  const isVDropTooHigh = finalVDropPercent > resolvedVDropLimit;

  return {
    Ib: Number(Ib.toFixed(2)),
    powerkW: Number(powerkW.toFixed(2)),
    recommendedSection,
    izBase: finalIzBase,
    izCorrected: Number(finalIz.toFixed(2)),
    vDrop: Number(finalVDrop.toFixed(2)),
    vDropPercent: Number(finalVDropPercent.toFixed(2)),
    isOverload,
    isVDropTooHigh,
    vDropLimit: resolvedVDropLimit,
    factors: {
      temp: ft,
      grouping: fg,
      total: Number(totalCorrectionFactor.toFixed(3))
    }
  };
}

/**
 * Calcula el nivel de ocupación (Fill-rate) de una cañería según los cables colocados.
 * @param {string} pipeType Tipo de cañería ('corrugado', 'rl', 'rs')
 * @param {number} pipeIndex Índice del diámetro de cañería en el array
 * @param {Array} cables Lista de cables a ingresar. Formato: [{ section: 2.5, qty: 3, role: 'phase/neut' }, { section: 2.5, qty: 1, role: 'earth' }]
 * @returns {Object} Datos de llenado y recomendación
 */
export function calculateConduitFill(pipeType, pipeIndex, cables) {
  const pipeOptions = CONDUITS[pipeType];
  const selectedPipe = pipeOptions[pipeIndex];
  
  if (!selectedPipe) {
    return { error: "Cañería seleccionada no válida" };
  }

  // Área interna de la cañería
  const pipeArea = Math.PI * Math.pow(selectedPipe.intDia, 2) / 4;
  
  // Calcular área ocupada por los cables
  let totalCableArea = 0;
  let totalCablesCount = 0;
  
  const cableDetails = [];

  for (let cable of cables) {
    if (cable.qty <= 0) continue;
    
    const extDia = CABLE_DIAMETERS[cable.section];
    if (!extDia) continue;

    // Área ocupada por un conductor = PI * d² / 4
    const singleArea = Math.PI * Math.pow(extDia, 2) / 4;
    const totalArea = singleArea * cable.qty;
    
    totalCableArea += totalArea;
    totalCablesCount += cable.qty;

    cableDetails.push({
      section: cable.section,
      qty: cable.qty,
      role: cable.role || 'phase',
      extDia,
      singleArea: Number(singleArea.toFixed(2)),
      totalArea: Number(totalArea.toFixed(2))
    });
  }

  const fillRate = (totalCableArea / pipeArea) * 100;
  // Límite de llenado AEA: 35% para 3 o más conductores, 38% para 2 conductores, 53% para 1 conductor.
  let limit = 35.0;
  if (totalCablesCount === 1) limit = 53.0;
  else if (totalCablesCount === 2) limit = 38.0;

  const isExceeded = fillRate > limit;

  // Encontrar la cañería recomendada en caso de exceder
  let recommendedPipe = selectedPipe.name;
  let recommendedIndex = pipeIndex;

  if (isExceeded) {
    for (let i = pipeIndex + 1; i < pipeOptions.length; i++) {
      const tempPipe = pipeOptions[i];
      const tempPipeArea = Math.PI * Math.pow(tempPipe.intDia, 2) / 4;
      const tempFillRate = (totalCableArea / tempPipeArea) * 100;
      
      if (tempFillRate <= limit) {
        recommendedPipe = tempPipe.name;
        recommendedIndex = i;
        break;
      }
    }
  }

  return {
    pipeName: selectedPipe.name,
    pipeInnerDiameter: selectedPipe.intDia,
    pipeArea: Number(pipeArea.toFixed(2)),
    totalCableArea: Number(totalCableArea.toFixed(2)),
    fillRate: Number(fillRate.toFixed(2)),
    limit,
    isExceeded,
    recommendedPipe,
    recommendedIndex,
    cablesCount: totalCablesCount,
    cableDetails
  };
}

/**
 * Valida la coordinación de protecciones termomagnéticas y disyuntores según la AEA.
 * @param {number} Ib Corriente de proyecto
 * @param {number} Iz Corriente admisible corregida del cable
 * @param {number} InPia Corriente nominal de la térmica (PIA)
 * @param {number} InId Corriente nominal del disyuntor (ID)
 * @returns {Object} Resultados de la validación
 */
export function validateProtections(Ib, Iz, InPia, InId) {
  const isPiaMinOk = InPia >= Ib; // Criterio: In >= Ib
  const isPiaMaxOk = InPia <= Iz; // Criterio: In <= Iz
  const isIdOk = InId >= InPia;   // Criterio: In_ID >= In_PIA

  let piaError = null;
  if (!isPiaMinOk) {
    piaError = `Térmica subdimensionada: calibre seleccionado (${InPia}A) es menor a la corriente de proyecto (${Ib}A). Saltará en servicio normal.`;
  } else if (!isPiaMaxOk) {
    piaError = `Peligro en cable: calibre de la térmica (${InPia}A) supera la capacidad del conductor (${Iz}A). ¡Riesgo de incendio!`;
  }

  let idError = null;
  if (!isIdOk) {
    idError = `Disyuntor expuesto: su calibre (${InId}A) es inferior al de la térmica (${InPia}A). Riesgo de daño térmico.`;
  }

  const isFault = !isPiaMinOk || !isPiaMaxOk || !isIdOk;

  return {
    isPiaMinOk,
    isPiaMaxOk,
    isPiaOk: isPiaMinOk && isPiaMaxOk,
    isIdOk,
    piaError,
    idError,
    isFault
  };
}
