# Plan y estado de implementación · v0.3

## Completado técnicamente

- Descubrimiento, especificación y arquitectura SDD; selección de tres frutas por datos reales.
- Descarga de 24 reportes diarios oficiales del 1 al 28/10/2026; 72 observaciones, precios por envase, equivalencias y volumen por fruta.
- Archivo de prensa separado, comparación y exposición de dos discrepancias del 20/10.
- Descubrimiento de nuevos documentos, caché verificable, promoción atómica, conservación ante fallos y bloqueo de concurrencia.
- Automatización nativa diaria a las 11:00 de Lima, estado visible y comando manual recuperable.
- UI, histórico por fecha, conversiones, abastecimiento, exportación y calendario parcial explícito.
- Ampliación de 43 opciones de canasta, 34 familias con precios, filtros por categoría/producto/variedad/mercado/fecha y fuente directa por observación: 2.440 filas y 27 PDF al corte 9/11/2026.
- Betarraga, espinaca, coliflor y kion incorporados desde el boletín conjunto oficial. Atributos varietales que la fuente no declara y cinco productos sugeridos sin observación permanecen sin precio.
- Pruebas, contraste independiente de las 72 filas y revisión visual de PDF. Resultado UI y comprobaciones del Atlas registrados en validation.md.

## P0 · Calidad y metodología

Responsable propuesto: mantenedor de datos. Obtener definición de calidad/calibre de estos reportes, su alcance por producto y equivalencia de campañas; registrar evidencia metodológica antes de habilitar referencia comparable. Si no se confirma, continuar mostrando información observada con confianza limitada.

## P1 · Calendario y riesgo

Responsable propuesto: investigador agrícola. Series regionales mensuales por variedad o calendario técnico aplicable; años base y campaña. Procedencia real de ingresos y rutas documentadas. Ingerir eventos oficiales con emisión/inicio/fin y geometría solo cuando sea posible relacionarlos con el corredor de ese producto. Mantener desconocido en caso contrario.

## P1 · Piloto de uso

Cinco consultas reales durante dos semanas, tres participantes, evidencia de fecha/unidad/calidad del precio encontrado. Evaluar tiempo de consulta y comprensión de límites. No interpretar diferencia mayorista-minorista como error predictivo o ahorro. Aceptación humana pendiente.

## P2 · Modelos e integraciones

Solo después de demostrar cobertura y calidad. Variable objetivo, cortes temporales sin fuga, comparación con persistencia y mediana estacional, error por fruta y calibración de cualquier probabilidad. Los 24 días actuales no justifican modelo predictivo.

#030, #086 y #100 pueden reutilizar contratos de comparabilidad, mercados y eventos viales. #011, #033 y #069 son conexiones de diseño. No se activó ningún conector por mencionar una relación.

La utilidad de la comparación y legibilidad de los filtros está pendiente de validación con hogares de Lima. La canasta no se convierte automáticamente en recomendaciones; la calidad, el origen del lote, la ruta y el precio minorista siguen fuera del alcance medido.
