const DOCUMENT_TYPE_ALIASES = {
  CC: "NATIONAL_ID",
  CE: "FOREIGNER_ID",
  PASAPORTE: "PASSPORT",
  TI: "NATIONAL_ID",
};

const GENDER_ALIASES = {
  Masculino: "MALE",
  Femenino: "FEMALE",
  Otro: "OTHER",
  M: "MALE",
  F: "FEMALE",
};

function normalizeDocumentType(value) {
  if (!value) {
    return "";
  }
  var key = String(value).trim();
  var upper = key.toUpperCase();
  return DOCUMENT_TYPE_ALIASES[key] || DOCUMENT_TYPE_ALIASES[upper] || key;
}

function normalizeGender(value) {
  if (!value) {
    return "";
  }
  var key = String(value).trim();
  return GENDER_ALIASES[key] || key;
}

function parseDireccionResidencia(direccionResidencia) {
  var raw = (direccionResidencia || "").trim();
  if (!raw) {
    return { address: "", city: "" };
  }
  var parts = raw.split(",").map(function (part) {
    return part.trim();
  }).filter(function (part) {
    return part.length > 0;
  });
  if (parts.length === 0) {
    return { address: "", city: "" };
  }
  if (parts.length === 1) {
    return { address: parts[0], city: "" };
  }
  return {
    address: parts[0],
    city: parts.slice(1).join(", "),
  };
}

function buildEmployeeCode(colaborador) {
  if (colaborador.codigoEmpleado) {
    return String(colaborador.codigoEmpleado).trim();
  }
  if (colaborador.employeeCode) {
    return String(colaborador.employeeCode).trim();
  }
  if (colaborador.id != null && String(colaborador.id).trim()) {
    return "EMP-" + String(colaborador.id).trim();
  }
  return "";
}

/**
 * Mapea un colaborador del API al modelo del formulario de datos básicos.
 * @param {Object} colaborador
 * @returns {Object}
 */
export function colaboradorToForm(colaborador) {
  if (!colaborador) {
    return null;
  }

  var address = parseDireccionResidencia(colaborador.direccionResidencia);

  return {
    employeeCode: buildEmployeeCode(colaborador),
    documentType: normalizeDocumentType(
      colaborador.tipoDocumento || colaborador.documentType
    ),
    documentNumber: colaborador.numeroDocumento || colaborador.documentNumber || "",
    fullName: colaborador.nombreCompleto || colaborador.fullName || "",
    birthDate: colaborador.fechaNacimiento || colaborador.birthDate || "",
    gender: normalizeGender(colaborador.genero || colaborador.gender),
    corporateEmail:
      colaborador.correoElectronico || colaborador.corporateEmail || "",
    personalEmail: colaborador.correoPersonal || colaborador.personalEmail || "",
    mobilePhone: colaborador.telefono || colaborador.mobilePhone || "",
    alternatePhone: colaborador.telefonoAlterno || colaborador.alternatePhone || "",
    address: address.address,
    city: address.city,
    country: colaborador.nacionalidad || colaborador.country || "Colombia",
    contractType: colaborador.tipoContrato || colaborador.contractType || "",
    startDate: colaborador.fechaIngreso || colaborador.startDate || "",
    endDate: colaborador.fechaFin || colaborador.endDate || "",
    baseSalary:
      colaborador.salario != null
        ? colaborador.salario
        : colaborador.baseSalary != null
          ? colaborador.baseSalary
          : null,
  };
}

/**
 * Construye el DTO de colaborador para crear o actualizar desde el formulario.
 * @param {Object} form
 * @param {Object} existing - registro existente (requerido en edición)
 * @returns {Object}
 */
export function formToColaboradorDto(form, existing) {
  var base = existing || {};
  var addressParts = [];
  if (form.address) {
    addressParts.push(form.address);
  }
  if (form.city) {
    addressParts.push(form.city);
  }
  var direccion =
    addressParts.length > 0
      ? addressParts.join(", ")
      : base.direccionResidencia || "";

  return {
    id: base.id,
    nombreCompleto: form.fullName,
    tipoDocumento: form.documentType,
    numeroDocumento: form.documentNumber,
    fechaNacimiento: form.birthDate,
    genero: form.gender,
    nacionalidad: form.country || base.nacionalidad || "Colombia",
    telefono: form.mobilePhone,
    correoElectronico: form.corporateEmail,
    direccionResidencia: direccion,
    fechaIngreso: form.startDate,
    tipoContrato: form.contractType,
    salario:
      form.baseSalary != null && form.baseSalary !== ""
        ? Number(form.baseSalary)
        : base.salario,
    estado: base.estado || "Activo",
    nivelEducativo: base.nivelEducativo,
    profesion: base.profesion,
    experienciaLaboral: base.experienciaLaboral,
    urlCertificadoPdf: base.urlCertificadoPdf,
    eps: base.eps,
    fondoPension: base.fondoPension,
    arl: base.arl,
  };
}
