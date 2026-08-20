export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Nuevo interesado",
    message: "María López vio tu publicación de Tomate y quiere negociar.",
    time: "Hace 10 min",
    read: false,
  },
  {
    id: "n2",
    title: "Coincidencia encontrada",
    message:
      "Un restaurante de Ica busca 100 kg de Palta Hass esta semana.",
    time: "Hace 2 h",
    read: false,
  },
  {
    id: "n3",
    title: "Recordatorio",
    message: "Actualiza el stock de tu Maíz Amarillo si ya se vendió.",
    time: "Ayer",
    read: true,
  },
];
