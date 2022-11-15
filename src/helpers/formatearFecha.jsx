export const formatearFecha = fecha => {
    // '2022-11-13T19:31:57.779Z'
    const nuevaFecha = new Date(fecha.split('T')[0].split('-'))
    // console.lnog(nuevaFecha)
    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return nuevaFecha.toLocaleDateString('es-ES', opciones)
}