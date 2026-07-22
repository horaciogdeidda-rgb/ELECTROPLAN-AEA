/**
 * ELECTROPLAN.AEA - Módulo de Gestión de Presupuesto Técnico
 * Estructurado con los rubros e ítems oficiales extraídos del documento
 * "AAIERIC - Costos Sugeridos de Mano de Obra - Junio 2026".
 * Todos los precios se inicializan en 0 para que el profesional los cargue libremente.
 */

export const AAIERIC_CATALOG = [
  {
    id: "rubro_1",
    name: "1. Acometida e Instalación de Medidores",
    items: [
      { id: "acometida_1", text: "Gabinete 1 Medidor Monofásico (Pilar/Muro + PAT de Servicio)", unit: "ud" },
      { id: "acometida_2", text: "Gabinete 2 Medidores Monofásicos (Amurado y Conexión)", unit: "ud" },
      { id: "acometida_3", text: "Gabinete 3 Medidores Monofásicos (Amurado y Conexión)", unit: "ud" },
      { id: "acometida_4", text: "Gabinete 4 Medidores Monofásicos (Amurado y Conexión)", unit: "ud" },
      { id: "acometida_5", text: "PAT de Servicio (Jabalina + Caja de inspección de acometida)", unit: "ud" },
      { id: "acometida_6", text: "Pilar Completo (Gabinete, TP contiguo, Caño de bajada y PAT)", unit: "ud" },
      { id: "acometida_7", text: "Caño de acometida (Amurado y conexión individual)", unit: "ud" },
      { id: "acometida_8", text: "Caja de Toma de Compañía (Fusilera NH 00)", unit: "ud" },
      { id: "acometida_9", text: "Agregado de un gabinete de medidor + Tablero Principal", unit: "ud" }
    ]
  },
  {
    id: "rubro_2",
    name: "2. Canalizaciones de Cañerías en Obra",
    items: [
      { id: "canal_losa_1", text: "Canalización de cañería en losa con caño metálico", unit: "boca" },
      { id: "canal_losa_2", text: "Canalización de cañería en loseta con caño metálico", unit: "boca" },
      { id: "canal_mamp_1", text: "Amurado de cañería en mampostería - Ladrillo común", unit: "boca" },
      { id: "canal_mamp_2", text: "Amurado de cañería en mampostería - Ladrillo hueco", unit: "boca" },
      { id: "canal_mamp_m1", text: "Amurado de cañería en mampostería - Ladrillo común (por metro)", unit: "m" },
      { id: "canal_mamp_m2", text: "Amurado de cañería en mampostería - Ladrillo hueco (por metro)", unit: "m" },
      { id: "canal_vista", text: "Amurado de cañería a la vista (Metal, PVC, Cablecanal 14x30)", unit: "boca" },
      { id: "canal_pase", text: "Pase de viga y/o columna (caja embutida en estructura)", unit: "boca" },
      { id: "canal_subt_tierra", text: "Cable subterráneo - Tendido en Tierra", unit: "m" },
      { id: "canal_subt_piso", text: "Cable subterráneo - Tendido en Piso", unit: "m" },
      { id: "canal_caja_tierra", text: "Adicional por cada caja de pase en tendido subterráneo en Tierra", unit: "ud" },
      { id: "canal_caja_piso", text: "Adicional por cada caja de pase en tendido subterráneo en Piso", unit: "ud" }
    ]
  },
  {
    id: "rubro_3",
    name: "3. Tendido de Conductores y Cableado",
    items: [
      { id: "cableado_1", text: "Cableado en obra nueva - Canalización realizada por el profesional (Opción 1)", unit: "boca" },
      { id: "cableado_2", text: "Cableado en obra nueva - Canalización realizada por otro profesional (Opción 2)", unit: "boca" },
      { id: "cableado_recab_art", text: "Recableado con desarmado e instalación de artefactos", unit: "boca" },
      { id: "cableado_recab_sin", text: "Recableado sin colocación de artefactos", unit: "boca" }
    ]
  },
  {
    id: "rubro_4",
    name: "4. Conexión de Puntos y Tomas",
    items: [
      { id: "conexion_1", text: "Conexión de punto simple, toma simple, llave o portalámpara", unit: "boca" },
      { id: "conexion_2", text: "Conexión de módulo de tomacorriente doble", unit: "boca" },
      { id: "conexion_3", text: "Conexión de llave de efecto combinado (Punto Combinación)", unit: "boca" }
    ]
  },
  {
    id: "rubro_5",
    name: "5. Tableros Eléctricos y Protecciones",
    items: [
      { id: "tableros_p_mono", text: "Tablero Principal Monofásico con 1 ID + 1 ITM + PAT", unit: "ud" },
      { id: "tableros_p_mono_pat", text: "Tablero Principal Monofásico (Solo PAT)", unit: "ud" },
      { id: "tableros_p_tri", text: "Tablero Principal Trifásico con 1 ID + 1 ITM + PAT", unit: "ud" },
      { id: "tableros_mod_adicional", text: "Módulo de protección bipolar adicional (ID, ITM, Protector)", unit: "ud" },
      { id: "tableros_id_tetra", text: "Interruptor Diferencial (ID) tetrapolar en tablero", unit: "ud" },
      { id: "tableros_itm_tetra", text: "Interruptor Termomagnético (ITM) tetrapolar en tablero", unit: "ud" },
      { id: "tableros_itm_tri", text: "Interruptor Termomagnético (ITM) tripolar en tablero", unit: "ud" },
      { id: "tableros_secc_8", text: "Tablero Seccional (Hasta 8 polos de capacidad)", unit: "ud" },
      { id: "tableros_secc_36", text: "Tablero Seccional (De 8 a 36 polos de capacidad)", unit: "ud" },
      { id: "tableros_secc_54", text: "Tablero Seccional (De 36 a 54 polos de capacidad)", unit: "ud" }
    ]
  },
  {
    id: "rubro_6",
    name: "6. Bandejas Portacables (Tendido por Metro)",
    items: [
      { id: "bandeja_150_m", text: "Bandeja hasta 150mm de ancho - Tendido por metro lineal (H < 3m)", unit: "m" },
      { id: "bandeja_150_mh", text: "Bandeja hasta 150mm de ancho - Tendido por metro lineal (H > 3m)", unit: "m" },
      { id: "bandeja_150_acc", text: "Bandeja hasta 150mm - Por cada accesorio (Curva, Unión T) (H < 3m)", unit: "ud" },
      { id: "bandeja_150_acch", text: "Bandeja hasta 150mm - Por cada accesorio (Curva, Unión T) (H > 3m)", unit: "ud" },
      { id: "bandeja_150_otro", text: "Bandeja hasta 150mm - Otros accesorios de soporte (H < 3m)", unit: "ud" },
      { id: "bandeja_150_otroh", text: "Bandeja hasta 150mm - Otros accesorios de soporte (H > 3m)", unit: "ud" },
      
      { id: "bandeja_300_m", text: "Bandeja 200/300mm de ancho - Tendido por metro lineal (H < 3m)", unit: "m" },
      { id: "bandeja_300_mh", text: "Bandeja 200/300mm de ancho - Tendido por metro lineal (H > 3m)", unit: "m" },
      { id: "bandeja_300_acc", text: "Bandeja 200/300mm - Por cada accesorio (Curva, Unión T) (H < 3m)", unit: "ud" },
      { id: "bandeja_300_acch", text: "Bandeja 200/300mm - Por cada accesorio (Curva, Unión T) (H > 3m)", unit: "ud" },
      { id: "bandeja_300_otro", text: "Bandeja 200/300mm - Otros accesorios de soporte (H < 3m)", unit: "ud" },
      { id: "bandeja_300_otroh", text: "Bandeja 200/300mm - Otros accesorios de soporte (H > 3m)", unit: "ud" },

      { id: "bandeja_600_m", text: "Bandeja 450/600mm de ancho - Tendido por metro lineal (H < 3m)", unit: "m" },
      { id: "bandeja_600_mh", text: "Bandeja 450/600mm de ancho - Tendido por metro lineal (H > 3m)", unit: "m" },
      { id: "bandeja_600_acc", text: "Bandeja 450/600mm - Por cada accesorio (Curva, Unión T) (H < 3m)", unit: "ud" },
      { id: "bandeja_600_acch", text: "Bandeja 450/600mm - Por cada accesorio (Curva, Unión T) (H > 3m)", unit: "ud" },
      { id: "bandeja_600_otro", text: "Bandeja 450/600mm - Otros accesorios de soporte (H < 3m)", unit: "ud" },
      { id: "bandeja_600_otroh", text: "Bandeja 450/600mm - Otros accesorios de soporte (H > 3m)", unit: "ud" }
    ]
  },
  {
    id: "rubro_7",
    name: "7. Artefactos de Iluminación y Equipamiento",
    items: [
      { id: "artefacto_aplique", text: "Montaje y conexionado de aplique simple de pared/techo", unit: "ud" },
      { id: "artefacto_spot", text: "Montaje y conexionado de Spot LED dicroico/embutido", unit: "ud" },
      { id: "artefacto_colg_3", text: "Montaje de artefacto colgante liviano (3 luces, 1 efecto)", unit: "ud" },
      { id: "artefacto_colg_5", text: "Montaje de artefacto colgante liviano (5 luces, 1 efecto)", unit: "ud" },
      { id: "artefacto_colg_efecto", text: "Montaje de artefacto colgante - Adicional por efecto de encendido", unit: "ud" },
      { id: "artefacto_colg_pesado", text: "Montaje de araña o artefacto colgante pesado (Mínimo)", unit: "ud" },
      { id: "artefacto_tubo_s", text: "Montaje de equipo de tubo LED simple (7W a 36W)", unit: "ud" },
      { id: "artefacto_tubo_d", text: "Montaje de equipo de tubo LED doble (7W a 36W)", unit: "ud" },
      { id: "artefacto_tubo_s45", text: "Montaje de equipo de tubo LED simple (45W)", unit: "ud" },
      { id: "artefacto_tubo_d45", text: "Montaje de equipo de tubo LED doble (45W)", unit: "ud" },
      { id: "artefacto_ventilador", text: "Montaje y conexionado de ventilador de techo estándar", unit: "ud" },
      { id: "artefacto_ventilador_lum", text: "Montaje de ventilador de techo con luminaria integrada (1 efecto)", unit: "ud" }
    ]
  },
  {
    id: "rubro_8",
    name: "8. Automatismos y Servicios Técnicos Especiales",
    items: [
      { id: "auto_contactor", text: "Instalación y conexionado de contactor monofásico/trifásico", unit: "ud" },
      { id: "auto_sensor", text: "Instalación de sensores (movimiento, fotocontrol - cableado aparte)", unit: "ud" },
      { id: "auto_urgencia_dia", text: "Servicio de Urgencia Diurna (Lunes a Sábado 8:00 a 20:00 hs)", unit: "ud" },
      { id: "auto_urgencia_noc", text: "Servicio de Urgencia Nocturna (Lunes a Sábado desde 20:00 hs, Dom/Fer)", unit: "ud" },
      { id: "auto_fp", text: "Instalación de equipo para corrección de factor de potencia (por kVA)", unit: "kVA" },
      { id: "auto_grupo", text: "Instalación y acople de grupo electrógeno monofásico hasta 3,5kVA", unit: "ud" }
    ]
  },
  {
    id: "rubro_9",
    name: "9. Documentación, Planos y Protocolos de Ensayo",
    items: [
      { id: "doc_proyecto_min", text: "Proyecto Eléctrico completo (m²) - Base mínima hasta 30m²", unit: "proyecto" },
      { id: "doc_proyecto_m2", text: "Proyecto Eléctrico - Adicional por m² excedente", unit: "m²" },
      { id: "doc_plano_min", text: "Plano Eléctrico reglamentario - Base mínima hasta 30 Bocas", unit: "plano" },
      { id: "doc_plano_boca", text: "Plano Eléctrico - Adicional por boca excedente", unit: "boca" },
      { id: "doc_plano_tablero", text: "Plano Eléctrico - Adicional por cada tablero dibujado", unit: "tablero" },
      { id: "doc_plano_acom", text: "Plano Eléctrico - Adicional por acometida e ingreso", unit: "acometida" },
      { id: "doc_dci_mono", text: "Declaración de Conformidad (DCI) / Certificado CAIE Monofásico", unit: "certificado" },
      { id: "doc_dci_tri_res", text: "Declaración de Conformidad (DCI) / Certificado CAIE Trifásico Residencial", unit: "certificado" },
      { id: "doc_dci_tri_com", text: "Declaración de Conformidad (DCI) / Certificado CAIE Trifásico Comercial", unit: "certificado" },
      { id: "doc_dci_potencia", text: "Certificado CAIE - Según potencia contratada (T2 o T3)", unit: "certificado" },
      { id: "doc_protocolo_res", text: "Protocolo de Puesta a Tierra oficial (SRT 900/15) Residencial/Comercial", unit: "ud" },
      { id: "doc_protocolo_ind", text: "Protocolo de Puesta a Tierra oficial (SRT 900/15) Industrial", unit: "ud" }
    ]
  }
];

