# Arquitectura y decisiones · v0.4

## ADR-001 · Demo estática y archivos de datos

La ruta local de Atlas 4180 se conserva. El navegador lee data.json, market-data.json, retail-data.json, status.json y automation.json; la pantalla nunca descarga ni interpreta reportes desde la sesión del usuario. El recolector MIDAGRI corre por separado en el equipo disponible para la automatización.

data.json conserva el histórico detallado original de MMF2 para el radar de frutas, con valores por envase, equivalencia, volumen y calidad desconocida cuando aplica. market-data.json añade la canasta filtrable GMML/MMF2, manteniendo cada mercado, rótulo literal de variedad, fecha de observación, precio PEN/kg, URL y página fuente. No se mezclan ambas estructuras en una serie que oculte nivel o unidad.

## ADR-002 · Fuentes oficiales y descubrimiento

El catálogo MIDAGRI publica índices de boletines conjuntos para GMML y MMF2. El recolector revisa los índices mensual y diario recientes, elige un PDF oficial accesible y valida firma, páginas, fecha y tablas de la publicación. Los reportes diarios detallados MMF2 descubiertos desde la colección de precios se usan para completar frutas, bayas y variedades separadas.

Solo se aceptan URL HTTPS de dominios oficiales identificados por el recolector. El precio se captura de las celdas del día observado, nunca de medias semanales. Las conversiones de empaque de MMF2 requieren que peso y unidad estén escritos en el mismo reporte. Los artículos de prensa anteriores permanecen archivados en press-archive.json, fuera de la serie principal.

## ADR-003 · Contrato de canasta

Cada observación identifica fecha, categoría, product_id, nombre de producto, rótulo de variedad, mercado, nombre de mercado, precio por kg, URL y página del PDF, fecha de fuente, unidad/conversión declarada y calidad si se publica. Una denominación sin equivalencia explícita mantiene “no declarada”; no se hereda calidad ni atributos por semejanza.

El catálogo guarda cobertura como precio observado, sin precio en fuente o atributo no confirmado. Productos sugeridos quedan seleccionables con explicación de falta de precio. Variantes solicitadas que no están verificadas no reciben observaciones por herencia de la familia.

## ADR-004 · Comparación por fecha y etiqueta

Los filtros se encadenan por categoría, producto, variedad, mercado y fecha. La tabla alinea observaciones que coinciden en fecha, familia y texto exacto de variedad. GMML y MMF2 conservan columnas independientes; si un mercado no publicó una fila coincidente se muestra “—”. La diferencia aparece solo cuando ambos precios existen.

La comparación es una lectura de precios mayoristas publicados. No normaliza calidad, tamaño, origen, condiciones de empaque, flete, merma ni venta minorista. Sin esas dimensiones no constituye una recomendación de sustitución o compra.

## ADR-005 · Integridad, estado y recuperación

El recolector valida documento, fecha, columnas, producto exacto, unidades y valores positivos antes de promover el nuevo market-data.json. Escritura temporal y reemplazo mantienen la última copia buena si una descarga o parseo falla. status.json distingue estado, fallos y última fecha del histórico de frutas y de la canasta multi-mercado. Un fallo no convierte una cifra antigua en actual.

Los PDF de cada descarga quedan archivados con SHA-256, fecha, URL, estado HTTP y página. Un documento corregido produce una huella distinta; no se reemplaza evidencia anterior para ocultar cambios.

## ADR-006 · Ingesta diaria

La automatización nativa de este chat corre tools/collect.py diariamente a las 11:00 de America/Lima. El punto de entrada ejecuta el recolector MMF2 anterior y, si termina correctamente, tools/collect_markets.py. Requiere equipo y Codex disponibles; el inicio real puede retrasarse si el chat está ocupado.

Un dato de más de dos días o tres fallos seguidos requiere atención. Un éxito sin datos nuevos conserva la copia válida y no es por sí solo un error. No se cambió el horario ni se añadió una tarea duplicada.

## Límites

No hay predicción, sugerencia de compra, climatología o bloqueo de ruta unido a una observación. Los datos mayoristas no declaran calidad homogénea. UI y exportación deben mantener la fecha y el mercado junto a cada precio.

## ADR-007 · Snapshot retail aislado

retail-data.json contiene cotizaciones de fichas online observadas manualmente. Cada fila conserva supermercado/canal, fecha de captura, nombre comercial, unidad publicada, disponibilidad visible y URL. La UI filtra categoría, producto, etiqueta comercial, retailer y fecha en una vista separada de GMML/MMF2.

Un precio expresado por kg se conserva; una presentación solo se convierte cuando el peso aparece explícitamente en el rótulo o ficha. Los productos por unidad sin peso, como betarraga y coliflor del corte actual, no reciben valor S/kg. La fecha no prueba que el mismo precio continúe vigente al abrir el enlace. Las páginas pueden requerir distrito/tienda; Wong mostró ausencia de stock en las fichas consultadas y Tottus solicitó ubicación para validar cobertura.

El snapshot retail no forma parte de tools/collect.py ni de la automatización MIDAGRI, no usa ubicación del usuario y no activa recomendaciones. La publicación GitHub Pages sigue siendo manual y estática; cada release copia el archivo actual solo tras revisar los cambios.
