# Investigación y evidencia real · corte 10/11/2026

## Fuentes primarias

1. [MIDAGRI · colección diaria de precios y abastecimiento GMML/MMF2](https://www.gob.pe/institucion/midagri/colecciones/338-boletin-de-abastecimiento-y-precios-en-el-mercado-mayorista-de-lima-gmml-y-mercado-de-frutas-n-2-mm-n-2). El boletín conjunto publica tablas por día para el Gran Mercado Mayorista de Lima (GMML) y el Mercado Mayorista de Frutas N.º 2 (MMF2), incluidos productos frescos, rótulos de variedad, precio y fecha.
2. [MIDAGRI · reporte de ingreso y precios MMF2, octubre de 2026](https://www.gob.pe/institucion/midagri/informes-publicaciones/8666165-reporte-de-ingreso-y-precios-en-el-mercado-mayorista-de-frutas-mmf-n-2-octubre-2026). Los reportes detallados de frutas identifican bayas y variedades que no aparecen como filas separadas en la tabla resumida conjunta y publican equivalencia de empaque cuando corresponde.
3. [MIDAGRI · boletín GMML/MMF2, noviembre de 2026](https://www.gob.pe/institucion/midagri/informes-publicaciones/8780082-boletin-de-abastecimiento-y-precios-mayoristas-en-el-mercado-mayorista-de-lima-gmml-y-mercado-de-frutas-n-2-mm-n-2-noviembre-2026). La publicación mensual enlaza los boletines diarios usados en el corte actual.

En la demo, cada observación abre el PDF oficial concreto y señala la página. El recolector conserva localmente los PDF utilizados con URL, fecha, estado HTTP y SHA-256. Los enlaces oficiales visibles en el registro son la evidencia primaria; las copias archivadas permiten repetir el parseo.

## Snapshot minorista en línea · 10/11/2026

Consulta manual de fichas comerciales de [Tottus](https://www.tottus.com.pe/tottus-pe/seleccion/frutasverdurasyhuevos) y [Wong](https://app.wong.pe/frutas-y-verduras/wong/21526?PS=18&map=c%2Cb%2CproductClusterSearchableIds), capturada a las 12:45 America/Lima. El distrito/tienda no se seleccionó; no se pide ni usa la ubicación del usuario. “Sin Stock” se preserva cuando apareció en una ficha. La fecha refleja la consulta, no una garantía de vigencia futura. `retail-data.json` mantiene el precio original, la unidad, el importe S/kg calculado cuando es válido y el enlace directo usado.

| Tienda | Producto / etiqueta de la ficha | Precio publicado | S/kg comparable | Disponibilidad al consultar | Fuente |
|---|---|---:|---:|---|---|
| Tottus | Mandarina Sin Pepa | S/ 4.40/kg | S/ 4.40 | Distrito sin confirmar | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/115906857/mandarina-sin-pepa-tottus/115906859) |
| Tottus | Uva Verde Sin Pepa | S/ 17.99/kg | S/ 17.99 | Distrito sin confirmar; ficha marca descuento 8 % sobre S/ 19.49 | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/115894679/uva-verde-sin-pepa-tottus/115894680) |
| Tottus | Manzana Granny Smith Importada | S/ 7.99/kg | S/ 7.99 | Distrito sin confirmar | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/115877832/manzana-granny-smith-importada-tottus/115877833) |
| Tottus | Piña Golden | S/ 5.29/kg | S/ 5.29 | Distrito sin confirmar | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/115832849/pina-golden-tottus/115832850) |
| Tottus | Arándanos x 500 g | S/ 14.90/envase | S/ 29.80 | Distrito sin confirmar | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/113706880/arandanos-x-500-g/113706881) |
| Tottus | Espinaca Tottus KG · empaque aprox. 300 g | S/ 12.89/kg | S/ 12.89 | Distrito sin confirmar | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/115813548/espinaca-tottus-kg/115813549) |
| Tottus | Kion Tottus · formato aprox. 250 g | S/ 9.99/kg | S/ 9.99 | Distrito sin confirmar | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/115815915/kion-tottus/115815916) |
| Tottus | Coliflor Tottus | S/ 6.70/unidad | — | Distrito sin confirmar; sin peso por pieza | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/113706458/coliflor-tottus/113706459) |
| Tottus | Beterraga Tottus | S/ 5.49/unidad | — | Distrito sin confirmar; sin peso por pieza | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/113711728/beterraga-x-un/113711729) |
| Tottus | Camote Morado | S/ 3.79/kg | S/ 3.79 | Distrito sin confirmar | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/115805636/camote-morado-tottus/115805637) |
| Tottus | Plátano Bizcocho | S/ 6.99/kg | S/ 6.99 | Distrito sin confirmar | [Ficha ↗](https://www.tottus.com.pe/tottus-pe/articulo/115813723/platano-bizcocho-tottus-x-kg/115813724) |
| Wong | Mandarina Costa x kg | S/ 5.49/kg | S/ 5.49 | La ficha indicaba “Sin Stock” | [Ficha ↗](https://app.wong.pe/mandarina-costa-x-kg-95620/p) |
| Wong | Arándanos Extra Wong 500 g | S/ 19.50/envase | S/ 39.00 | La ficha indicaba “Sin Stock” | [Ficha ↗](https://app.wong.pe/arandanos-extra-wong-500g-568391/p) |

Las conversiones de arándanos usan exclusivamente el contenido de 500 g explícito en el nombre de cada ficha. “Mandarina Costa” y “Mandarina Sin Pepa”, o las etiquetas Tottus/Wong de arándanos, no se alinean como variedades idénticas. No se generan referencias para las otras variedades del catálogo mayorista cuando un supermercado no ofrece una ficha comprobada en este snapshot.

## Cobertura comprobada

La canasta reúne 2.440 observaciones de 27 fuentes y 43 opciones catalogadas. En el corte del 10/11/2026, el último boletín disponible en el dataset corresponde al 9/11/2026. Hay 34 familias con precio observado y 9 sugerencias/atributos pendientes. La mayoría de productos GMML procede de tablas con precio directo por kg; las conversiones de MMF2 solo se realizan con el peso explícito que figura en la fuente.

Frutas: mandarina, papaya, arándano, zarzamora/mora, uva, piña, manzana, fresa, plátano, sandía, palta, limón, naranja, mango, granadilla, maracuyá, pera y chirimoya. Verduras y hortalizas: tomate, cebolla, zanahoria, lechuga, pepino, brócoli, coliflor, espinaca, zapallo, choclo/maíz y betarraga. Tubérculos/raíces y condimentos: papa, camote, yuca, olluco y kion. Sugerencias de canasta sin precio comparable hallado: arveja verde, ajo, acelga, perejil y culantro.

La fuente confirma algunos rótulos específicos:

- Mandarina Malvacea, Satsuma (Costa) y Tangerina; ninguno declara “sin pepa”.
- Uva Rosada Sin Pepa confirma el atributo sin pepa, pero el color verde no está indicado. Uva Thompson aparece con ese rótulo sin declarar color ni pepa.
- Manzana Importada (Chilena) identifica importación desde Chile, pero no declara que sea verde.
- Piña Golden; Palta Fuerte Costa.
- Plátano Bizcocho (Selva), Isla (Selva), Manzano (Selva), Seda (Selva) y Seda Congo.
- Fresa Sabrina y San Andreas en reportes detallados.
- Beterraga (Criolla/Serrana), Espinaca (Criolla/Serrana), Coliflor (Criolla/Serrana) y Kion (Costa/Selva).

La demo deja “Mandarina sin pepa”, “Uva verde sin pepa” y “Manzana verde chilena” en el selector, con su nota y sin precio asignado. La fuente resumida para pepino dice “Pepino rayado o melón”; por eso el catálogo también distingue esa etiqueta de pepino genérico. La etiqueta literal se preserva; no se extrapola un precio a un atributo ausente.

## Lectura de precios

Las observaciones actuales se concentran en MMF2 y GMML y no constituyen una muestra simultánea para todos los productos. La tabla de comparación alinea la misma fecha, familia y variedad exacta; una celda “—” significa que ese mercado no publicó una fila coincidente, no que su precio sea cero. Las diferencias tampoco ajustan calidad, calibre, origen, envase, flete, merma o margen minorista.

Ejemplos de la publicación del 9/11/2026: Arándano, S/ 12,75/kg en MMF2; Zarzamora/Mora, S/ 26,25/kg en MMF2; Beterraga (Criolla/Serrana), S/ 4,27/kg en GMML; Espinaca (Criolla/Serrana), S/ 3,38/kg en GMML; Coliflor (Criolla/Serrana), S/ 1,04/kg en GMML; Kion (Costa/Selva), S/ 3,88/kg en GMML. La tabla permite abrir cada fuente y confirmar su fecha y mercado.

## Cobertura y decisiones pendientes

El precio observado no informa por sí solo abundancia de cosecha, ruta a Lima o precio final en un hogar. Continúan pendientes la calidad/calibre comparable, procedencia de lotes, costos de transporte, alertas relevantes enlazadas a rutas y evaluación con usuarios. No se activa predicción ni recomendación de compra.
