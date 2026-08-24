export const ACCEPTED_STATUSES = ["ACEPTADO", "APROBADO", "ACCEPTED"];

export const ORDER_STATUS_THEMES = {
  borrador: {
    label: "Borrador",
    background: "#F1EFE8",
    border: "#B4B2A9",
    badge: "#D3D1C7",
    text: "#444441",
  },
  pendiente: {
    label: "Pendiente",
    background: "#FAEEDA",
    border: "#FAC775",
    badge: "#FAC775",
    text: "#633806",
  },
  rechazado: {
    label: "Rechazado",
    background: "#FCEBEB",
    border: "#F09595",
    badge: "#F7C1C1",
    text: "#791F1F",
  },
  en_proceso: {
    label: "En proceso",
    background: "#E6F1FB",
    border: "#85B7EB",
    badge: "#B5D4F4",
    text: "#0C447C",
  },
  recibido: {
    label: "Recibido",
    background: "#E1F5EE",
    border: "#5DCAA5",
    badge: "#9FE1CB",
    text: "#085041",
  },
  cerrado: {
    label: "Cerrado",
    background: "#EAF3DE",
    border: "#97C459",
    badge: "#C0DD97",
    text: "#27500A",
  },
};

export const ORDER_STATUS_OPTIONS = [
  { value: "borrador", label: "Borrador" },
  { value: "pendiente", label: "Pendiente" },
  { value: "rechazado", label: "Rechazado" },
  { value: "en_proceso", label: "En proceso" },
  { value: "recibido", label: "Recibido" },
  { value: "cerrado", label: "Cerrado" },
];
