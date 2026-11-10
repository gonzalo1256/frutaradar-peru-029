# Traspaso y operación · v0.3

Estado al 10/11/2026: canasta de 43 opciones (34 con precio oficial), 2.440 observaciones y 27 fuentes PDF del GMML/MMF2 y MMF2 detallado. Último corte incorporado: 9/11/2026 en la copia revisada. No hay pronóstico ni recomendación de compra validada.

Demo local: http://localhost:4180/subproyectos/FrutaRadar_Peru_029/ . Canasta: http://localhost:4180/subproyectos/FrutaRadar_Peru_029/#productos . SDD: docs/SDD/. El servidor Atlas existente sirve la sección; si se detuvo, ejecutar Abrir Atlas Local.cmd de Atlas.

## Operación

Desde la carpeta del subproyecto, en PowerShell:

    & 'C:/Users/gonza/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' tools/collect.py

Este punto de entrada ejecuta la actualización histórica MMF2 y después la canasta oficial multi-mercado. Un error del primer proceso detiene la cadena; un error de descarga de la canasta conserva su copia válida y registra el fallo. Leer status.json para ambos estados y la última fecha válida.

La actualización local está programada diariamente a las 11:00, America/Lima y requiere equipo y Codex disponibles. La publicación web es una instantánea y no recibe automáticamente los datos de esa tarea local. Tres fallos seguidos o más de dos días desde el último dato requieren atención.

## Evidencia

market-data.json contiene fuente, fecha, mercado, etiqueta literal de variedad, valor por kg y página PDF en cada observación. Los documentos oficiales descargados se archivan en evidence/market-bulletins/ y evidence/reports/, con SHA-256 en sus metadatos. No editar esos originales para corregir una etiqueta ni rellenar filas ausentes.

Fuente resumen: colección MIDAGRI de boletines diarios GMML/MMF2. Frutas y bayas con mayor detalle: reportes diarios MMF2. En la demo, usar el vínculo de cada fila para revisar directamente el reporte específico. SDD/research-log.md mantiene la cobertura y las denominaciones verificadas.

## Límites y siguiente paso

Los mercados publican distinto surtido y no siempre coinciden en texto de variedad; la comparación no inventa precio de contraparte. Persisten sin confirmación “mandarina sin pepa”, “uva verde sin pepa” y “manzana verde chilena”. Las sugerencias de arveja, ajo, acelga, perejil y culantro requieren un reporte oficial con precio comparable antes de completar esa cobertura.

Próxima mejora: evaluar legibilidad y utilidad de los filtros con hogares de Lima y buscar series oficiales de calidad/calibre, procedencia de lotes, clima y rutas. No habilitar predicción ni recomendaciones antes de resolver esas dimensiones.
