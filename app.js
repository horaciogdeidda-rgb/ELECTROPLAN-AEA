import { 
  calculateConductor, 
  calculateConduitFill, 
  CONDUITS, 
  SECTIONS 
} from './modules/calculator.js';
import { Oscilloscope } from './modules/oscilloscope.js';
import { AAIERIC_CATALOG, BudgetManager } from './modules/budget.js';
import { StorageManager } from './modules/storage.js';
import { exportProjectToPDF } from './modules/pdfExport.js';

// --- ESTADO GLOBAL DE LA APP ---
let activeTab = 'cables';
let currentProjectId = null;
let currentProjectName = 'Proyecto Residencial AEA';
const budgetManager = new BudgetManager();
let oscilloscope = null;

// Lista de las 8 Partes Reglamentarias de la AEA 90364
const AEA_PARTS = [
  {
    id: 'part_1',
    num: '1',
    title: 'Principios Fundamentales',
    ledText: 'AEA 90364-1: SEGURIDAD Y DISEÑO GENERAL',
    checklist: [
      'Establece las bases de protección contra choques eléctricos e incendios.',
      'Obligatoriedad de proyectar instalaciones seguras antes de cablear.',
      'Criterio de diseño: Seleccionar siempre secciones normalizadas según la corriente.',
      'Define que toda masa metálica debe estar unida a protección de tierra.'
    ]
  },
  {
    id: 'part_2',
    num: '2',
    title: 'Definiciones Reglamentarias',
    ledText: 'AEA 90364-2: TELEMETRÍA Y VARIABLES CRÍTICAS',
    checklist: [
      'Ib: Corriente de proyecto (circula en servicio normal).',
      'In: Corriente nominal del dispositivo de protección (térmica).',
      'Iz: Corriente admisible del conductor (corregida).',
      'Regla reglamentaria de protección térmica obligatoria: Ib ≤ In ≤ Iz.'
    ]
  },
  {
    id: 'part_3',
    num: '3',
    title: 'Características de la Instalación',
    ledText: 'AEA 90364-3: ESQUEMAS DE CONEXIÓN A TIERRA',
    checklist: [
      'Determinación de esquemas de conexión a tierra (ECT). El estándar es TT (masas separadas).',
      'Clasificación de influencias externas (Temperatura BD, presencia de agua AD, etc.).',
      'Determinación de la potencia máxima simultánea y demanda por circuito.'
    ]
  },
  {
    id: 'part_4',
    num: '4',
    title: 'Medidas de Protección',
    ledText: 'AEA 90364-4: SEGURIDAD CONTRA CHOQUES E INCENDIO',
    checklist: [
      'Diferencial (disyuntor) de sensibilidad ≤ 30mA obligatorio para contactos directos.',
      'Interruptor termomagnético obligatorio para protección contra sobrecargas y cortocircuitos.',
      'Protección por corte automático de alimentación vinculando masas a tierra.'
    ]
  },
  {
    id: 'part_5',
    num: '5',
    title: 'Elección e Instalación de Materiales',
    ledText: 'AEA 90364-5: CONDUCTORES E INSTALACIÓN',
    checklist: [
      'Selección de conductores según IRAM NM 247-3 (en cañería) o IRAM 2178-1 (subterráneo).',
      'Código de colores: R (Castaño), S (Negro), T (Rojo), Neutro (Azul), PE (Verde/Amarillo).',
      'Secciones mínimas normalizadas: Fase/Neutro ≥ 1.5mm², Tierra ≥ 1.5mm².'
    ]
  },
  {
    id: 'part_6',
    num: '6',
    title: 'Verificación y Ensayos Iniciales',
    ledText: 'AEA 90364-6: ENSAYOS E INSTRUMENTACIÓN',
    checklist: [
      'Obligatoriedad de medición de resistencia de puesta a tierra antes de la habilitación.',
      'Prueba de funcionamiento del disyuntor pulsando el botón de test mensualmente.',
      'Ensayos de rigidez dieléctrica y continuidad del conductor de protección PE.'
    ]
  },
  {
    id: 'part_7',
    num: '7',
    title: 'Locales Especiales (Vivienda/Obra)',
    ledText: 'AEA 90364-7: REGLAS PARA LOCALES ESPECIALES',
    checklist: [
      'Sección mínima reglamentaria: Iluminación 1.5mm², Tomacorrientes 2.5mm².',
      'Baños: División de seguridad en zonas de volumen (Volumen 0, 1, 2 y 3). No instalar llaves en 0/1.',
      'Máxima cantidad de bocas por circuito de uso general: 15 bocas.',
      'Grado de protección IP adecuado según humedad (mínimo IP44 en exterior).'
    ]
  },
  {
    id: 'part_8',
    num: '8',
    title: 'Eficiencia Energética',
    ledText: 'AEA 90364-8: EFICIENCIA Y GESTIÓN ENERGÉTICA',
    checklist: [
      'Optimización de caídas de tensión (cercano al 1-2% en cables alimentadores principales).',
      'Uso de sistemas de control inteligente de iluminación y domótica.',
      'Monitoreo centralizado del consumo y corrección de factor de potencia centralizado.'
    ]
  }
];

