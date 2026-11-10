# Validación de la entrega · v0.4

Cierre técnico: 29/10/2026, America/Lima. Corte del dataset: 28/10/2026. Propuesta SDD y demo con datos reales implementadas y verificadas; aceptación humana y piloto pendientes.

## Ampliación de canasta · 10/11/2026

La comprobación de fuentes y variedades se amplió a la colección diaria de boletines MIDAGRI GMML/MMF2 y a reportes detallados de MMF2. El detalle de cada observación de la demo enlaza al PDF oficial y página. Se mantiene como último corte incorporado el dato más reciente que publica el recolector; los días ausentes quedan vacíos.

- 43 opciones de catálogo; 34 familias con precios observados y 9 opciones que permanecen sugeridas o con atributos no confirmados.
- 2.440 observaciones y 27 PDF fuente; último reporte observado 9/11/2026 en la copia que se revisa para esta edición.
- La interfaz incorpora filtros de categoría, producto, variedad, mercado y fecha. El detalle expone S/kg, día observado, mercado y enlace a fuente/página. La comparación alinea fecha, producto y rótulo oficial exacto; si uno de los mercados no presenta observación equivalente, su precio y la diferencia quedan como “—”.
- Las etiquetas de la fuente verifican Piña Golden, Manzana Importada (Chilena), Palta Fuerte Costa; plátanos Bizcocho, Isla, Manzano y Seda; fresas Sabrina y San Andreas; Beterraga/Espinaca/Coliflor Criolla-Serrana y Kion Costa/Selva.
- “Mandarina sin pepa”, “Uva verde sin pepa” y “Manzana verde chilena” se muestran como atributos pendientes sin heredar precios. “Uva Rosada Sin Pepa” es el rótulo encontrado; no acredita color verde. Ajo, acelga, arveja, perejil y culantro quedan visibles como sugerencias sin precio comparable.
- Los precios por envase solo se normalizan cuando el PDF declara el peso equivalente. La cifra siempre permanece vinculada a la fecha y al mercado que la publicó.

Este apartado registra revisión de datos y de la interfaz ampliada. Los resultados de las pruebas listadas abajo pertenecen a la entrega v0.2 del 29/10/2026 y no se presentan como pruebas ejecutadas sobre v0.3.

## Publicación web

