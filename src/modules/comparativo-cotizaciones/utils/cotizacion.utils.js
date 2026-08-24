export function calcularValorTotal(cantidad, valorUnitario) {
  return (cantidad || 0) * (valorUnitario || 0);
}

export function construirMatrizComparacion(items, proveedores) {
  // Normalizar nombres de productos para evitar duplicados por mayúsculas/espacios
  const productos = [...new Set(items.map(i => i.nombreProducto.trim()))];
  
  const matriz = productos.map(prod => {
    const ofertas = items.filter(i => i.nombreProducto.trim() === prod);
    
    // Todos los precios unitarios para este producto entre todos los proveedores
    const preciosValidos = ofertas.map(o => Number(o.valorUnitario)).filter(p => !isNaN(p) && p > 0);
    const min = preciosValidos.length > 0 ? Math.min(...preciosValidos) : 0;
    const max = preciosValidos.length > 0 ? Math.max(...preciosValidos) : 0;

    const precios = proveedores.map(prov => {
      // Buscar la oferta de este proveedor para este producto
      const item = ofertas.find(o => 
        (o.idProveedor && o.idProveedor === prov.idProveedor) || 
        (o.proveedorNit && o.proveedorNit === prov.nit)
      );
      if (!item) return null;

      return {
        idItem: item.idItem, // Para referencia si existe
        proveedorId: prov.idProveedor || prov.nit,
        valorUnitario: Number(item.valorUnitario),
        valorTotal: calcularValorTotal(item.cantidad, item.valorUnitario),
        esMenor: Number(item.valorUnitario) === min && preciosValidos.length > 1,
        esMayor: Number(item.valorUnitario) === max && preciosValidos.length > 1
      };
    });

    return {
      producto: prod,
      cantidad: ofertas[0].cantidad,
      unidad: ofertas[0].unidad,
      precios,
      min,
      max,
      ganadorId: ofertas[0].esGanador ? ofertas[0].idProveedor : null
    };
  });

  // Totales por proveedor
  const totalesProveedores = proveedores.map(prov => {
    const total = items
      .filter(i => (i.idProveedor && i.idProveedor === prov.idProveedor) || (i.proveedorNit && i.proveedorNit === prov.nit))
      .reduce((sum, i) => sum + calcularValorTotal(i.cantidad, i.valorUnitario), 0);
    
    return {
      id: prov.idProveedor || prov.nit,
      nombre: prov.nombre,
      total
    };
  });

  return {
    productos,
    proveedores: totalesProveedores,
    matriz
  };
}

export function calcularDiferencia(min, max) {
  if (!min || min === 0) return 0;
  return ((max - min) / min) * 100;
}
