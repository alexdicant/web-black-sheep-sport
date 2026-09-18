# Fotografías de HAPPY WOOD

Copia aquí las previews finales exportadas desde Lightroom, ya optimizadas y con su marca de agua.

El nombre de cada archivo se convierte automáticamente en el código visible, el identificador de selección y el código enviado a WhatsApp. El punto y la extensión no forman parte del código.

Los códigos deben cumplir todas estas reglas:

- solo pueden contener letras `A-Z` y `a-z`, números `0-9`, `_` y `-`;
- máximo 40 caracteres;
- deben ser únicos dentro del evento;
- la unicidad se compara sin distinguir mayúsculas/minúsculas (`ABC` y `abc` son duplicados);
- no usar espacios, tildes, símbolos ni otros caracteres especiales distintos de `_` y `-`.

Si el lote no cumple estas reglas, el build falla con un error claro. No se sanitizan, renombran ni omiten archivos automáticamente.

Ejemplos válidos:

- `DSC07521.jpg` → `DSC07521`
- `HW-001.jpg` → `HW-001`
- `CORREDOR_014.jpg` → `CORREDOR_014`

Ejemplos inválidos:

- `foto final.jpg` (espacio)
- `HW#001.jpg` (`#`)
- `foto(2).jpg` (paréntesis)

Formatos admitidos por la página: `.webp`, `.jpg`, `.jpeg`, `.png` y `.avif`.

Si esta carpeta no contiene imágenes en esos formatos, la página del evento muestra el estado "Próximamente" y no renderiza controles de selección o compra.

Para publicar la galería, solo hay que copiar aquí las fotografías exportadas desde Lightroom y ejecutar el build/deploy. La página las descubre automáticamente: no hay que modificarla ni añadir cada fotografía manualmente. Si un filename es inválido o produce un código duplicado, el build falla y muestra el evento, los filenames implicados y la regla que debe corregirse.

No añadas otra marca de agua desde la web: los archivos finales ya deben traerla incorporada.
