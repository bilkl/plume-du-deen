export interface StoreProduct {
  id: number;
  slug: string;
  href: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  gallery?: string[];
  price: number | null;
  priceNote?: string;
  availabilityNote?: string;
  features: string[];
  category: string;
  tags: string[];
  digitalPrice: number | null;
  paperPrice: number;
  rating?: number;
  reviewsCount?: number;
  isNew?: boolean;
  paperLimited?: boolean;
}

const limitedAvailability = 'Disponible en PDF et en version papier très limitée.';

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 4,
    slug: 'invocations-des-prophetes',
    href: '/produit/invocations-des-prophetes',
    name: 'Invocations des Prophètes',
    title: 'Invocations des Prophètes',
    subtitle: "L'essentiel du cœur",
    description:
      "Un compagnon du quotidien pour ralentir, se recentrer et déposer ses mots entre les mains d'Allah.",
    longDescription: `Dans le silence d'un instant sincère, ce livre devient un refuge.
Une invitation à ralentir, à se recentrer, à déposer ses mots entre les mains d'Allah avec douceur et confiance.

Pensé comme un compagnon du quotidien, Invocations des Prophètes rassemble des paroles inspirées, transmises à travers les récits prophétiques. Chaque page est une respiration. Chaque invocation, une lumière.

Son design épuré, habillé d'un blanc ivoire et de délicates dorures, évoque la pureté et la noblesse du rappel. Il s'intègre naturellement dans vos moments les plus précieux : après la prière, au réveil, avant de dormir ou lors d'un instant de méditation.

Le toucher est doux, l'esthétique apaisante, et l'ensemble invite à une connexion profonde, sans distraction.`,
    image: '/images/invocations-prophetes.jpeg',
    gallery: ['/images/invocations-prophetes.jpeg'],
    price: 7.9,
    availabilityNote: limitedAvailability,
    features: [
      'Invocations issues des récits prophétiques',
      'Compagnon spirituel pour les moments de rappel',
      'Design blanc ivoire avec dorures délicates',
      'Lecture douce après la prière, au réveil ou avant de dormir',
      'Version PDF disponible',
      'Version papier en quantité très limitée'
    ],
    category: 'Invocations',
    tags: ['invocations', 'prophètes', 'dua', 'rappel', 'livre'],
    digitalPrice: 7.9,
    paperPrice: 7.9,
    isNew: true,
    paperLimited: true
  },
  {
    id: 5,
    slug: 'suivi-adoration',
    href: '/produit/suivi-adoration',
    name: "Suivi d'Adoration",
    title: "Suivi d'Adoration",
    subtitle: 'Tableau spirituel élégant',
    description:
      'Un tableau raffiné pour suivre vos prières, votre lecture du Coran, le dhikr, les invocations et les bonnes actions.',
    longDescription: `Dans la douceur d'un moment suspendu, ce tableau devient un compagnon discret de votre cheminement vers Allah. Chaque case cochée est une intention posée, un pas sincère vers une adoration plus consciente, plus apaisée.

Pensé comme un rituel visuel, ce suivi d'adoration vous accompagne jour après jour. Il structure vos prières (Fajr, Dhuhr, Asr, Maghreb, Isha) avec clarté et sérénité. Les espaces dédiés à la lecture du Coran, au dhikr, aux invocations et aux bonnes actions invitent à un équilibre spirituel complet.

Son design raffiné, aux nuances crème et dorées, évoque une atmosphère paisible et lumineuse. Posé sur un bureau, accroché à un mur ou glissé dans un espace de prière, il transforme votre quotidien en un rappel doux et constant.`,
    image: '/images/suivi-adoration.jpeg',
    gallery: ['/images/suivi-adoration.jpeg'],
    price: 7.9,
    availabilityNote: `${limitedAvailability} Stylo effaçable inclus.`,
    features: [
      'Suivi des prières Fajr, Dhuhr, Asr, Maghreb et Isha',
      'Espaces dédiés au Coran, au dhikr et aux invocations',
      'Section pour les bonnes actions quotidiennes',
      'Design crème et doré, sobre et lumineux',
      'Stylo effaçable inclus',
      'À poser, accrocher ou glisser dans un espace de prière',
      'Version papier en quantité très limitée'
    ],
    category: 'Organisation spirituelle',
    tags: ['adoration', 'prière', 'suivi', 'coran', 'dhikr'],
    digitalPrice: 7.9,
    paperPrice: 7.9,
    isNew: true,
    paperLimited: true
  },
  {
    id: 6,
    slug: 'suspension-porte-spirituelle',
    href: '/produit/suspension-porte-spirituelle',
    name: 'Suspension de Porte Spirituelle',
    title: 'Suspension de Porte Spirituelle',
    subtitle: 'Instant préservé',
    description:
      'Une suspension de porte douce et élégante pour protéger vos instants de Coran, de prière et de recueillement.',
    longDescription: `Dans le silence d'un moment sacré, cette suspension devient une douce frontière entre vous et le monde. Elle protège vos instants d'adoration, avec délicatesse et élégance.

Accrochée à votre porte, elle transmet un message clair et apaisant : « Ne pas déranger. Je lis le Coran » ou « Ne pas déranger. Je suis en prière ». Chaque détail visuel évoque la sérénité : le Coran ouvert sur son support, le chapelet délicatement posé, la lumière tamisée d'une lanterne... ou encore la posture paisible de la prière dans un décor inspiré de l'architecture islamique.

Son design aux tons doux - beige, vert sauge et touches dorées - s'intègre harmonieusement dans votre intérieur. Elle crée une atmosphère respectueuse et intime, propice à la concentration et à la connexion avec Allah.`,
    image: '/images/suspension-porte-coran.jpeg',
    gallery: ['/images/suspension-porte-coran.jpeg', '/images/suspension-porte-priere.jpeg'],
    price: 5,
    availabilityNote: 'Tarif par suspension. Disponible en version papier très limitée.',
    features: [
      'Deux messages : lecture du Coran ou moment de prière',
      'Visuels apaisants avec Coran, chapelet, lanterne et décor spirituel',
      'Tons beige, vert sauge et touches dorées',
      'Idéale pour préserver un instant de concentration',
      'À accrocher directement sur une porte',
      'Version papier en quantité très limitée'
    ],
    category: 'Décoration spirituelle',
    tags: ['porte', 'prière', 'coran', 'adoration', 'décoration'],
    digitalPrice: 5,
    paperPrice: 5,
    isNew: true,
    paperLimited: true
  },
  {
    id: 7,
    slug: 'marque-pages-invocations',
    href: '/produit/marque-pages-invocations',
    name: 'Marque-Pages Invocations',
    title: 'Marque-Pages Invocations',
    subtitle: 'Éclats de rappel',
    description:
      'Des marque-pages délicats ornés d’invocations en arabe pour transformer chaque pause de lecture en rappel.',
    longDescription: `Dans la douceur d'une page tournée, ces marque-pages deviennent des compagnons silencieux. Ils murmurent des invocations au cœur, apaisent l'âme et rappellent l'essentiel, à chaque instant.

Délicatement conçus dans des teintes naturelles - vert sauge, beige poudré et gris perle - ils s'intègrent avec harmonie à vos moments de lecture. Chaque pièce est ornée d'une invocation en arabe, soigneusement mise en valeur, comme un souffle spirituel posé sur le papier.

Leur texture douce, leur finition épurée et leur pampille élégante apportent une sensation de sérénité à chaque utilisation. Glissés dans votre Mushaf ou votre livre, ils transforment chaque pause en rappel, chaque reprise en intention.`,
    image: '/images/marque-pages-invocations.jpeg',
    gallery: ['/images/marque-pages-invocations.jpeg'],
    price: 5,
    availabilityNote: 'Tarif par marque-page. Disponible en version papier très limitée.',
    features: [
      'Invocations en arabe mises en valeur',
      'Teintes naturelles : vert sauge, beige poudré et gris perle',
      'Finition épurée avec pampille élégante',
      'Adapté au Mushaf et aux lectures spirituelles',
      'Compagnon discret pour les pauses de rappel',
      'Version papier en quantité très limitée'
    ],
    category: 'Papeterie spirituelle',
    tags: ['marque-pages', 'invocations', 'lecture', 'mushaf', 'rappel'],
    digitalPrice: 5,
    paperPrice: 5,
    isNew: true,
    paperLimited: true
  },
  {
    id: 1,
    slug: 'invocations',
    href: '/invocations',
    name: 'Les Invocations du Coran',
    title: 'Les Invocations du Coran',
    subtitle: 'Nouveau',
    description: 'Dossier de 30 cartes avec les invocations du Coran pour accompagner votre quotidien.',
    longDescription: `Dossier de 30 cartes avec les invocations du Coran pour accompagner votre quotidien.
Chaque carte contient une invocation précieuse tirée du Coran, accompagnée de sa traduction
et d'une réflexion spirituelle pour vous guider dans votre pratique quotidienne.

Ce recueil unique rassemble les invocations les plus puissantes et les plus utilisées du Coran,
présentées de manière élégante et accessible. Chaque carte est conçue pour être un rappel
constant de la présence divine dans votre vie.

Que vous soyez débutant ou pratiquant expérimenté, ces cartes vous accompagneront dans
vos moments de prière, de méditation ou de simple recueillement spirituel.`,
    image: '/images/invocations.png',
    price: 4.9,
    availabilityNote: 'Version numérique - PDF.',
    features: [
      "30 cartes d'invocations sélectionnées",
      'Traductions claires et accessibles',
      'Réflexions spirituelles guidées',
      'Design élégant et sobre',
      'Format pratique (10x15cm)',
      'Papier de qualité supérieure'
    ],
    category: 'Invocations',
    tags: ['invocations', 'coran', 'dua', 'cartes'],
    digitalPrice: 4.9,
    paperPrice: 0,
    rating: 5,
    reviewsCount: 2
  },
  {
    id: 2,
    slug: 'planner',
    href: '/planner',
    name: 'Planner Ramadan ALIF',
    title: 'Planner Ramadan ALIF',
    subtitle: 'Offert',
    description: "Le rituel guidé de 30 jours pour transformer son Ramadan de l'intérieur.",
    longDescription: `Le rituel guidé de 30 jours pour transformer son Ramadan de l'intérieur.

Ce planner unique vous accompagne jour après jour avec des réflexions spirituelles,
des invocations, des objectifs quotidiens et un suivi de vos progrès spirituels.

Chaque jour du Ramadan, découvrez :
• Une invocation coranique puissante
• Une réflexion spirituelle profonde
• Des objectifs quotidiens adaptés à votre niveau
• Un espace pour noter vos progrès et vos intentions
• Des rappels pour les prières et les lectures du Coran

Conçu pour les hommes et les femmes qui souhaitent vivre un Ramadan transformateur,
ce planner vous guide vers une expérience spirituelle enrichissante et mémorable.`,
    image: '/images/planner.png',
    price: 0,
    availabilityNote: 'Version numérique - PDF offert.',
    features: [
      '30 jours de guidance spirituelle',
      'Invocations coraniques quotidiennes',
      'Suivi des prières et lectures',
      'Espace de réflexion personnelle',
      'Objectifs quotidiens adaptés',
      'Design élégant et pratique'
    ],
    category: 'Organisation spirituelle',
    tags: ['ramadan', 'planner', 'prière', 'coran'],
    digitalPrice: 0,
    paperPrice: 0,
    rating: 5,
    reviewsCount: 2
  },
  {
    id: 3,
    slug: '99noms',
    href: '/99noms',
    name: "Les 99 Noms d'Allah",
    title: "Les 99 Noms d'Allah",
    subtitle: 'Idée cadeau',
    description: "Entrer en relation avec les Noms d'Allah à travers 99 cartes spirituelles.",
    longDescription: `Entrer en relation avec les Noms d'Allah à travers 99 cartes spirituelles.

Chaque carte présente un des 99 Noms d'Allah avec :
• Sa signification profonde et originelle
• Une invocation associée pour l'invoquer
• Une réflexion spirituelle pour approfondir votre connexion divine
• Un design élégant et méditatif

Ces cartes sont conçues pour vous accompagner dans votre cheminement spirituel,
vous permettant de découvrir et d'approfondir votre relation avec le Créateur à travers
Ses Noms les plus beaux.

Parfait comme cadeau pour les occasions spéciales ou pour enrichir votre pratique
quotidienne, ce jeu de cartes devient un compagnon précieux dans votre quête spirituelle.`,
    image: '/images/99noms.png',
    price: 9.9,
    availabilityNote: 'Version numérique - PDF.',
    features: [
      "99 cartes avec les Noms d'Allah",
      'Significations détaillées',
      'Invocations associées',
      'Réflexions spirituelles',
      'Design méditatif et élégant',
      'Format pratique (7x10cm)'
    ],
    category: 'Connaissance spirituelle',
    tags: ['99 noms', 'allah', 'cartes', 'invocations'],
    digitalPrice: 9.9,
    paperPrice: 0,
    rating: 5,
    reviewsCount: 2
  }
];

export function getProductBySlug(slug: string | undefined) {
  return STORE_PRODUCTS.find((product) => product.slug === slug);
}

export function getProductById(id: number) {
  return STORE_PRODUCTS.find((product) => product.id === id);
}
