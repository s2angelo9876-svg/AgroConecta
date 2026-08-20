export interface Message {
  id: string;
  senderId: "me" | "other";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  productName: string;
  lastMessage: string;
  unread: boolean;
  messages: Message[];
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=100&q=80`;

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "María López",
    avatar: img("photo-1573496359142-b8d87734a5a2"),
    productName: "Tomate",
    lastMessage: "¿Podrías reservarme 100 kg para el viernes?",
    unread: true,
    messages: [
      {
        id: "m1",
        senderId: "other",
        text: "Hola Juan, vi tu publicación de Tomate.",
        time: "09:30",
      },
      {
        id: "m2",
        senderId: "me",
        text: "Hola María, claro. ¿Cuánto necesitas?",
        time: "09:35",
      },
      {
        id: "m3",
        senderId: "other",
        text: "¿Podrías reservarme 100 kg para el viernes?",
        time: "09:40",
      },
    ],
  },
  {
    id: "c2",
    name: "Carlos Huamán",
    avatar: img("photo-1560250097-0b93528c311a"),
    productName: "Uva Red Globe",
    lastMessage: "Te paso el precio por mayoreo en un momento.",
    unread: false,
    messages: [
      {
        id: "m4",
        senderId: "other",
        text: "Buenos días, ¿aún tienes Uva Red Globe?",
        time: "Ayer",
      },
      {
        id: "m5",
        senderId: "me",
        text: "Sí, 1,200 kg disponibles.",
        time: "Ayer",
      },
      {
        id: "m6",
        senderId: "other",
        text: "Te paso el precio por mayoreo en un momento.",
        time: "Ayer",
      },
    ],
  },
];
