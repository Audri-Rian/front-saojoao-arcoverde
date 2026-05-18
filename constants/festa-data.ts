export type FestaEvent = {
  id: string;
  day: string;
  month: string;
  title: string;
  location: string;
  tag: string;
  time: string;
  description: string;
};

export const FESTA_EVENTS: FestaEvent[] = [
  {
    id: 'arraia-estacao',
    day: '20',
    month: 'Jun',
    title: 'Arraia da Estacao',
    location: 'Praca da Estacao',
    tag: 'Forro',
    time: '18:00',
    description: 'Noite de abertura com trio pe de serra, comidas tipicas e quadrilha comunitaria.',
  },
  {
    id: 'forro-pe-de-serra',
    day: '21',
    month: 'Jun',
    title: 'Noite de Forro Pe de Serra',
    location: 'Polo Multicultural',
    tag: 'Forro',
    time: '20:00',
    description:
      'Apresentacoes de artistas regionais com repertorio tradicional e participacoes especiais.',
  },
  {
    id: 'festival-coco',
    day: '22',
    month: 'Jun',
    title: 'Festival de Coco',
    location: 'Alto do Cruzeiro',
    tag: 'Tradicional',
    time: '19:30',
    description:
      'Encontro de grupos de coco com cortejo, rodas e celebracao das raizes culturais de Arcoverde.',
  },
];
