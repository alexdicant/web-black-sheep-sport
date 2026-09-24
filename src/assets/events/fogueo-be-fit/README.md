# Fotografías de Fogueo Be Fit

Para crear eventos y consultar el flujo operativo completo, sigue [EVENTOS.md](../../../../EVENTOS.md).

Copia directamente en el primer nivel de esta carpeta, sin subdirectorios, las previews finales exportadas desde Lightroom, ya optimizadas y con su marca de agua. No copies fotografías de otros eventos.

El nombre de cada archivo se convierte automáticamente en el código visible, el identificador de selección y el código enviado a WhatsApp. El punto y la extensión no forman parte del código.

Los códigos deben cumplir todas estas reglas:

- solo pueden contener `A-Z`, `a-z`, `0-9`, `_` y `-`;
- deben cumplir la regex `/^[A-Za-z0-9_-]+$/`;
- máximo 40 caracteres;
- deben ser únicos dentro del evento;
- los duplicados se comparan sin distinguir mayúsculas/minúsculas (`ABC` y `abc` son duplicados);
- no usar espacios, tildes, símbolos ni otros caracteres especiales distintos de `_` y `-`.

Si el lote no cumple estas reglas, el build falla con un error claro. No se sanitizan, renombran ni omiten archivos automáticamente.

Ejemplos válidos:

- `DSC07521.jpg` → `DSC07521`
- `BF-001.jpg` → `BF-001`
- `ATLETA_014.jpg` → `ATLETA_014`

Ejemplos inválidos:

- `foto final.jpg` (espacio)
- `BF#001.jpg` (`#`)
- `foto(2).jpg` (paréntesis)

Formatos admitidos por la implementación: `.webp`, `.jpg`, `.jpeg`, `.png` y `.avif`, en minúsculas. Las extensiones deben ir en minúsculas; archivos en subdirectorios no se procesan.

Una carpeta sin fotografías en esos formatos produce automáticamente el estado "Próximamente" y no renderiza controles de selección o compra.

Para publicar la galería, solo hay que copiar aquí las fotografías y ejecutar el build/deploy. La página las descubre automáticamente: no hay que modificarla ni añadir cada fotografía manualmente. Si un filename es inválido o produce un código duplicado, el build falla y muestra el evento, los filenames implicados y la regla que debe corregirse.

No añadas otra marca de agua desde la web: los archivos finales ya deben traerla incorporada.