// --- INICIALIZADOR DE LA INTERFAZ ---
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initPartsList();
  initConduitDropdowns();
  initOscilloscopeWidget();
  initBudgetCatalog();
  initEventListeners();
  
  // Realizar primer cálculo inicial
  runCalculator();
  updateHistoryCounter();
  
  // Pre-cargar la Parte 7 (más común en el uso de electricistas)
  selectAeaPart('part_7');
});

// --- RELOJ DIGITAL ---
function initClock() {
  const clockDisplay = document.getElementById('clock-display');
  setInterval(() => {
    const d = new Date();
    clockDisplay.textContent = d.toLocaleTimeString('es-AR');
  }, 1000);
}

// --- HISTORIAL COUNTER ---
function updateHistoryCounter() {
  const count = StorageManager.getCount();
  document.getElementById('history-counter-btn').textContent = count;
}

// --- ASISTENTE DE LAS 8 PARTES ---
function initPartsList() {
  const container = document.getElementById('parts-list-container');
  container.innerHTML = '';
  
  AEA_PARTS.forEach(part => {
    const card = document.createElement('div');
    card.className = 'part-card';
    card.id = `part-card-${part.id}`;
    card.innerHTML = `
      <div class="part-header">
        <div class="part-num">${part.num}</div>
        <div class="part-title">${part.title}</div>
      </div>
    `;
    card.addEventListener('click', () => selectAeaPart(part.id));
    container.appendChild(card);
  });
}

function selectAeaPart(partId) {
  // Desmarcar todos
  AEA_PARTS.forEach(p => {
    document.getElementById(`part-card-${p.id}`).classList.remove('active');
  });
  
  // Marcar activo
  const part = AEA_PARTS.find(p => p.id === partId);
  if (!part) return;
  
  document.getElementById(`part-card-${partId}`).classList.add('active');
  
  // Actualizar LED navbar
  document.getElementById('normative-active-text').textContent = `NORMATIVA: ${part.ledText}`;
  
  // Actualizar checklist
  document.getElementById('checklist-title').textContent = `Checklist: ${part.title}`;
  const listEl = document.getElementById('checklist-items-list');
  listEl.innerHTML = '';
  
  part.checklist.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    listEl.appendChild(li);
  });

  // Si selecciona la Parte 7 o la Parte 8, ajustar valores en el calculador automáticamente para ayudar al usuario
  if (partId === 'part_7') {
    // Vivienda estándar: limitar caída de tensión e incentivar TUG
    const appTypeSelect = document.getElementById('calc-apptype');
    if (appTypeSelect.value !== 'power' && appTypeSelect.value !== 'lighting') {
      appTypeSelect.value = 'power';
      runCalculator();
    }
  }
}

// --- CONSOLA DE CÁLCULO - CAÑERÍAS ---
function initConduitDropdowns() {
  const pipeSizeSelect = document.getElementById('conduit-pipe-size');
  const activeSecSelect = document.getElementById('conduit-active-sec');
  const peSecSelect = document.getElementById('conduit-pe-sec');
  
  // Llenar diámetros de cañerías
  updateConduitSizes();
  
  // Llenar secciones de cables
  activeSecSelect.innerHTML = '';
  peSecSelect.innerHTML = '';
  
  SECTIONS.forEach(s => {
    const optActive = document.createElement('option');
    optActive.value = s;
    optActive.textContent = `${s} mm²`;
    if (s === 2.5) optActive.selected = true;
    activeSecSelect.appendChild(optActive);

    const optPe = document.createElement('option');
    optPe.value = s;
    optPe.textContent = `${s} mm²`;
    if (s === 2.5) optPe.selected = true;
    peSecSelect.appendChild(optPe);
  });
}

function updateConduitSizes() {
  const pipeType = document.getElementById('conduit-pipe-type').value;
  const pipeSizeSelect = document.getElementById('conduit-pipe-size');
  
  pipeSizeSelect.innerHTML = '';
  CONDUITS[pipeType].forEach((pipe, index) => {
    const opt = document.createElement('option');
    opt.value = index;
    opt.textContent = `${pipe.name} (DI: ${pipe.intDia}mm)`;
    if (pipe.name.includes('3/4') || pipe.name.includes('RL19') || pipe.name.includes('RS19')) {
      opt.selected = true;
    }
    pipeSizeSelect.appendChild(opt);
  });
}