export class BudgetManager {
  constructor() {
    this.items = []; // Estructura: { id, catalogItemId, rubricId, description, qty, unit, price }
  }

  // Cargar lista de ítems desde una estructura guardada
  loadItems(savedItems) {
    // Si los ítems guardados no tienen el campo price, inicializar en 0
    this.items = (savedItems || []).map(item => ({
      ...item,
      price: item.price !== undefined ? Number(item.price) : 0
    }));
  }

  // Obtener todos los ítems agregados agrupados por rubro
  getItemsByRubric() {
    const grouped = {};
    
    // Inicializar rubros vacíos en orden
    AAIERIC_CATALOG.forEach(rub => {
      grouped[rub.id] = {
        rubricName: rub.name,
        items: []
      };
    });

    // Agrupar ítems cargados
    this.items.forEach(item => {
      if (grouped[item.rubricId]) {
        grouped[item.rubricId].items.push(item);
      }
    });

    return grouped;
  }

  // Agregar un ítem al presupuesto (inicia con precio = 0)
  addItem(catalogItemId, qty = 1, customDescription = '', price = 0) {
    // Buscar en el catálogo
    let foundCatalogItem = null;
    let rubricId = '';
    
    for (let rub of AAIERIC_CATALOG) {
      const match = rub.items.find(it => it.id === catalogItemId);
      if (match) {
        foundCatalogItem = match;
        rubricId = rub.id;
        break;
      }
    }

    if (!foundCatalogItem) return null;

    const newItem = {
      id: 'b_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      catalogItemId: foundCatalogItem.id,
      rubricId: rubricId,
      description: customDescription || foundCatalogItem.text,
      qty: Number(qty) || 1,
      unit: foundCatalogItem.unit,
      price: Number(price) || 0
    };

    this.items.push(newItem);
    return newItem;
  }

  // Eliminar un ítem por ID
  removeItem(itemId) {
    const index = this.items.findIndex(it => it.id === itemId);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  // Actualizar cantidad, descripción o precio unitario de un ítem
  updateItem(itemId, fields) {
    const item = this.items.find(it => it.id === itemId);
    if (item) {
      if (fields.qty !== undefined) item.qty = Number(fields.qty) || 0;
      if (fields.description !== undefined) item.description = fields.description;
      if (fields.price !== undefined) item.price = Number(fields.price) || 0;
      return true;
    }
    return false;
  }

  // Calcular total acumulado del presupuesto
  getTotalBudget() {
    return this.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  }

  // Limpiar todo el presupuesto
  clear() {
    this.items = [];
  }

  // Serializar datos
  serialize() {
    return this.items;
  }
}