Publicada en GitHub Pages: [https://gonzalo1256.github.io/frutaradar-peru-029/](https://gonzalo1256.github.io/frutaradar-peru-029/). El repositorio público aislado contiene solo los activos estáticos de FrutaRadar, su dataset, evidencia de la entrega y documentos SDD seleccionados; no contiene el resto de Atlas. La publicación es una instantánea del 10/11/2026 y no se actualiza automáticamente cuando corre el recolector local.

En la actualización v0.4, la sección minorista registra 13 observaciones de Tottus y Wong con fecha de consulta 10/11/2026. La revisión manual de la demo local muestra las 13 filas, precios originales/unidades y vínculos a ficha; al filtrar “Verduras y hortalizas” quedan betarraga, coliflor y espinaca (tres registros, solo espinaca comparable por kg). La publicación incluye retail-data.json por separado del histórico MIDAGRI y conserva advertencias de ubicación y stock.

## Datos y fuentes

- 24 PDF oficiales conservados en evidence/reports/, 72 observaciones de tres frutas. Cada fuente conserva URL del documento y del compendio, fecha, recuperación, página y SHA-256.
- Contraste independiente por método: pypdf extrae filas textuales; pdfplumber reconstruye tablas por geometría. Las 72 filas coinciden en precio Hoy por envase, equivalencia, unidad y volumen Hoy. Resultado: [auditoría](../../evidence/audit.json).
- Revisión visual de las páginas 2 y 3 de reportes 20 y 28/10: encabezados Ayer/Hoy, columnas de medias, envases y pesos confirmados. [Página de muestra 28/10](../../evidence/qa/2026-10-28-page-3.png).
- Datos del 28/10: naranja 21,50/24 = 0,895833… PEN/kg y 161 t; bizcocho 26,50/18 = 1,472222… PEN/kg y 77 t; sandía 0,98 PEN/kg y 108 t.
- Se conservan las 37 observaciones de prensa previas en [archivo](../../press-archive.json). Dos discrepancias del 20/10 quedan expuestas: naranja 0,98 en prensa frente a 22,75/24 en PDF; sandía 0,93 frente a 0,95. No se promedian ni se hereda calidad del artículo.

## Pruebas ejecutadas

- node --test tests/core.test.cjs: 8 pruebas aprobadas; corpus, corte temporal, días ausentes, cobertura, umbrales, calidad, volumen por fruta, conversiones, exportación y rechazo de registros inválidos.
- Python incluido con Codex, -m unittest discover -s tests -p 'test_*.py': 12 pruebas aprobadas. Parser diario y archivo de prensa; números, listas, unidades/pesos, fecha, columnas, ausencias, duplicados, descubrimiento, exclusión de futuros, fallos atómicos, idempotencia y bloqueo concurrente. Los errores impresos por fixtures son fallos simulados esperados, no incidencias de producción.
- node --check app.js y core.js: sintaxis correcta.
- node tests/http.cjs: página, scripts, estilos, dataset, estado, automatización, archivo de prensa, auditoría y SDD devuelven HTTP 200; ruta interna .local bloqueada y POST rechazado.
- Ejecución real del recolector el 29/10 a las 01:05–01:06: éxito, sin cambios, 72 observaciones y 24 documentos. data.json conserva sus bytes y fecha de cambio del 28/10; status.json registra la consulta del 29/10. Último dato con un día de antigüedad y sin fallos consecutivos.

## Recorrido de navegador observado

Chrome, navegador real. Inicio al corte 29/10 muestra dato 28/10, tres frutas y cobertura 23/28: el 1/10 queda fuera de la ventana móvil. Al corte 28/10 la cobertura es 24/28. Precio antiguo no se etiqueta como precio de hoy.

Selección de sandía y corte 20/10 actualiza precio a 0,95 PEN/kg, volumen a 58 t y 3 kg a 2,85 PEN. Naranja 2 kg se calcula con 21,50/24 sin redondeo previo: total 1,79 PEN. Exportación descargada desde el navegador y comprobada como JSON v0.2, con fecha de corte y precio 0,95 en la selección histórica; la exportación anterior v0.1 permanece separada.

Fuentes y cobertura muestra los 24 reportes y las dos discrepancias, con ambas URLs. Calendario costa/selva cambia su orientación y conserva desconocidos en naranja/sandía. Confianza permanece limitada por calidad/origen/ruta, aunque hay volumen y cobertura diaria.

Revisión visual de escritorio y ancho efectivo de 390 píxeles CSS: sin desbordamiento horizontal global (scrollWidth y clientWidth de 380, con scrollbar). Navegación y tablas conservan desplazamiento interno cuando corresponde. Se corrigió la alineación de fechas extremas del gráfico para evitar recortes. No se observaron errores de consola. No se realizó auditoría completa de accesibilidad ni prueba con lector de pantalla.

[Captura del radar](../../evidence/qa/demo-desktop.jpg) · [vista móvil](../../evidence/qa/demo-mobile.jpg) · [fuentes](../../evidence/qa/demo-sources.jpg).

## Actualización local y publicación web

La configuración local del recolector mantiene la consulta diaria a las 11:00 de Lima y el estado se conserva en status.json en el entorno del mantenedor. Este dato describe la copia local, no la disponibilidad de la tarea en internet.

La web publicada es una instantánea estática de los archivos disponibles al compilarla. No recibe cambios diarios del colector local; cada fila muestra la fecha observada y, al pasar dos días, la interfaz marca la serie como desactualizada hasta publicar una actualización nueva.

## Integración y límites

La entrega de octubre actualizó el estado de #029, tarjeta de portada, modal de catálogo y su generador, fichas, listado de subproyectos, changelog y registro de entrega. enriquecer_catalogo.py y verificar_atlas.cjs aprobaron las 188 fichas bilingües; registrar_entrega.cjs registró 23 interfaces. comprobar_documentos.py aprobó 3345 referencias Markdown y un paquete de 1110 archivos. El ZIP de Atlas se regeneró tras una primera comprobación de integridad fallida. En esta ampliación no se modificó el servidor local ni se editaron archivos de sources/.

Calendario específico de naranja/sandía y bizcocho, metodología de calidad/calibre, procedencia, rutas y avisos vigentes siguen pendientes. La caché no detecta reemplazos silenciosos del PDF bajo una URL idéntica; sí procesa cambios de enlace/versionado. El producto no ofrece predicción ni recomendación de compra validada. La aceptación del usuario exige el piloto descrito en backlog.md.