// --- OSCILOSCOPIO ---
function initOscilloscopeWidget() {
  const canvas = document.getElementById('oscilloscope-screen');
  oscilloscope = new Oscilloscope(canvas);
  oscilloscope.start();
}

// --- PRESUPUESTO - CATÁLOGO ---
function initBudgetCatalog() {
  const dropdown = document.getElementById('catalog-dropdown-list');
  dropdown.innerHTML = '';

  AAIERIC_CATALOG.forEach(rub => {
    // Cabecera del rubro
    const header = document.createElement('div');
    header.className = 'catalog-group-header';
    header.textContent = rub.name;
    dropdown.appendChild(header);

    // Ítems de este rubro
    rub.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'catalog-item-row';
      row.textContent = `[${item.unit}] — ${item.text}`;
      row.addEventListener('click', () => {
        budgetManager.addItem(item.id, 1);
        renderBudgetItems();
        dropdown.style.display = 'none';
        document.getElementById('budget-catalog-search').value = '';
      });
      dropdown.appendChild(row);
    });
  });
}

function updateBudgetTotals() {
  const total = budgetManager.getTotalBudget();
  const valEl = document.getElementById('budget-total-val');
  
  if (!valEl) return;

  // Obtener valor actual para la transición
  const currentText = valEl.textContent.replace(/[^\d]/g, '');
  const currentVal = parseFloat(currentText) || 0;
  
  const targetObj = { val: currentVal };
  
  // Animar contador con GSAP
  gsap.to(targetObj, {
    val: total,
    duration: 0.4,
    roundProps: "val",
    onUpdate: () => {
      valEl.textContent = `$ ${Math.round(targetObj.val).toLocaleString('es-AR')}`;
    }
  });
}

