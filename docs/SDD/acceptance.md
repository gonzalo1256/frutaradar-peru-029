# Criterios de aceptación y trazabilidad · v0.3

- AC01 → FR01/09: 24 PDF oficiales y 72 precios en el corte inicial, tres frutas por reporte, con fuente, fecha, página, envase y conversión. Contraste independiente de tablas geométricas con las 72 filas.
- AC02 → FR02: corte 20/10 excluye posteriores; 25/10 usa última observación del 24; antes del corpus produce vacío. Ningún día ausente se interpola.
- AC03 → FR02/05: 24/28 días de cobertura al 28/10 por fruta. Promedios de siete días y campo Ayer no generan observaciones.
- AC04 → FR03/04: UI solo con corpus real, calidad desconocida bloquea referencia aunque haya 24 días. Antigüedad superior a dos días degrada estado; volumen no genera recomendación.
- AC05 → FR04: pruebas sintéticas de umbral 21 días y descuento 10 %; 20 días o calidad desconocida no califican. Nunca se produce instrucción automática de compra.
- AC06 → FR06: selector costa/selva distingue orientación genérica de plátano; naranja/sandía y origen específico siguen desconocidos.
- AC07 → FR07: al 28/10, naranja 161 t, bizcocho 77 t, sandía 108 t; no se usa total de mercado. El origen permanece null.
- AC08 → FR08: selección cambia cálculo, volumen y exportación. Envase/kg verificables; cantidad inválida produce error; 2 kg de naranja con 21,50/24 dan 1,79 PEN al redondear total.
- AC09 → FR09: coma/punto, falta de fruta, duplicado, fecha incorrecta, equivalencia inválida, PDF no válido y cambio de columnas; fallos conservan data.json y registran contador; ejecución sin cambios no lo reescribe.
- AC10 → calidad: UI de escritorio/móvil, enlaces PDF con página, JSON exportable, estado de actualización y errores. Sin red externa necesaria para dibujar el panel.
- AC11 → FR10: automatización ACTIVE confirmada mediante herramienta nativa, 11:00 Lima, identidad conservada; se verifica ejecución manual e idempotencia. La primera ejecución programada es observación futura, no aceptación ya realizada.

La aceptación técnica se documenta con evidencias en validation.md. El piloto de producto y la aceptación del usuario no se infieren de estas comprobaciones.

## Canasta multi-mercado · 10/11/2026

- AC12 → FR01/07: 43 opciones visibles, 34 con observaciones de precio, 2.440 observaciones, 27 PDF fuente y corte del 9/11/2026. El registro conserva precio PEN/kg, fecha, mercado y enlace/página oficial.
- AC13 → FR02/03: filtros por categoría, producto, etiqueta literal de variedad, mercado y fecha; coincidencias de fecha/producto/variedad muestran ambos mercados y su diferencia solo cuando existen dos precios.
- AC14 → FR06: atributos “mandarina sin pepa”, “uva verde sin pepa” y “manzana verde chilena” quedan seleccionables sin observación ni precio heredado. Las cinco sugerencias de arveja, ajo, acelga, perejil y culantro indican que no se encontró precio comparable en los boletines revisados.
- AC15 → cobertura: las etiquetas de betarraga, espinaca, coliflor, kion, Piña Golden, Palta Fuerte y plátanos/frutillas solicitados se cotejaron con los reportes oficiales detallados en research-log.md.
- AC16 → interfaz: se revisó que los selectores producen filas con fecha, mercado, S/kg y página; la selección de un atributo no confirmado da cero observaciones y muestra la razón en pantalla.

Estos criterios validan cobertura y trazabilidad observable. No evalúan utilidad de compra, calidad homogénea ni ahorro. Los resultados de la suite listados en validation.md pertenecen a la entrega previa v0.2, no a esta ampliación.
