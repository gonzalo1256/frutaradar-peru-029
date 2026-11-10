# Especificación del producto · v0.4

FrutaRadar Perú / Peru Fruit Radar · #029 · 10/11/2026 · America/Lima. Demo local con cobertura real ampliada por MIDAGRI. Aceptación humana y utilidad predictiva pendientes.

## Necesidad y alcance

Una persona que compra alimentos en Lima necesita consultar precios mayoristas y referencias retail por producto y variedad, distinguiendo canal, fecha y unidad. También debe separar el dato observado de temporada, calidad, origen y ruta que aún no se conoce. Una cosecha abundante no garantiza precio bajo en destino.

Mercados observados: Gran Mercado Mayorista de Lima (GMML) y Mercado Mayorista de Frutas N.º 2 (MMF2). La canasta contempla frutas, verduras, tubérculos y raíces habituales, además de sugerencias. El catálogo contiene 43 opciones; 34 tienen observaciones de precio y 9 quedan visibles como sugerencia o atributo no confirmado. El último corte incorporado en esta edición es 9/11/2026.

## Requisitos implementados

- FR01: conservar fecha observada, mercado, rótulo oficial de producto y variedad, valor PEN/kg, página y URL del PDF fuente.
- FR02: comparar por fecha, categoría, producto y denominación exacta de variedad; mostrar precio GMML, precio MMF2 y diferencia cuando ambos existen. Un mercado ausente se representa como “—”.
- FR03: filtros por categoría, producto, variedad, mercado y fecha; la fecha inicial selecciona la publicación más reciente presente en el dataset.
- FR04: precio por kilogramo visible por observación. Precios de envase solo se convierten si el reporte declara equivalencia en kg; no se deduce el peso por costumbre.
- FR05: incluir fresas, bayas y variedades de frutas que aparecen en los reportes detallados de MMF2 y las etiquetas diarias GMML/MMF2.
- FR06: mantener a la vista los productos sugeridos sin precio comprobado y los atributos solicitados que la fuente no declara. No heredar precio de un producto parecido.
- FR07: cada fila ofrece vínculo a la fuente oficial y número de página. La página de Fuentes conserva fechas, estado HTTP y huella SHA-256 de PDF archivados localmente.
- FR08: el recolector revisa los índices y páginas mensuales oficiales, valida fecha, estructura, unidad y etiqueta del producto, y conserva la última canasta válida si falla.
- FR09: actualizar el histórico anterior de MMF2 y la canasta multi-mercado con la tarea diaria de este chat, manteniendo su horario de las 11:00 de America/Lima.
- FR10: exponer fecha más reciente, conteos, mercados y límites de cobertura en UI y SDD.
- FR11: guardar cotizaciones minoristas separadas de la canasta mayorista, con tienda, canal, nombre comercial, fecha de consulta, importe, unidad, disponibilidad y ficha fuente por fila.
- FR12: mostrar S/kg cuando el retailer publica precio/kg o declara el peso neto de la presentación; los productos cotizados por unidad y sin peso quedan sin equivalente por kg.
- FR13: filtrar el snapshot minorista por categoría, producto, etiqueta/variedad, supermercado y fecha; la fila siempre conserva el canal y la fuente.
- FR14: informar si el precio es promocional, si falta seleccionar distrito/tienda y si la ficha marca falta de stock. Un precio listado no garantiza compra ni entrega.
- FR15: mantener retail-data.json como snapshot separado. El colector diario solo actualiza publicaciones MIDAGRI y no hace scraping ni despliega automáticamente precios comerciales.

## Catálogo y resolución varietal

Con observaciones: mandarina, papaya, arándano, zarzamora/mora, uva, piña, manzana, fresa, plátano, sandía, palta, limón, naranja, mango, granadilla, maracuyá, pera, chirimoya, tomate, cebolla, zanahoria, lechuga, pepino, brócoli, coliflor, espinaca, zapallo, choclo/maíz, betarraga, papa, camote, yuca, olluco y kion.

Sugerencias visibles sin precio comparable en los reportes revisados: arveja verde, ajo, acelga, perejil y culantro. Atributos separados sin precio asignado: mandarina sin pepa, uva verde sin pepa, manzana verde chilena y pepino rayado/melón.

Los rótulos verifican algunas variedades específicas: Piña Golden; Manzana Importada (Chilena); Palta Fuerte Costa; Plátano Bizcocho, Isla, Manzano y Seda; fresa Sabrina y San Andreas; betarraga Criolla/Serrana; y kion Costa/Selva. Los reportes describen mandarina Malvacea, Satsuma Costa y Tangerina, pero no mencionan pepa. “Uva Rosada Sin Pepa” declara sin pepa, sin declarar verde. “Manzana Importada (Chilena)” identifica origen comercial, no color. Por ello la UI conserva estas solicitudes como atributos pendientes, sin asociarles un precio de la familia.

## Política de interpretación

La comparación mayorista por kg homologa unidad publicada, no calidad, tamaño, empaque, origen agrícola, flete, merma ni margen minorista. Las cotizaciones de supermercados se presentan como canal separado y tampoco homologan calidad, distrito, entrega, stock o descuentos condicionados. Se comparan etiquetas solo cuando coinciden fecha, producto y texto de variedad; no se mezclan días ni nombres aproximados.

No se predice baja de precios ni se activa recomendación de compra. El snapshot retail tiene fecha de captura visible y no pertenece al refresco diario; una página pública puede quedar desfasada aunque el precio mayorista local se actualice. Sin disponibilidad por distrito, calidad declarada, ruta y costos de destino, la demo es una consulta trazable, no un precio garantizado para el hogar. Un dato mayorista de más de dos días se marca desactualizado por política operativa.

## Éxito y siguiente evaluación

La demo aporta valor si una persona puede filtrar su producto y variedad, identificar fecha y mercado, abrir la fuente y distinguir un precio observado de un atributo sin validar. Próxima evaluación: revisar con hogares de Lima si los filtros y la comparación son comprensibles antes de diseñar alertas o pronóstico.