function renderBudgetItems() {
  const container = document.getElementById('budget-items-container');
  container.innerHTML = '';
  
  const grouped = budgetManager.getItemsByRubric();
  let totalItems = 0;

  for (let rubricId in grouped) {
    const rub = grouped[rubricId];
    if (rub.items.length === 0) continue;

    // Agregar cabecera del rubro
    const header = document.createElement('div');
    header.style.fontSize = '10px';
    header.style.textTransform = 'uppercase';
    header.style.color = 'var(--clay)';
    header.style.fontFamily = 'var(--font-mono)';
    header.style.marginTop = '10px';
    header.style.borderBottom = '1px solid rgba(46,64,54,0.2)';
    header.style.paddingBottom = '2px';
    header.textContent = rub.rubricName;
    container.appendChild(header);

    rub.items.forEach(item => {
      totalItems++;
      const card = document.createElement('div');
      card.className = 'budget-item-card';
      card.innerHTML = `
        <div class="budget-item-desc">${item.description}</div>
        <div class="budget-item-controls" style="margin-top: 6px;">
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: rgba(242,240,233,0.6); font-size: 11px;">Cant:</span>
            <input type="number" class="budget-qty-input" value="${item.qty}" min="1" step="1" id="qty-input-${item.id}">
            <span style="color: rgba(242,240,233,0.4); font-size: 10px;">${item.unit}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: rgba(242,240,233,0.6); font-size: 11px;">$ Unit:</span>
            <input type="number" class="budget-price-input" value="${item.price}" min="0" step="500" placeholder="0" id="price-input-${item.id}">
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; border-top: 1px dashed rgba(46,64,54,0.2); padding-top: 6px; font-size: 10.5px; font-family: var(--font-mono);">
          <span style="color: rgba(242,240,233,0.5);">Subtotal: <strong style="color: var(--neon-green);" id="subtotal-${item.id}">$ ${(item.qty * item.price).toLocaleString('es-AR')}</strong></span>
          <button class="budget-item-delete" id="delete-btn-${item.id}" style="padding: 2px 4px;">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
      
      container.appendChild(card);

      const qtyInput = card.querySelector(`#qty-input-${item.id}`);
      const priceInput = card.querySelector(`#price-input-${item.id}`);
      const subtotalEl = card.querySelector(`#subtotal-${item.id}`);

      const updateCardSubtotal = () => {
        const qty = parseInt(qtyInput.value) || 0;
        const price = parseInt(priceInput.value) || 0;
        budgetManager.updateItem(item.id, { qty, price });
        subtotalEl.textContent = `$ ${(qty * price).toLocaleString('es-AR')}`;
        updateBudgetTotals();
      };

      // Escuchar eventos sin re-renderizar para no perder el foco
      qtyInput.addEventListener('input', updateCardSubtotal);
      priceInput.addEventListener('input', updateCardSubtotal);

      // Evento eliminar ítem
      card.querySelector(`#delete-btn-${item.id}`).addEventListener('click', () => {
        budgetManager.removeItem(item.id);
        renderBudgetItems();
      });
    });
  }

  // Si no hay ítems, volver a mostrar el mensaje vacío
  if (totalItems === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: rgba(242, 240, 233, 0.4); padding: 40px 10px; font-size: 12px; border: 1px dashed rgba(46,64,54,0.4); border-radius: 6px;">
        <i class="fa-regular fa-folder-open" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
        Presupuesto vacío.<br>Busque y agregue tareas del catálogo AAIERIC arriba para armar el presupuesto del cliente.
      </div>
    `;
  }

  // Actualizar totales generales al finalizar renderizado
  updateBudgetTotals();
}

// --- CONECTORES DE LISTENERS ---
function initEventListeners() {
  // Tabs
  const tabCablesBtn = document.getElementById('tab-cables-btn');
  const tabConduitsBtn = document.getElementById('tab-conduits-btn');
  
  tabCablesBtn.addEventListener('click', () => switchTab('cables'));
  tabConduitsBtn.addEventListener('click', () => switchTab('conduits'));

  // Sliders e Inputs de cálculo (Conductores)
  const calcInputs = [
    'calc-load-type', 'input-load-slider', 'calc-voltage', 
    'input-cosphi', 'input-length', 'calc-method', 
    'input-temp', 'input-circuits', 'calc-apptype'
  ];

  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Cambios inmediatos
    el.addEventListener('input', (e) => {
      updateValueBadges();
      runCalculator();
    });
    el.addEventListener('change', () => {
      updateValueBadges();
      runCalculator();
    });
  });

  // Especial: Cuando cambia el tipo de carga, cambiar el slider del máximo/mínimo/unidades
  document.getElementById('calc-load-type').addEventListener('change', (e) => {
    const isPower = (e.target.value === 'power');
    const slider = document.getElementById('input-load-slider');
    const label = document.getElementById('label-load-slider');
    const badge = document.getElementById('load-type-badge');
    
    if (isPower) {
      slider.min = 0.5;
      slider.max = 50;
      slider.step = 0.5;
      slider.value = 5;
      label.textContent = "Potencia de Carga";
      badge.textContent = "Potencia (kW)";
    } else {
      slider.min = 2;
      slider.max = 125;
      slider.step = 1;
      slider.value = 16;
      label.textContent = "Corriente de Proyecto";
      badge.textContent = "Corriente (A)";
    }
    updateValueBadges();
    runCalculator();
  });

  // Especial: Cuando cambia la tensión, pre-seleccionar monofásico/trifásico
  document.getElementById('calc-voltage').addEventListener('change', (e) => {
    const val = e.target.value;
    document.getElementById('val-voltage').textContent = val + " V";
    runCalculator();
  });

  // Especial: Ajustar límites del método de canalización según tipo seleccionado
  document.getElementById('calc-method').addEventListener('change', (e) => {
    const method = e.target.value;
    const tempSlider = document.getElementById('input-temp');
    if (method === 'underground') {
      tempSlider.min = 5;
      tempSlider.max = 45;
      if (tempSlider.value > 45) tempSlider.value = 25;
      document.getElementById('val-temp').textContent = tempSlider.value + " °C";
    } else {
      tempSlider.min = 10;
      tempSlider.max = 60;
    }
    runCalculator();
  });

  // Inputs de cañería
  document.getElementById('conduit-pipe-type').addEventListener('change', () => {
    updateConduitSizes();
    runConduitCalculator();
  });
  
  const conduitFields = [
    'conduit-pipe-size', 'conduit-active-qty', 
    'conduit-active-sec', 'conduit-pe-qty', 'conduit-pe-sec'
  ];
  conduitFields.forEach(id => {
    document.getElementById(id).addEventListener('change', runConduitCalculator);
  });

  // Catálogo de presupuestos búsqueda
  const searchInput = document.getElementById('budget-catalog-search');
  const dropdown = document.getElementById('catalog-dropdown-list');

  searchInput.addEventListener('focus', () => {
    dropdown.style.display = 'block';
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const rows = dropdown.querySelectorAll('.catalog-item-row');
    let hasResults = false;

    rows.forEach(row => {
      const match = row.textContent.toLowerCase().includes(query);
      row.style.display = match ? 'block' : 'none';
      if (match) hasResults = true;
    });

    // Ocultar cabeceras si no hay resultados en sus ítems (simplificado: siempre mostrar cabeceras o esconder todas si query no está vacía)
    const headers = dropdown.querySelectorAll('.catalog-group-header');
    headers.forEach(h => {
      h.style.display = query === '' ? 'block' : 'none';
    });
  });

  // Cerrar catálogo al hacer clic afuera
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

  // Botones de Operaciones Globales
  document.getElementById('btn-project-save').addEventListener('click', openSaveModal);
  document.getElementById('btn-project-pdf').addEventListener('click', handleExportPDF);
  document.getElementById('history-counter-btn').addEventListener('click', openHistoryModal);

  // Modales Cierres
  document.getElementById('history-modal-close').addEventListener('click', () => {
    document.getElementById('history-modal').style.display = 'none';
  });
  document.getElementById('save-modal-close').addEventListener('click', () => {
    document.getElementById('save-modal').style.display = 'none';
  });
  document.getElementById('save-modal-cancel').addEventListener('click', () => {
    document.getElementById('save-modal').style.display = 'none';
  });
  document.getElementById('history-modal-clear').addEventListener('click', handleClearAllHistory);

  document.getElementById('save-modal-confirm').addEventListener('click', confirmSaveProject);

  document.getElementById('budget-include-prices').addEventListener('change', (e) => {
    const checked = e.target.checked;
    const container = document.getElementById('budget-total-container');
    if (container) {
      container.style.opacity = checked ? '1' : '0.4';
    }
  });
}

// --- GESTIÓN DE TABS ---
function switchTab(tabId) {
  activeTab = tabId;
  
  const tabCables = document.getElementById('tab-cables');
  const tabConduits = document.getElementById('tab-conduits');
  const tabCablesBtn = document.getElementById('tab-cables-btn');
  const tabConduitsBtn = document.getElementById('tab-conduits-btn');
  const headerTitle = document.getElementById('calc-header-title');

  if (tabId === 'cables') {
    tabCables.style.display = 'block';
    tabConduits.style.display = 'none';
    tabCablesBtn.classList.add('active');
    tabConduitsBtn.classList.remove('active');
    headerTitle.textContent = "Consola de Cálculo: Conductores y Caída de Tensión";
    
    // Cambiar la pantalla del osciloscopio a telemetría de caída
    runCalculator();
  } else {
    tabCables.style.display = 'none';
    tabConduits.style.display = 'block';
    tabCablesBtn.classList.remove('active');
    tabConduitsBtn.classList.add('active');
    headerTitle.textContent = "Consola de Cálculo: Dimensionamiento de Cañerías (Fill-rate)";
    
    // Ejecutar cálculo de cañería
    runConduitCalculator();
  }
}

// --- ACTUALIZACIÓN DE INDICADORES DE VALORES EN SLIDERS ---
function updateValueBadges() {
  const loadType = document.getElementById('calc-load-type').value;
  const loadVal = document.getElementById('input-load-slider').value;
  const lengthVal = document.getElementById('input-length').value;
  const cosPhiVal = document.getElementById('input-cosphi').value;
  const tempVal = document.getElementById('input-temp').value;
  const circuitsVal = document.getElementById('input-circuits').value;

  document.getElementById('val-load-slider').textContent = loadType === 'power' ? `${loadVal} kW` : `${loadVal} A`;
  document.getElementById('val-length').textContent = `${lengthVal} m`;
  document.getElementById('val-cosphi').textContent = cosPhiVal;
  document.getElementById('val-temp').textContent = `${tempVal} °C`;
  document.getElementById('val-circuits').textContent = circuitsVal === '1' ? '1 circuito' : `${circuitsVal} ctos.`;
}

// --- CÁLCULO PRINCIPAL Y COMUNICACIÓN CON OSCILOSCOPIO ---
let currentCalcState = {};

function runCalculator() {
  if (activeTab !== 'cables') return;

  const loadType = document.getElementById('calc-load-type').value;
  const loadValue = parseFloat(document.getElementById('input-load-slider').value);
  const voltage = parseInt(document.getElementById('calc-voltage').value);
  const cosPhi = parseFloat(document.getElementById('input-cosphi').value);
  const length = parseFloat(document.getElementById('input-length').value);
  const method = document.getElementById('calc-method').value;
  const temp = parseInt(document.getElementById('input-temp').value);
  const circuits = parseInt(document.getElementById('input-circuits').value);
  const appType = document.getElementById('calc-apptype').value;

  // Ejecutar el motor matemático
  const result = calculateConductor({
    loadType, loadValue, voltage, cosPhi, length, method, temp, circuits, appType
  });

  currentCalcState = result;
  currentCalcState.voltage = voltage;
  currentCalcState.length = length;
  currentCalcState.method = method;
  currentCalcState.temp = temp;
  currentCalcState.circuits = circuits;
  currentCalcState.appType = appType;

  // Actualizar resultados en Pantalla
  document.getElementById('res-section').innerHTML = `${result.recommendedSection} <span class="cormorant-unit">mm²</span>`;
  document.getElementById('res-ib').textContent = `${result.Ib} A`;
  document.getElementById('res-iz').textContent = `${result.izCorrected} A (Iz corregida)`;
  document.getElementById('res-vdrop').textContent = `${result.vDropPercent.toFixed(2)}% (${result.vDrop.toFixed(1)}V)`;

  // Estado LED y Estado del circuito
  const led = document.getElementById('led-status');
  const resStatus = document.getElementById('res-status');
  const isFault = result.isOverload || result.isVDropTooHigh;

  if (isFault) {
    led.classList.add('alert');
    resStatus.style.color = 'var(--clay)';
    
    let errMsg = "";
    if (result.isOverload && result.isVDropTooHigh) errMsg = "SOBRECARGA Y CAÍDA CRÍTICA";
    else if (result.isOverload) errMsg = "SOBRECARGA (Ib > Iz)";
    else errMsg = "CAÍDA EXCESIVA (> REG.)";

    resStatus.textContent = `⚠ ${errMsg}`;
  } else {
    led.classList.remove('alert');
    resStatus.style.color = 'var(--neon-green)';
    resStatus.textContent = '✓ CONFORME CON AEA';
  }

  // GSAP: Animar el osciloscopio de forma suave transicionando las variables
  if (oscilloscope) {
    gsap.to(oscilloscope, {
      duration: 0.5,
      amplitude: isFault ? 50 : (30 - Math.min(result.vDropPercent * 2, 12)),
      noise: isFault ? Math.min((result.vDropPercent - 3) * 1.8, 12) : 0.08,
      vDropPercent: result.vDropPercent,
      voltage: voltage,
      isFault: isFault,
      ease: "power2.out"
    });
  }

  // Animar el badge de sección con escala
  gsap.fromTo('#res-section', 
    { scale: 0.9 }, 
    { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" }
  );
}

// --- CÁLCULO DE CAÑERÍAS (FILL-RATE) ---
let currentConduitState = {};

function runConduitCalculator() {
  if (activeTab !== 'conduits') return;

  const pipeType = document.getElementById('conduit-pipe-type').value;
  const pipeIndex = parseInt(document.getElementById('conduit-pipe-size').value) || 0;
  
  const activeQty = parseInt(document.getElementById('conduit-active-qty').value);
  const activeSec = parseFloat(document.getElementById('conduit-active-sec').value);
  
  const peQty = parseInt(document.getElementById('conduit-pe-qty').value);
  const peSec = parseFloat(document.getElementById('conduit-pe-sec').value);

  // Armar lista de conductores
  const cables = [
    { section: activeSec, qty: activeQty, role: 'phase' },
    { section: peSec, qty: peQty, role: 'earth' }
  ];

  const result = calculateConduitFill(pipeType, pipeIndex, cables);
  
  currentConduitState = result;
  currentConduitState.pipeType = pipeType;
  currentConduitState.pipeIndex = pipeIndex;
  currentConduitState.cablesInput = cables;

  // Actualizar displays textuales
  document.getElementById('cables-active-display').textContent = `${activeQty}x ${activeSec} mm²`;
  document.getElementById('cables-pe-display').textContent = `${peQty}x ${peSec} mm²`;

  const summaryEl = document.getElementById('conduit-fill-summary');
  const previewCircle = document.getElementById('conduit-circle-preview');
  const watermark = document.getElementById('fill-watermark-text');

  watermark.textContent = `${result.fillRate}%`;

  if (result.isExceeded) {
    previewCircle.classList.add('exceeded');
    summaryEl.innerHTML = `<span style="color: var(--clay); font-weight: bold;">⚠ EXCEDIDO: ${result.fillRate}% (Límite: ${result.limit}%)</span>.<br>Se recomienda: <strong style="color: var(--cream);">${result.recommendedPipe}</strong>`;
    
    // Cambiar osciloscopio temporalmente a distorsión por fallos de sección
    if (oscilloscope) {
      gsap.to(oscilloscope, {
        duration: 0.5,
        amplitude: 55,
        noise: 8,
        vDropPercent: result.fillRate,
        isFault: true,
        voltage: 0, // Indicar fallo total
        ease: "power2.out"
      });
    }
  } else {
    previewCircle.classList.remove('exceeded');
    summaryEl.innerHTML = `<span style="color: var(--neon-green); font-weight: bold;">✓ OK: ${result.fillRate}% ocupado</span>.<br>Diámetro interno libre reglamentario.`;
    
    if (oscilloscope) {
      gsap.to(oscilloscope, {
        duration: 0.5,
        amplitude: 28,
        noise: 0.05,
        vDropPercent: result.fillRate,
        isFault: false,
        voltage: 220,
        ease: "power2.out"
      });
    }
  }

  // Graficar cables en el plano circular
  drawConduitCablesGraphic(result);
}

function drawConduitCablesGraphic(result) {
  const container = document.getElementById('conduit-cable-bundle');
  container.innerHTML = '';

  const totalCables = result.cablesCount;
  if (totalCables <= 0) return;

  const width = 130; // Diámetro contenedor interno restando bordes
  const scale = width / result.pipeInnerDiameter;

  let index = 0;
  const cableDetails = result.cableDetails;

  // Organizar cables alrededor del centro en una distribución radial compacta
  // R es el radio de distribución
  const distributionRadius = (result.pipeInnerDiameter - Math.max(...cableDetails.map(c => c.extDia))) * 0.22 * scale;

  cableDetails.forEach(cableType => {
    for (let q = 0; q < cableType.qty; q++) {
      const cableEl = document.createElement('div');
      
      const roleClass = cableType.role === 'earth' ? 'cable-earth' : 
                        (index % 2 === 0 ? 'cable-phase' : 'cable-neutral');
      
      cableEl.className = `cable-render ${roleClass}`;
      
      const pxSize = cableType.extDia * scale;
      cableEl.style.width = `${pxSize}px`;
      cableEl.style.height = `${pxSize}px`;

      // Posicionar usando radial coordinadas para dispersar cables
      let x, y;
      if (totalCables === 1) {
        x = width / 2;
        y = width / 2;
      } else {
        const angle = (index * (2 * Math.PI / totalCables)) + (Math.PI / 6);
        // Desplazamiento radial con perturbación sutil analógica
        x = (width / 2) + Math.cos(angle) * distributionRadius;
        y = (width / 2) + Math.sin(angle) * distributionRadius;
      }

      // Centrar el cable en sus coordenadas
      cableEl.style.left = `${x - pxSize/2}px`;
      cableEl.style.top = `${y - pxSize/2}px`;
      
      container.appendChild(cableEl);
      
      // Animación suave de aparición analógica
      gsap.from(cableEl, {
        scale: 0.1,
        opacity: 0,
        duration: 0.4,
        delay: index * 0.05,
        ease: "back.out(1.7)"
      });

      index++;
    }
  });
}

// --- HISTORIAL & LOCALSTORAGE ---
function openSaveModal() {
  const nameInput = document.getElementById('save-project-name');
  if (currentProjectId) {
    // Si ya está cargado, simplemente sobreescribir silenciosamente
    confirmSaveProject();
  } else {
    nameInput.value = currentProjectName;
    document.getElementById('save-modal').style.display = 'flex';
    nameInput.focus();
  }
}

function confirmSaveProject() {
  const nameInput = document.getElementById('save-project-name');
  let name = nameInput.value.trim();
  
  if (!name) {
    name = currentProjectName;
  }
  
  currentProjectName = name;

  // Empaquetar estado del calculador
  const calculatorState = { ...currentCalcState };
  if (currentConduitState.fillRate !== undefined) {
    calculatorState.conduitResult = currentConduitState;
  }

  const budgetItems = budgetManager.serialize();

  const saved = StorageManager.saveProject(currentProjectId, {
    name,
    calculatorState,
    budgetItems
  });

  if (saved) {
    currentProjectId = saved.id;
    updateHistoryCounter();
    
    // Cerrar modal
    document.getElementById('save-modal').style.display = 'none';
    
    // Mostrar cartel de éxito sutil en consola (usamos alert provisorio)
    alert(`Proyecto "${name}" guardado correctamente en la consola.`);
  }
}

function openHistoryModal() {
  const listEl = document.getElementById('history-projects-list');
  listEl.innerHTML = '';

  const projects = StorageManager.listProjects();

  if (projects.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; color: #666; padding: 20px;">
        No hay cálculos guardados en la consola.
      </div>
    `;
    document.getElementById('history-modal').style.display = 'flex';
    return;
  }

  projects.forEach(p => {
    const row = document.createElement('div');
    row.className = 'history-item';
    
    const formattedDate = new Date(p.timestamp).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    row.innerHTML = `
      <div class="history-item-info">
        <span class="history-item-name">${p.name}</span>
        <span class="history-item-date">${formattedDate} — ${p.calculatorState.recommendedSection || '--'} mm²</span>
      </div>
      <div class="history-actions">
        <button class="btn-history-load" id="load-hist-${p.id}"><i class="fa-solid fa-folder-open"></i> Abrir</button>
        <button class="btn-history-delete" id="del-hist-${p.id}"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    
    listEl.appendChild(row);

    document.getElementById(`load-hist-${p.id}`).addEventListener('click', () => {
      loadProjectIntoWorkspace(p.id);
      document.getElementById('history-modal').style.display = 'none';
    });

    document.getElementById(`del-hist-${p.id}`).addEventListener('click', () => {
      if (confirm(`¿Seguro que desea borrar "${p.name}"?`)) {
        StorageManager.deleteProject(p.id);
        openHistoryModal();
        updateHistoryCounter();
      }
    });
  });

  document.getElementById('history-modal').style.display = 'flex';
}

function loadProjectIntoWorkspace(projectId) {
  const project = StorageManager.loadProject(projectId);
  if (!project) return;

  currentProjectId = project.id;
  currentProjectName = project.name;

  const cs = project.calculatorState;
  
  // 1. Cargar calculador cables
  if (cs.loadType) {
    document.getElementById('calc-load-type').value = cs.loadType;
    
    // Forzar trigger de cambio de tipo para re-escalar slider antes de inyectar valor
    const loadTypeEvent = new Event('change');
    document.getElementById('calc-load-type').dispatchEvent(loadTypeEvent);

    document.getElementById('input-load-slider').value = cs.loadValue;
    document.getElementById('calc-voltage').value = cs.voltage;
    document.getElementById('input-cosphi').value = cs.cosPhi;
    document.getElementById('input-length').value = cs.length;
    document.getElementById('calc-method').value = cs.method;
    
    // Forzar trigger de cambio de método para actualizar temp slider limits
    const methodEvent = new Event('change');
    document.getElementById('calc-method').dispatchEvent(methodEvent);

    document.getElementById('input-temp').value = cs.temp;
    document.getElementById('input-circuits').value = cs.circuits;
    document.getElementById('calc-apptype').value = cs.appType;
  }

  // 2. Cargar cañerías si existe el resultado anterior
  if (cs.conduitResult) {
    const cr = cs.conduitResult;
    document.getElementById('conduit-pipe-type').value = cr.pipeType;
    
    // Recargar diámetros
    updateConduitSizes();
    
    document.getElementById('conduit-pipe-size').value = cr.pipeIndex;
    
    const activeCable = cr.cablesInput.find(c => c.role === 'phase');
    if (activeCable) {
      document.getElementById('conduit-active-qty').value = activeCable.qty;
      document.getElementById('conduit-active-sec').value = activeCable.section;
    }
    
    const peCable = cr.cablesInput.find(c => c.role === 'earth');
    if (peCable) {
      document.getElementById('conduit-pe-qty').value = peCable.qty;
      document.getElementById('conduit-pe-sec').value = peCable.section;
    }
  }

  // 3. Cargar presupuesto
  budgetManager.loadItems(project.budgetItems);
  renderBudgetItems();

  // Actualizar labels de valores e interfaces
  updateValueBadges();
  
  // Correr cálculos
  runCalculator();
  runConduitCalculator();

  alert(`Proyecto "${project.name}" cargado exitosamente en el Workspace.`);
}

function handleClearAllHistory() {
  if (confirm("¿Está seguro de que desea eliminar permanentemente todo el historial de la consola?")) {
    localStorage.removeItem('electroplan_aea_projects');
    openHistoryModal();
    updateHistoryCounter();
  }
}

// --- EXPORTAR A PDF ---
function handleExportPDF() {
  // Asegurar que el cálculo activo esté guardado/sincronizado
  const calculatorState = { ...currentCalcState };
  if (activeTab === 'conduits') {
    runConduitCalculator();
  }
  if (currentConduitState.fillRate !== undefined) {
    calculatorState.conduitResult = currentConduitState;
  }

  const mockProject = {
    id: currentProjectId || 'temp_pdf',
    name: currentProjectName,
    calculatorState,
    timestamp: new Date().toISOString()
  };

  const budgetGrouped = budgetManager.getItemsByRubric();

  // Leer toggle de incluir precios
  const includePrices = document.getElementById('budget-include-prices').checked;

  exportProjectToPDF(mockProject, budgetGrouped, includePrices);
}
