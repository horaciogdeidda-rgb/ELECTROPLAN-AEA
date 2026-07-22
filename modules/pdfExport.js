/**
 * ELECTROPLAN.AEA - Módulo de Exportación a PDF de Memoria de Cálculo y Presupuesto
 * Genera un reporte técnico de alta gama con estética Cream (#F2F0E9) y tipografía de planos.
 * Utiliza tablas tradicionales con anchos fijos y layouts fijos para asegurar la compatibilidad
 * con html2canvas y evitar solapamientos. Cada página está contenida en un bloque de tamaño A4 fijo.
 */

export function exportProjectToPDF(project, budgetGrouped, includePrices = true) {
  const { name, calculatorState } = project;
  const dateStr = new Date(project.timestamp || Date.now()).toLocaleDateString('es-AR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Calcular el total de mano de obra
  let totalBudget = 0;
  for (let rubricId in budgetGrouped) {
    const rub = budgetGrouped[rubricId];
    if (rub.items) {
      rub.items.forEach(item => {
        totalBudget += (item.qty * (item.price || 0));
      });
    }
  }

  // 1. Crear Contenedor Padre invisible en coordenadas (0,0) pero de alto 0
  const renderWrapper = document.createElement('div');
  renderWrapper.style.position = 'fixed';
  renderWrapper.style.top = '0';
  renderWrapper.style.left = '0';
  renderWrapper.style.width = '800px';
  renderWrapper.style.height = '0';
  renderWrapper.style.overflow = 'hidden';
  renderWrapper.style.zIndex = '-9999';
  renderWrapper.style.pointerEvents = 'none';

  // 2. Crear las páginas del PDF
  const pdfContainer = document.createElement('div');
  pdfContainer.style.width = '800px';
  pdfContainer.style.boxSizing = 'border-box';
  pdfContainer.style.backgroundColor = '#F2F0E9'; // Crema global

  // CSS de Impresión con máxima compatibilidad para html2canvas (evita CSS Grid/Flexbox)
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,700&family=JetBrains+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    
    .pdf-page {
      width: 800px;
      min-height: 1120px; /* Alto A4 proporcional a 96DPI */
      padding: 45px 50px;
      box-sizing: border-box;
      background-color: #F2F0E9;
      position: relative;
      page-break-after: always;
      font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
      color: #1A1A1A;
    }
    
    .pdf-page:last-child {
      page-break-after: avoid !important;
    }

    /* Encabezados y títulos */
    .pdf-header {
      width: 100%;
      border-bottom: 3px solid #2E4036;
      margin-bottom: 25px;
      padding-bottom: 12px;
    }

    .brand-logo {
      font-size: 26px;
      font-weight: 800;
      color: #2E4036;
      letter-spacing: -0.5px;
    }
    
    .brand-logo span {
      color: #CC5833;
    }

    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .meta-table td {
      padding: 4px 0;
      font-size: 12px;
    }

    .section-title {
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      color: #F2F0E9;
      background-color: #2E4036;
      padding: 8px 12px;
      margin-top: 25px;
      margin-bottom: 15px;
      letter-spacing: 0.5px;
      border-left: 5px solid #CC5833;
    }

    /* Tablas de datos fijas */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      table-layout: fixed;
    }

    .data-table th {
      background-color: rgba(46, 64, 54, 0.08);
      color: #2E4036;
      font-size: 11px;
      text-transform: uppercase;
      font-family: "JetBrains Mono", monospace;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid #2E4036;
      font-weight: bold;
    }

    .data-table td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(46, 64, 54, 0.15);
      font-size: 12.5px;
      vertical-align: middle;
      word-wrap: break-word;
    }

    .data-table tr.even-row td {
      background-color: rgba(46, 64, 54, 0.03);
    }

    .rubric-header-row td {
      background-color: rgba(46, 64, 54, 0.05) !important;
      font-weight: bold;
      color: #2E4036;
      font-size: 12px;
      text-transform: uppercase;
      border-bottom: 1px solid #2E4036;
      padding-top: 12px;
      padding-bottom: 6px;
    }

    /* Tipografía especial de unidades */
    .italic-unit {
      font-family: "Cormorant Garamond", Georgia, serif;
      font-style: italic;
      font-weight: bold;
      font-size: 14.5px;
      color: #2E4036;
    }

    .mono-data {
      font-family: "JetBrains Mono", monospace;
      font-size: 12px;
      font-weight: 500;
    }

    /* Badges de conformidad */
    .badge {
      display: inline-block;
      padding: 4px 8px;
      font-family: "JetBrains Mono", monospace;
      font-size: 10px;
      font-weight: bold;
      border-radius: 4px;
      text-align: center;
    }

    .badge-ok {
      background-color: #2E4036;
      color: #F2F0E9;
    }

    .badge-err {
      background-color: #CC5833;
      color: #F2F0E9;
    }

    /* Notas e Info */
    .note-box {
      font-size: 11px;
      color: #1A1A1A;
      border: 1px solid #CC5833;
      border-left: 5px solid #CC5833;
      padding: 12px 15px;
      margin-bottom: 25px;
      background-color: rgba(204, 88, 51, 0.04);
      line-height: 1.4;
    }

    .total-box {
      margin-top: 25px;
      text-align: right;
      background-color: rgba(46, 64, 54, 0.05);
      border: 2px solid #2E4036;
      padding: 15px 25px;
      border-radius: 4px;
    }

    .pdf-footer {
      position: absolute;
      bottom: 45px;
      left: 50px;
      right: 50px;
      border-top: 1px solid rgba(46, 64, 54, 0.2);
      padding-top: 12px;
      font-size: 9.5px;
      color: #555;
      text-align: center;
      font-family: "JetBrains Mono", monospace;
      line-height: 1.3;
    }
  `;
  pdfContainer.appendChild(style);

  // Mapeos de textos
  const methodNames = {
    'conduit': 'Cañería embutida / a la vista (Reglamentario)',
    'tray': 'Bandeja portacables perforada',
    'underground': 'Subterráneo directamente enterrado'
  };

  const appNames = {
    'lighting': 'Iluminación de Uso General (IUG / IUE)',
    'power': 'Tomacorrientes de Uso General (TUG / TUE)',
    'special': 'Uso Especial (TUE / APM)',
    'main': 'Línea Principal o Seccional (Alimentación de Tableros)'
  };

  const hasCalc = calculatorState && calculatorState.Ib;

  // --- PÁGINA 1: MEMORIA DE CÁLCULO ---
  const page1 = document.createElement('div');
  page1.className = 'pdf-page';

  let page1HTML = `
    <!-- HEADER -->
    <div class="pdf-header">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td>
            <div class="brand-logo">ELECTROPLAN<span>.AEA</span></div>
            <div style="font-size: 11px; color: #555; margin-top: 3px; font-weight: bold; text-transform: uppercase;">
              Memoria de Cálculo Reglamentaria (AEA 90364)
            </div>
          </td>
          <td style="text-align: right; font-size: 12px;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #CC5833; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">
              Documento Técnico Oficial
            </div>
            <strong>Fecha:</strong> ${dateStr}
          </td>
        </tr>
      </table>
    </div>

    <!-- METADATOS DE PROYECTO -->
    <table class="meta-table">
      <tr>
        <td style="width: 15%; font-weight: bold; color: #2E4036;">PROYECTO:</td>
        <td style="width: 45%; font-weight: bold; border-bottom: 1px solid rgba(0,0,0,0.1);">${name}</td>
        <td style="width: 15%; font-weight: bold; color: #2E4036; text-align: right; padding-right: 15px;">NORMATIVA:</td>
        <td style="width: 25%; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; border-bottom: 1px solid rgba(0,0,0,0.1); font-weight: bold;">AEA 90364-7-770</td>
      </tr>
      <tr>
        <td style="font-weight: bold; color: #2E4036;">INSTALADOR:</td>
        <td style="border-bottom: 1px solid rgba(0,0,0,0.1); font-style: italic;">Técnico / Oficial Electricista Matriculado</td>
        <td style="font-weight: bold; color: #2E4036; text-align: right; padding-right: 15px;">ESTADO:</td>
        <td style="border-bottom: 1px solid rgba(0,0,0,0.1); font-weight: bold; color: ${ (calculatorState.isOverload || calculatorState.isVDropTooHigh) ? '#CC5833' : '#2E4036' };">
          ${ (calculatorState.isOverload || calculatorState.isVDropTooHigh) ? 'CON ANOMALÍAS' : 'CONFORME' }
        </td>
      </tr>
    </table>
  `;

  if (hasCalc) {
    const isTrifasico = calculatorState.voltage === 380;
    
    page1HTML += `
      <div class="section-title">1. Dimensionamiento de Conductores de Línea</div>
      
      <table class="data-table">
        <colgroup>
          <col style="width: 50%;">
          <col style="width: 50%;">
        </colgroup>
        <thead>
          <tr>
            <th>Parámetros de Diseño y Canalización</th>
            <th>Cálculos y Cumplimiento Normativo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tipo de Aplicación de Línea:</strong><br>${appNames[calculatorState.appType] || calculatorState.appType}</td>
            <td><strong>Sección Recomendada de Conductor:</strong><br>
              <span style="font-size: 17px; font-weight: 800; color: #CC5833;">
                ${calculatorState.recommendedSection} <span class="italic-unit">mm²</span>
              </span>
            </td>
          </tr>
          <tr class="even-row">
            <td><strong>Tensión de Servicio:</strong><br class="mono-data">${calculatorState.voltage} <span class="italic-unit">V</span> (${isTrifasico ? 'Trifásica' : 'Monofásica'})</td>
            <td><strong>Corriente de Proyecto (Ib):</strong><br class="mono-data">${calculatorState.Ib} <span class="italic-unit">A</span> (${calculatorState.powerkW} <span class="italic-unit">kW</span>)</td>
          </tr>
          <tr>
            <td><strong>Longitud del Circuito:</strong><br class="mono-data">${calculatorState.length} <span class="italic-unit">m</span></td>
            <td><strong>Capacidad Admisible Corregida (Iz):</strong><br class="mono-data">${calculatorState.izCorrected} <span class="italic-unit">A</span> <span style="font-size:10px; color:#666;">(Base: ${calculatorState.izBase}A)</span></td>
          </tr>
          <tr class="even-row">
            <td><strong>Método de Canalización:</strong><br>${methodNames[calculatorState.method] || calculatorState.method}</td>
            <td><strong>Caída de Tensión Calculada (ΔU):</strong><br class="mono-data">${calculatorState.vDrop} <span class="italic-unit">V</span> (<strong style="color: ${calculatorState.isVDropTooHigh ? '#CC5833' : '#2E4036'}; font-size:13px;">${calculatorState.vDropPercent}%</strong>)</td>
          </tr>
          <tr>
            <td><strong>Factores Ambientales:</strong><br>Temperatura: ${calculatorState.temp}°C (ft: ${calculatorState.factors.temp})</td>
            <td><strong>Verificación Térmica (Ib ≤ Iz):</strong><br>
              <span class="badge ${calculatorState.isOverload ? 'badge-err' : 'badge-ok'}">
                ${calculatorState.isOverload ? 'EXCEDE CAPACIDAD (SOBRECARGA)' : 'CONFORME'}
              </span>
            </td>
          </tr>
          <tr class="even-row">
            <td><strong>Factores de Agrupamiento:</strong><br>${calculatorState.circuits} cto/s. en conducto (fg: ${calculatorState.factors.grouping})</td>
            <td><strong>Verificación Caída (Límite: ${calculatorState.vDropLimit}%):</strong><br>
              <span class="badge ${calculatorState.isVDropTooHigh ? 'badge-err' : 'badge-ok'}">
                ${calculatorState.isVDropTooHigh ? 'EXCEDE LÍMITE REGLAMENTARIO' : 'CONFORME'}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    `;

    // Si tiene cálculo de cañería
    if (calculatorState.conduitResult) {
      const cr = calculatorState.conduitResult;
      page1HTML += `
        <div class="section-title">2. Verificación de Llenado de Cañería (Fill-Rate)</div>
        
        <table class="data-table">
          <colgroup>
            <col style="width: 25%;">
            <col style="width: 28%;">
            <col style="width: 15%;">
            <col style="width: 15%;">
            <col style="width: 17%;">
          </colgroup>
          <thead>
            <tr>
              <th>Cañería Comercial</th>
              <th>Conductores Instalados</th>
              <th style="text-align: center;">Ocupación</th>
              <th style="text-align: center;">Límite</th>
              <th style="text-align: center;">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${cr.pipeName}</strong><br><span style="font-size:10px; color:#555;">(DI: ${cr.pipeInnerDiameter}mm)</span></td>
              <td class="mono-data" style="font-size: 11px;">
                ${cr.cableDetails.map(c => `${c.qty}x${c.section}mm²`).join('<br>')}
              </td>
              <td class="mono-data" style="text-align: center; font-weight: bold; color: ${cr.isExceeded ? '#CC5833' : '#2E4036'}; font-size: 13px;">${cr.fillRate}%</td>
              <td class="mono-data" style="text-align: center;">${cr.limit}%</td>
              <td style="text-align: center;">
                <span class="badge ${cr.isExceeded ? 'badge-err' : 'badge-ok'}">
                  ${cr.isExceeded ? 'EXCEDIDO' : 'CONFORME'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        
        ${cr.isExceeded ? `
          <div class="note-box" style="margin-top: -10px;">
            <strong>ADVERTENCIA TÉCNICA:</strong> Se ha superado el factor de llenado máximo del 35% dictado por la AEA para cañerías con 3 o más conductores. Esto dificulta la disipación térmica de los cables e incrementa el riesgo de cortocircuito por tracción en el cableado. <strong>Se recomienda migrar a: ${cr.recommendedPipe}</strong>.
          </div>
        ` : ''}
      `;
    }
  } else {
    page1HTML += `
      <div style="padding: 100px 20px; text-align: center; color: #666; font-style: italic;">
        No se registran cálculos de dimensionamiento eléctrico para este reporte.
      </div>
    `;
  }

  page1HTML += `
    <!-- FOOTER -->
    <div class="pdf-footer">
      <strong>ELECTROPLAN.AEA</strong> — Software de Monitoreo Eléctrico y Planificación bajo la Norma AEA 90364.<br>
      La firma y ejecución de la obra es responsabilidad exclusiva del instalador matriculado interviniente.
    </div>
  `;

  page1.innerHTML = page1HTML;
  pdfContainer.appendChild(page1);

  // --- PÁGINA 2: PRESUPUESTO COMERCIAL / TÉCNICO (AAIERIC) ---
  let hasBudget = false;
  for (let rubricId in budgetGrouped) {
    if (budgetGrouped[rubricId].items && budgetGrouped[rubricId].items.length > 0) {
      hasBudget = true;
      break;
    }
  }

  if (hasBudget) {
    const page2 = document.createElement('div');
    page2.className = 'pdf-page';

    const documentTypeTitle = includePrices ? 'Presupuesto Comercial de Mano de Obra' : 'Presupuesto Técnico sin Precios';
    const subtitleText = includePrices ? 'Detalle Comercial de Costos Unitarios y Totales' : 'Planilla Técnica de Rubros y Cantidades a Ejecutar';

    let page2HTML = `
      <!-- HEADER -->
      <div class="pdf-header">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td>
              <div class="brand-logo">ELECTROPLAN<span>.AEA</span></div>
              <div style="font-size: 11px; color: #555; margin-top: 3px; font-weight: bold; text-transform: uppercase;">
                ${documentTypeTitle}
              </div>
            </td>
            <td style="text-align: right; font-size: 12px;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #CC5833; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">
                Estructura AAIERIC 2026
              </div>
              <strong>Proyecto:</strong> ${name}
            </td>
          </tr>
        </table>
      </div>

      <div class="note-box" style="border-color: #2E4036; background-color: rgba(46,64,54,0.03);">
        <strong>ESTRUCTURA DE RUBROS AAIERIC (Junio 2026):</strong> Tareas normalizadas bajo los lineamientos de la Asociación Argentina de Instaladores Electricistas. ${includePrices ? 'Los costos detallados a continuación corresponden a la cotización de mano de obra establecida por el electricista.' : 'Planilla técnica exclusivamente de carácter indicativo y descriptivo para el control e inspección de las tareas cargadas en obra.'}
      </div>
    `;

    // Renderizar tablas de rubros
    for (let rubricId in budgetGrouped) {
      const rub = budgetGrouped[rubricId];
      if (!rub.items || rub.items.length === 0) continue;

      const columnDefs = includePrices ? `
        <colgroup>
          <col style="width: 8%;">
          <col style="width: 48%;">
          <col style="width: 10%;">
          <col style="width: 10%;">
          <col style="width: 11%;">
          <col style="width: 13%;">
        </colgroup>
        <thead>
          <tr>
            <th style="text-align: center;">Ítem</th>
            <th>Descripción de Tareas Realizadas</th>
            <th style="text-align: center;">Cant</th>
            <th style="text-align: center;">Unid</th>
            <th style="text-align: right;">Unitario</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
      ` : `
        <colgroup>
          <col style="width: 10%;">
          <col style="width: 65%;">
          <col style="width: 12%;">
          <col style="width: 13%;">
        </colgroup>
        <thead>
          <tr>
            <th style="text-align: center;">Ítem</th>
            <th>Descripción de Tareas Realizadas</th>
            <th style="text-align: center;">Cantidad</th>
            <th style="text-align: center;">Unidad</th>
          </tr>
        </thead>
      `;

      page2HTML += `
        <div style="font-size: 11px; font-weight: 800; color: #2E4036; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; margin-top: 15px; margin-bottom: 6px; border-bottom: 2px solid rgba(46,64,54,0.3); padding-bottom: 2px;">
          ${rub.rubricName}
        </div>
        
        <table class="data-table">
          ${columnDefs}
          <tbody>
      `;

      rub.items.forEach((item, index) => {
        const isEven = (index % 2 === 0);
        const rowClass = isEven ? 'even-row' : '';
        const itemSubtotal = item.qty * (item.price || 0);

        page2HTML += includePrices ? `
          <tr class="${rowClass}">
            <td class="mono-data" style="text-align: center;">${index + 1}</td>
            <td style="font-size: 11.5px; font-weight: 600;">${item.description}</td>
            <td class="mono-data" style="text-align: center; font-weight: bold;">${item.qty}</td>
            <td class="mono-data" style="text-align: center;">${item.unit}</td>
            <td class="mono-data" style="text-align: right;">$${item.price.toLocaleString('es-AR')}</td>
            <td class="mono-data" style="text-align: right; font-weight: bold; color: #2E4036;">$${itemSubtotal.toLocaleString('es-AR')}</td>
          </tr>
        ` : `
          <tr class="${rowClass}">
            <td class="mono-data" style="text-align: center;">${index + 1}</td>
            <td style="font-size: 11.5px; font-weight: 600;">${item.description}</td>
            <td class="mono-data" style="text-align: center; font-weight: bold;">${item.qty}</td>
            <td class="mono-data" style="text-align: center;">${item.unit}</td>
          </tr>
        `;
      });

      page2HTML += `
          </tbody>
        </table>
      `;
    }

    // Caja de totales si es presupuesto valorizado
    if (includePrices) {
      page2HTML += `
        <div class="total-box">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-size: 11px; font-family: 'JetBrains Mono', monospace; font-weight: bold; text-transform: uppercase; color: #555; vertical-align: middle;">
                Importe Total Presupuesto Mano de Obra:
              </td>
              <td style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: #CC5833; vertical-align: middle;">
                $${totalBudget.toLocaleString('es-AR')}
              </td>
            </tr>
          </table>
        </div>
      `;
    }

    page2HTML += `
      <!-- FOOTER -->
      <div class="pdf-footer">
        <strong>ELECTROPLAN.AEA</strong> — Generador de Presupuestos Técnicos bajo rubros AAIERIC.<br>
        Documento válido como presupuesto de mano de obra. Excluye materiales y obras civiles complementarias.
      </div>
    `;

    page2.innerHTML = page2HTML;
    pdfContainer.appendChild(page2);
  }

  // Agregar el contenedor principal al wrapper invisible
  renderWrapper.appendChild(pdfContainer);
  document.body.appendChild(renderWrapper);

  // Configuración de html2pdf con prevención estricta de saltos de página incorrectos
  const opt = {
    margin: 0, // Las páginas ya tienen su padding interno de 45px 50px
    filename: `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_reporte.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      backgroundColor: '#F2F0E9' // Evitar transparencias
    },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' } // Pt da mejor renderizado de fuentes a tamaño fijo
  };

  // Exportación
  if (typeof html2pdf !== 'undefined') {
    html2pdf().set(opt).from(pdfContainer).save().then(() => {
      document.body.removeChild(renderWrapper);
    }).catch(err => {
      console.error("Error al exportar PDF con html2pdf:", err);
      alert("Error al exportar PDF. Verifique que la librería html2pdf.js esté cargada.");
      document.body.removeChild(renderWrapper);
    });
  } else {
    console.warn("html2pdf.js no encontrado. Usando fallback de impresión.");
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${name} - Reporte Técnico</title>
          <style>${style.textContent}</style>
        </head>
        <body style="background:#F2F0E9; margin: 0; padding: 20px;">
          ${pdfContainer.innerHTML}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    document.body.removeChild(renderWrapper);
  }
}
