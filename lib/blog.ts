export interface BlogSection {
  title: string
  body: string
}

export interface BlogPostLang {
  title: string
  metaDescription: string
  excerpt: string
  readTime: number
  intro: string
  sections: BlogSection[]
  ctaTitle: string
  ctaBody: string
}

export interface BlogPost {
  slug: string
  date: string
  color: string
  fr: BlogPostLang
  en: BlogPostLang
  es: BlogPostLang
}

export const posts: BlogPost[] = [
  {
    slug: 'fixer-le-bon-prix-sur-vinted',
    date: '2026-05-15',
    color: 'from-indigo-400 to-purple-500',
    fr: {
      title: 'Comment fixer le bon prix sur Vinted en 2026',
      metaDescription:
        'Découvrez comment calculer le prix idéal de vos articles Vinted : analyse de la concurrence, impact de la marque, état, saisonnalité et stratégie de négociation.',
      excerpt:
        "Trop cher, votre article ne se vend pas. Trop bas, vous perdez de l'argent. Voici comment trouver le juste prix sur Vinted.",
      readTime: 5,
      intro:
        "Fixer le bon prix sur Vinted est souvent l'un des défis les plus complexes pour les vendeurs. Trop cher, et votre article reste des semaines sans acheteur. Trop bas, et vous bradez vos affaires sans le réaliser. Bonne nouvelle : avec les bonnes méthodes, trouver le prix idéal devient beaucoup plus simple.",
      sections: [
        {
          title: 'Analysez la concurrence en temps réel',
          body: "Avant de fixer un prix, commencez toujours par chercher des articles similaires au vôtre sur Vinted. Tapez la marque, le type de vêtement, et si possible la couleur ou la taille dans la barre de recherche. Regardez les annonces actives et notez la fourchette de prix pratiquée. Si vous trouvez des articles similaires entre 15 et 25 €, vous tenez votre référence de marché. Cette analyse prend généralement 5 à 10 minutes, mais elle est indispensable pour ne pas vous tromper de segment. Plus votre recherche est précise, plus votre positionnement sera juste.",
        },
        {
          title: 'La marque : le facteur n°1 du prix',
          body: "La marque est sans doute le critère qui influence le plus le prix sur Vinted. Un jean Zara d'occasion se vendra entre 10 et 20 €, quand un jean Levi's peut atteindre 40 à 60 €, et un jean Acne Studios peut dépasser les 100 €. Les marques de luxe comme Chanel ou Balenciaga conservent 30 à 50 % de leur valeur même d'occasion. Si vous possédez un article d'une marque premium, mentionnez-la clairement dans le titre et la description, et positionnez-vous dans le haut de la fourchette du marché.",
        },
        {
          title: "L'état de l'article : ne le sous-estimez pas",
          body: "Vinted propose cinq niveaux d'état : Neuf avec étiquette, Très bon état, Bon état, État correct et Neuf sans étiquette. Chaque niveau justifie une différence de prix significative. Un article 'Neuf avec étiquette' peut légitimement se vendre à 60-70 % du prix neuf, tandis qu'un article en 'Bon état' avec quelques légères marques d'usure vaut plutôt 30-40 % du prix d'origine. Soyez toujours honnête sur l'état réel : les acheteurs déçus laissent des avis négatifs, et votre réputation sur la plateforme vaut plus que quelques euros gagnés en exagérant.",
        },
        {
          title: 'Pensez à la saisonnalité',
          body: "La demande sur Vinted est fortement saisonnière. Les manteaux d'hiver se vendent bien entre septembre et novembre, les vêtements d'été entre avril et juin, et les articles de sport en début d'année. Vendre un manteau chaud en plein juillet vous obligera à casser vos prix pour attirer des acheteurs, tandis qu'une mise en vente en octobre vous permettra d'obtenir un meilleur tarif. Anticipez ce phénomène : si vous avez des vêtements d'hiver à vendre, ne les publiez pas en été. Attendez la bonne saison.",
        },
        {
          title: 'Laissez toujours une marge de négociation',
          body: "La culture de la négociation est ancrée sur Vinted. Beaucoup d'acheteurs feront une offre inférieure avant d'acheter. Anticipez-le en fixant votre prix initial 10 à 15 % au-dessus de votre prix minimum acceptable. Ainsi, même après négociation, vous repartirez satisfait. Activez également la livraison offerte quand votre marge le permet : les annonces avec livraison gratuite obtiennent en moyenne 30 % de vues supplémentaires, ce qui accélère considérablement les ventes.",
        },
      ],
      ctaTitle: 'Calculez automatiquement le bon prix avec SellerLab AI',
      ctaBody:
        "Analyser la concurrence, évaluer l'état, tenir compte de la marque et de la saison… c'est beaucoup de travail. SellerLab AI le fait pour vous en quelques secondes. Notre calculateur de prix Vinted analyse le marché en temps réel et vous propose le prix optimal pour chaque article.",
    },
    en: {
      title: 'How to Set the Right Price on Vinted in 2026',
      metaDescription:
        'Learn how to calculate the ideal price for your Vinted items: competitor analysis, brand impact, condition, seasonality and negotiation strategy.',
      excerpt:
        "Price too high and your item won't sell. Price too low and you're losing money. Here's how to find the right price on Vinted.",
      readTime: 5,
      intro:
        "Setting the right price on Vinted is one of the most challenging aspects of selling second-hand. Too high, and your item sits for weeks. Too low, and you're giving away value without realising it. The good news: with the right approach, finding the ideal price becomes much simpler.",
      sections: [
        {
          title: 'Research the competition in real time',
          body: "Before setting a price, always search for similar items on Vinted first. Enter the brand, clothing type, and if possible colour or size in the search bar. Look at active listings and note the price range. If you find similar items between €15 and €25, that's your market reference. This analysis typically takes 5 to 10 minutes but is essential to avoid mispricing. The more specific your search, the more accurate your pricing will be.",
        },
        {
          title: 'Brand: the number-one price factor',
          body: "Brand is arguably the biggest driver of price on Vinted. A second-hand Zara pair of jeans sells for €10–20, while Levi's can reach €40–60, and Acne Studios can exceed €100. Luxury brands like Chanel or Balenciaga retain 30–50% of their value even second-hand. If you own a premium brand item, mention it clearly in the title and description, and position yourself in the higher end of the market range.",
        },
        {
          title: "Item condition: don't underestimate it",
          body: "Vinted offers five condition levels: New with tags, Very good condition, Good condition, Satisfactory condition, and New without tags. Each level justifies a significant price difference. An item 'New with tags' can legitimately sell for 60–70% of the new price, while a 'Good condition' item with minor wear is worth around 30–40% of the original price. Always be honest about the real condition — disappointed buyers leave negative reviews, and your platform reputation is worth more than a few extra euros.",
        },
        {
          title: 'Think seasonally',
          body: "Demand on Vinted is strongly seasonal. Winter coats sell well from September to November, summer clothes from April to June, and sportswear at the start of the year. Selling a winter coat in July will force you to drop your price, while listing it in October lets you ask more. Plan accordingly: if you have winter clothes to sell, don't list them in summer. Wait for the right season.",
        },
        {
          title: 'Always leave room for negotiation',
          body: "Negotiation culture is deeply embedded on Vinted. Many buyers will make a lower offer before purchasing. Anticipate this by setting your initial price 10–15% above your minimum acceptable price. That way, even after negotiating, you'll be satisfied with the deal. Enabling free shipping when your margin allows can also help — listings with free delivery get an average of 30% more views, which significantly speeds up sales.",
        },
      ],
      ctaTitle: 'Automatically calculate the right price with SellerLab AI',
      ctaBody:
        "Researching competitors, assessing condition, accounting for brand and season… that's a lot of work. SellerLab AI does it for you in seconds. Our Vinted price calculator analyses the market in real time and suggests the optimal price for each item.",
    },
    es: {
      title: 'Cómo fijar el precio correcto en Vinted en 2026',
      metaDescription:
        'Aprende a calcular el precio ideal de tus artículos de Vinted: análisis de la competencia, impacto de la marca, estado, estacionalidad y estrategia de negociación.',
      excerpt:
        'Precio muy alto y tu artículo no se vende. Precio muy bajo y pierdes dinero. Así es cómo encontrar el precio justo en Vinted.',
      readTime: 5,
      intro:
        'Fijar el precio correcto en Vinted es uno de los mayores desafíos para los vendedores de segunda mano. Demasiado alto y tu artículo se queda sin comprador durante semanas. Demasiado bajo y estás malvendiendo sin darte cuenta. La buena noticia es que, con el método adecuado, encontrar el precio ideal es mucho más sencillo.',
      sections: [
        {
          title: 'Analiza la competencia en tiempo real',
          body: 'Antes de fijar un precio, busca siempre artículos similares al tuyo en Vinted. Escribe la marca, el tipo de prenda y, si es posible, el color o la talla en la barra de búsqueda. Fíjate en los anuncios activos y anota el rango de precios. Si encuentras artículos similares entre 15 y 25 €, esa es tu referencia de mercado. Este análisis suele llevar entre 5 y 10 minutos, pero es fundamental para no equivocarte de segmento. Cuanto más específica sea tu búsqueda, más preciso será tu posicionamiento.',
        },
        {
          title: 'La marca: el factor número 1 del precio',
          body: 'La marca es sin duda el criterio que más influye en el precio en Vinted. Un pantalón vaquero de Zara de segunda mano se vende entre 10 y 20 €, mientras que uno de Levi\'s puede alcanzar los 40-60 €, y uno de Acne Studios puede superar los 100 €. Las marcas de lujo como Chanel o Balenciaga conservan entre un 30 y un 50% de su valor incluso de segunda mano. Si tienes un artículo de una marca premium, menciónalo claramente en el título y la descripción, y sitúate en la parte alta del rango de mercado.',
        },
        {
          title: 'El estado del artículo: no lo subestimes',
          body: "Vinted ofrece cinco niveles de estado: Nuevo con etiqueta, Muy buen estado, Buen estado, Estado correcto y Nuevo sin etiqueta. Cada nivel justifica una diferencia de precio significativa. Un artículo 'Nuevo con etiqueta' puede venderse legítimamente al 60-70% del precio nuevo, mientras que uno en 'Buen estado' con ligeras señales de uso vale más bien el 30-40% del precio original. Sé siempre honesto sobre el estado real: los compradores decepcionados dejan reseñas negativas, y tu reputación en la plataforma vale más que unos pocos euros extra.",
        },
        {
          title: 'Piensa en la estacionalidad',
          body: 'La demanda en Vinted es muy estacional. Los abrigos de invierno se venden bien entre septiembre y noviembre, la ropa de verano entre abril y junio, y la ropa deportiva a principios de año. Vender un abrigo en pleno julio te obligará a bajar el precio para encontrar comprador, mientras que publicarlo en octubre te permitirá pedir más. Anticipa este fenómeno: si tienes ropa de invierno para vender, no la publiques en verano. Espera la temporada adecuada.',
        },
        {
          title: 'Deja siempre margen para la negociación',
          body: 'La cultura de la negociación está muy arraigada en Vinted. Muchos compradores harán una oferta inferior antes de comprar. Anticípate fijando tu precio inicial un 10-15% por encima de tu precio mínimo aceptable. Así, incluso después de negociar, saldrás satisfecho. Activar el envío gratuito cuando tu margen lo permita también ayuda: los anuncios con envío gratuito obtienen de media un 30% más de visitas, lo que acelera considerablemente las ventas.',
        },
      ],
      ctaTitle: 'Calcula automáticamente el precio correcto con SellerLab AI',
      ctaBody:
        'Investigar la competencia, evaluar el estado, tener en cuenta la marca y la temporada… es mucho trabajo. SellerLab AI lo hace por ti en segundos. Nuestra calculadora de precios para Vinted analiza el mercado en tiempo real y te sugiere el precio óptimo para cada artículo.',
    },
  },
  {
    slug: 'astuces-photos-vinted',
    date: '2026-05-08',
    color: 'from-rose-400 to-orange-400',
    fr: {
      title: '5 astuces photo pour vendre plus vite sur Vinted',
      metaDescription:
        "Améliorez vos photos Vinted avec ces 5 astuces : lumière naturelle, fond uni, angles multiples, mise en situation et suppression de fond IA pour des annonces professionnelles.",
      excerpt:
        "Les photos sont la première chose que voit un acheteur. Voici 5 astuces simples pour des photos qui vendent.",
      readTime: 4,
      intro:
        "Sur Vinted, votre photo est votre vitrine. En quelques secondes, un acheteur décide si votre annonce vaut la peine d'être cliquée — et ce choix repose à 80 % sur la qualité de vos photos. Heureusement, vous n'avez pas besoin d'un appareil photo professionnel ou d'un studio pour prendre de belles photos. Voici 5 astuces simples et efficaces.",
      sections: [
        {
          title: '1. Misez sur la lumière naturelle',
          body: "La lumière naturelle est votre meilleure alliée pour des photos attrayantes. Positionnez-vous près d'une fenêtre par temps couvert pour une lumière diffuse et douce, sans ombres dures. Évitez absolument le flash de votre smartphone qui crée des reflets indésirables et déforme les couleurs réelles de l'article. Si vous photographiez par beau temps, évitez la lumière directe du soleil qui surexpose et blanchit les zones claires. Le matin ou en fin d'après-midi, la lumière est plus douce et plus flatteuse. Cette seule astuce peut transformer radicalement la qualité de vos annonces.",
        },
        {
          title: '2. Choisissez un fond neutre et épuré',
          body: "Le fond de votre photo peut faire ou défaire une annonce. Un fond encombré — lit défait, sol jonché d'objets, mur couvert d'affiches — détourne l'attention de l'article et donne une impression peu professionnelle. Optez pour un fond blanc, beige ou gris clair : un drap blanc bien tendu, un mur neutre, ou simplement une grande feuille de papier cartonné posée au sol. Plus votre fond est épuré, plus votre article ressort clairement. Les annonces avec fond neutre obtiennent en moyenne 40 % plus de clics que celles avec des fonds chargés.",
        },
        {
          title: '3. Multipliez les angles de vue',
          body: "Ne vous contentez pas d'une seule photo de face. Les acheteurs veulent voir l'article sous tous les angles avant de se décider. Photographiez le devant, le dos, les côtés, les détails importants (étiquette de marque, coutures, poches, fermeture éclair), et toute imperfection éventuelle. Vinted vous permet d'ajouter jusqu'à 20 photos par annonce : profitez-en. Plus vous montrez votre article, plus vous rassurez l'acheteur et réduisez le risque de conflit ou de retour. Les annonces avec 5 photos ou plus se vendent en moyenne deux fois plus vite.",
        },
        {
          title: '4. Photographiez l\'article porté ou à plat',
          body: "Pour les vêtements en particulier, deux approches fonctionnent très bien : la photo portée et la photo à plat. La photo portée permet à l'acheteur de visualiser le rendu sur un corps réel — c'est très rassurant et ça aide à imaginer comment l'article lui ira. La photo à plat sur une surface blanche est plus neutre mais très propre et professionnelle. Idéalement, combinez les deux. Évitez les photos sur cintre si possible : elles aplatissent les vêtements et leur donnent souvent l'air moins attrayant.",
        },
        {
          title: '5. Supprimez le fond automatiquement avec l\'IA',
          body: "Même avec les meilleures intentions, il n'est pas toujours possible de trouver un fond parfaitement neutre chez soi. C'est là qu'intervient l'intelligence artificielle. Des outils comme SellerLab AI permettent de supprimer le fond de vos photos en un clic et de le remplacer par un fond blanc professionnel. Résultat : des photos d'une qualité digne d'une boutique professionnelle, même si votre photo originale a été prise dans votre salon encombré. C'est l'astuce la plus efficace pour professionnaliser instantanément toutes vos annonces Vinted.",
        },
      ],
      ctaTitle: 'Obtenez des photos professionnelles avec SellerLab AI',
      ctaBody:
        "Notre outil IA supprime le fond de vos photos en un clic et vous propose des fonds professionnels. Des photos attrayantes qui attirent les acheteurs, sans studio photo ni compétences techniques particulières.",
    },
    en: {
      title: '5 Photo Tips to Sell Faster on Vinted',
      metaDescription:
        'Improve your Vinted photos with these 5 simple tips: natural light, plain background, multiple angles, styling and automatic AI background removal.',
      excerpt:
        'Photos are the first thing a buyer sees. Here are 5 simple tips for photos that actually sell.',
      readTime: 4,
      intro:
        "On Vinted, your photo is your shop window. In just a few seconds, a buyer decides whether your listing is worth clicking — and that decision is 80% based on your photos. The good news: you don't need a professional camera or studio to take great photos. Here are 5 simple, effective tips.",
      sections: [
        {
          title: '1. Make the most of natural light',
          body: "Natural light is your best ally for attractive photos. Position yourself near a window on an overcast day for soft, diffused light without harsh shadows. Avoid your smartphone flash at all costs — it creates unwanted reflections and distorts the real colours of your item. If photographing in direct sunlight, avoid midday glare which overexposes and washes out bright areas. Morning or late afternoon light is softer and more flattering. This one tip alone can radically transform the quality of your listings.",
        },
        {
          title: '2. Choose a neutral, clean background',
          body: "Your photo background can make or break a listing. A cluttered background — unmade bed, objects strewn on the floor, walls covered in posters — distracts from the item and gives an unprofessional impression. Go for a white, beige or light grey background: a tightly stretched white sheet, a neutral wall, or a large sheet of card placed on the floor. The cleaner your background, the more clearly your item stands out. Listings with a neutral background get an average of 40% more clicks than those with busy backgrounds.",
        },
        {
          title: '3. Take multiple angles',
          body: "Don't settle for a single front-facing photo. Buyers want to see the item from every angle before deciding. Photograph the front, back, sides, important details (brand label, stitching, pockets, zips) and any imperfections. Vinted lets you add up to 20 photos per listing — use them. The more you show, the more you reassure the buyer and reduce the risk of disputes or returns. Listings with 5 or more photos sell on average twice as fast.",
        },
        {
          title: '4. Photograph items worn or laid flat',
          body: "For clothes in particular, two approaches work very well: worn photos and flat-lay photos. A worn photo lets the buyer visualise how the item looks on a real body — it's very reassuring and helps them imagine how it will fit. A flat-lay on a white surface is more neutral but very clean and professional. Ideally, combine both approaches. Avoid hanger photos where possible: they flatten clothes and often make them look less appealing.",
        },
        {
          title: '5. Remove backgrounds automatically with AI',
          body: "Even with the best intentions, it's not always possible to find a perfectly neutral background at home. That's where AI comes in. Tools like SellerLab AI remove the background from your photos in one click and replace it with a professional white background. The result: photos of professional boutique quality, even if your original photo was taken in a cluttered living room. It's the most effective tip for instantly professionalising all your Vinted listings.",
        },
      ],
      ctaTitle: 'Get professional photos with SellerLab AI',
      ctaBody:
        'Our AI tool removes the background from your photos in one click and offers professional backgrounds. Attractive photos that draw in buyers — no photography studio or technical skills required.',
    },
    es: {
      title: '5 trucos de foto para vender más rápido en Vinted',
      metaDescription:
        'Mejora tus fotos de Vinted con estos 5 trucos: luz natural, fondo liso, múltiples ángulos, puesta en escena y eliminación automática de fondo con IA.',
      excerpt:
        'Las fotos son lo primero que ve un comprador. Aquí tienes 5 trucos sencillos para hacer fotos que vendan.',
      readTime: 4,
      intro:
        'En Vinted, tu foto es tu escaparate. En pocos segundos, un comprador decide si vale la pena hacer clic en tu anuncio — y esa decisión depende en un 80% de la calidad de tus fotos. La buena noticia es que no necesitas una cámara profesional ni un estudio para hacer buenas fotos. Aquí tienes 5 trucos sencillos y efectivos.',
      sections: [
        {
          title: '1. Aprovecha la luz natural',
          body: 'La luz natural es tu mejor aliada para hacer fotos atractivas. Colócate cerca de una ventana en un día nublado para obtener una luz suave y difusa, sin sombras duras. Evita a toda costa el flash de tu smartphone, que crea reflejos no deseados y distorsiona los colores reales del artículo. Si fotografías con luz solar directa, evita el mediodía porque sobreexpone y quema las zonas claras. La luz de la mañana o última hora de la tarde es más suave y favorecedora. Este único truco puede transformar radicalmente la calidad de tus anuncios.',
        },
        {
          title: '2. Elige un fondo neutro y ordenado',
          body: 'El fondo de tu foto puede hacer o deshacer un anuncio. Un fondo desordenado —cama sin hacer, objetos tirados por el suelo, paredes llenas de pósteres— distrae del artículo y da una impresión poco profesional. Opta por un fondo blanco, beis o gris claro: una sábana blanca bien estirada, una pared neutra o simplemente una hoja grande de cartulina en el suelo. Cuanto más limpio sea tu fondo, más destacará tu artículo. Los anuncios con fondo neutro obtienen de media un 40% más de clics que los que tienen fondos recargados.',
        },
        {
          title: '3. Haz fotos desde múltiples ángulos',
          body: 'No te conformes con una sola foto frontal. Los compradores quieren ver el artículo desde todos los ángulos antes de decidirse. Fotografía el delante, el detrás, los laterales, los detalles importantes (etiqueta de marca, costuras, bolsillos, cremalleras) y cualquier imperfección. Vinted te permite añadir hasta 20 fotos por anuncio: aprovéchalo. Cuanto más muestres tu artículo, más tranquilizas al comprador y reduces el riesgo de conflictos o devoluciones. Los anuncios con 5 fotos o más se venden de media el doble de rápido.',
        },
        {
          title: '4. Fotografía la prenda puesta o plana',
          body: 'Para la ropa en particular, dos enfoques funcionan muy bien: la foto puesta y la foto plana. Una foto puesta permite al comprador visualizar cómo queda la prenda en un cuerpo real — es muy tranquilizador y ayuda a imaginar cómo le quedará. Una foto plana sobre una superficie blanca es más neutra pero muy limpia y profesional. Lo ideal es combinar ambas. Evita las fotos en percha si puedes: aplanan la ropa y suelen hacerla parecer menos atractiva.',
        },
        {
          title: '5. Elimina el fondo automáticamente con IA',
          body: 'Incluso con las mejores intenciones, no siempre es posible encontrar un fondo perfectamente neutro en casa. Ahí es donde entra la inteligencia artificial. Herramientas como SellerLab AI eliminan el fondo de tus fotos con un clic y lo reemplazan por un fondo blanco profesional. El resultado: fotos de calidad de boutique profesional, aunque la foto original se haya hecho en un salón desordenado. Es el truco más eficaz para profesionalizar al instante todos tus anuncios de Vinted.',
        },
      ],
      ctaTitle: 'Consigue fotos profesionales con SellerLab AI',
      ctaBody:
        'Nuestra herramienta IA elimina el fondo de tus fotos con un clic y te ofrece fondos profesionales. Fotos atractivas que atraen compradores, sin estudio de fotografía ni conocimientos técnicos.',
    },
  },
  {
    slug: 'rediger-annonce-vinted',
    date: '2026-05-01',
    color: 'from-emerald-400 to-teal-500',
    fr: {
      title: 'Comment rédiger une annonce Vinted qui attire les acheteurs',
      metaDescription:
        "Apprenez à rédiger des annonces Vinted efficaces : titre optimisé avec mots-clés, description complète, état précis et conseils pour convertir plus de visiteurs en acheteurs.",
      excerpt:
        "Une bonne annonce peut doubler vos chances de vente. Voici comment rédiger des titres et descriptions qui convertissent.",
      readTime: 5,
      intro:
        "Sur Vinted, deux annonces pour le même article peuvent obtenir des résultats très différents selon la façon dont elles sont rédigées. Un titre précis, une description complète et les bons mots-clés peuvent doubler votre visibilité et multiplier vos chances de vente. Voici comment rédiger des annonces Vinted qui attirent vraiment les acheteurs.",
      sections: [
        {
          title: 'Rédigez un titre précis et descriptif',
          body: "Le titre est la première chose que voient les acheteurs dans les résultats de recherche. Il doit contenir les mots-clés que les acheteurs utilisent. Un bon format : [Marque] + [Type d'article] + [Caractéristique principale] + [Taille] + [État]. Par exemple : 'Veste en jean Levi's bleue taille M très bon état' ou 'Robe midi fleurie Zara T38 neuve avec étiquette'. Évitez les titres trop vagues comme 'Belle veste' ou 'Robe sympa' : ils n'apparaissent pas dans les recherches et n'informent pas l'acheteur. Chaque mot compte.",
        },
        {
          title: 'Écrivez une description complète et honnête',
          body: "Une description vide inspire méfiance. Les acheteurs veulent savoir exactement ce qu'ils achètent. Décrivez votre article en détail : la matière et la composition (100 % coton, mélange laine...), la coupe et le style (ample, ajustée, boyfriend...), les couleurs exactes (bleu marine, pas juste 'bleu'), l'état réel avec les éventuels défauts, et les mesures précises. N'hésitez pas à contextualiser : 'Acheté en boutique Zara en 2024, porté deux fois, mis de côté par manque de place.' Cette authenticité rassure et accélère la décision d'achat.",
        },
        {
          title: 'Utilisez les bons mots-clés',
          body: "Vinted fonctionne comme un moteur de recherche : les acheteurs tapent des mots-clés pour trouver des articles. Pensez comme votre acheteur potentiel. Incluez le nom de la marque orthographié correctement, le type de vêtement (jean, robe, veste, pull, manteau...), la couleur, la taille et la matière principale. Si votre article est vintage ou de créateur, mentionnez-le explicitement — ces termes sont très recherchés. Évitez les fautes d'orthographe : 'Adidas' mal orthographié ne ressortira pas dans les recherches pour cette marque.",
        },
        {
          title: "Précisez l'état et les mesures",
          body: "L'état et les mensurations sont deux informations critiques pour l'acheteur. Pour l'état, ne vous contentez pas de cocher la case Vinted — développez dans la description : 'Aucun défaut visible', 'Légère décoloration sur la doublure non visible à l'extérieur', ou 'Taille légèrement large, convient aussi à un 40/42'. Pour les mesures, ne fiez-vous pas uniquement aux tailles indiquées sur les étiquettes — elles varient énormément d'une marque à l'autre. Donnez les mesures réelles : largeur des épaules, tour de poitrine, longueur totale.",
        },
        {
          title: 'Soyez réactif et construisez votre réputation',
          body: "La rédaction de votre annonce est importante, mais votre comportement après publication l'est tout autant. Répondez rapidement aux questions des acheteurs, idéalement dans l'heure. Soyez aimable et professionnel, même si la négociation est serrée. Emballez soigneusement vos articles avant expédition et envoyez-les rapidement après la vente. Ces bonnes pratiques se traduisent en avis positifs sur votre profil, et sur Vinted, un profil avec de bonnes évaluations vend deux à trois fois plus vite qu'un profil sans historique.",
        },
      ],
      ctaTitle: "Générez vos annonces Vinted automatiquement avec l'IA",
      ctaBody:
        "Rédiger une bonne annonce prend du temps et demande de l'expérience. SellerLab AI génère automatiquement un titre optimisé et une description complète pour chaque article en quelques secondes. Des annonces professionnelles, sans effort.",
    },
    en: {
      title: 'How to Write a Vinted Listing That Attracts Buyers',
      metaDescription:
        'Learn to write effective Vinted listings: keyword-optimised titles, complete descriptions, accurate condition details and tips to convert more viewers into buyers.',
      excerpt:
        "A well-written listing can double your chances of a sale. Here's how to write titles and descriptions that convert.",
      readTime: 5,
      intro:
        "On Vinted, two listings for the same item can get very different results depending on how they're written. A precise title, a complete description and the right keywords can double your visibility and multiply your chances of selling. Here's how to write Vinted listings that genuinely attract buyers.",
      sections: [
        {
          title: 'Write a precise, descriptive title',
          body: "The title is the first thing buyers see in search results. It must contain the keywords buyers actually use. A good format: [Brand] + [Item type] + [Key feature] + [Size] + [Condition]. For example: 'Blue Levi's denim jacket size M very good condition' or 'Floral Zara midi dress size 10 new with tags'. Avoid vague titles like 'Nice jacket' or 'Cute dress' — they don't appear in searches and don't inform the buyer. Every word matters.",
        },
        {
          title: 'Write a complete, honest description',
          body: "An empty description breeds distrust. Buyers want to know exactly what they're buying. Describe your item in detail: the fabric and composition (100% cotton, wool blend...), the cut and style (oversized, fitted, boyfriend...), the exact colours (navy blue, not just 'blue'), the real condition including any flaws, and precise measurements. Don't hesitate to add context: 'Bought in Zara store in 2024, worn twice, set aside due to lack of wardrobe space.' This authenticity reassures buyers and speeds up their purchase decision.",
        },
        {
          title: 'Use the right keywords',
          body: "Vinted works like a search engine: buyers type keywords to find items. Think like your potential buyer. Include the brand name spelled correctly, the clothing type (jeans, dress, jacket, jumper, coat...), the colour, size and main fabric. If your item is vintage or designer, mention it explicitly — these terms are heavily searched. Avoid spelling mistakes: 'Adidas' misspelled won't show up in searches for that brand.",
        },
        {
          title: 'Specify condition and measurements accurately',
          body: "Condition and measurements are two critical pieces of information for the buyer. For condition, don't just tick the Vinted box — expand in the description: 'No visible flaws', 'Slight discolouration on the lining not visible on the outside', or 'Runs slightly large, also fits a UK 12/14'. For measurements, don't rely solely on the sizes shown on labels — they vary enormously between brands. Give the actual measurements of the item: shoulder width, chest circumference, total length.",
        },
        {
          title: 'Be responsive and build your reputation',
          body: "Writing your listing is important, but your behaviour after posting matters just as much. Reply quickly to buyer questions, ideally within the hour. Be friendly and professional, even when negotiations are tough. Pack your items carefully before shipping and send them quickly after the sale. These good practices translate into positive reviews on your profile, and on Vinted, a profile with good ratings sells two to three times faster than one without any history.",
        },
      ],
      ctaTitle: 'Generate your Vinted listings automatically with AI',
      ctaBody:
        "Writing a good listing takes time and experience. SellerLab AI automatically generates an optimised title and complete description for each item in seconds. Professional listings, effortlessly.",
    },
    es: {
      title: 'Cómo redactar un anuncio de Vinted que atraiga compradores',
      metaDescription:
        'Aprende a redactar anuncios de Vinted eficaces: títulos optimizados con palabras clave, descripciones completas, estado preciso y consejos para convertir visitas en ventas.',
      excerpt:
        'Un buen anuncio puede duplicar tus posibilidades de venta. Así es cómo redactar títulos y descripciones que convierten.',
      readTime: 5,
      intro:
        'En Vinted, dos anuncios del mismo artículo pueden obtener resultados muy distintos según cómo estén redactados. Un título preciso, una descripción completa y las palabras clave correctas pueden duplicar tu visibilidad y multiplicar tus posibilidades de venta. Así es cómo redactar anuncios de Vinted que realmente atraigan compradores.',
      sections: [
        {
          title: 'Redacta un título preciso y descriptivo',
          body: "El título es lo primero que ven los compradores en los resultados de búsqueda. Debe contener las palabras clave que usan los compradores. Un buen formato: [Marca] + [Tipo de prenda] + [Característica principal] + [Talla] + [Estado]. Por ejemplo: 'Chaqueta vaquera Levi's azul talla M muy buen estado' o 'Vestido midi floral Zara T38 nuevo con etiqueta'. Evita títulos vagos como 'Chaqueta bonita' o 'Vestido mono': no aparecen en las búsquedas y no informan al comprador. Cada palabra cuenta.",
        },
        {
          title: 'Escribe una descripción completa y honesta',
          body: "Una descripción vacía genera desconfianza. Los compradores quieren saber exactamente qué están comprando. Describe tu artículo en detalle: el tejido y la composición (100% algodón, mezcla de lana...), el corte y el estilo (holgado, ajustado, boyfriend...), los colores exactos (azul marino, no solo 'azul'), el estado real con los posibles defectos y las medidas precisas. No dudes en contextualizar: 'Comprado en tienda Zara en 2024, usado dos veces, guardado por falta de espacio.' Esta autenticidad tranquiliza y acelera la decisión de compra.",
        },
        {
          title: 'Usa las palabras clave correctas',
          body: "Vinted funciona como un motor de búsqueda: los compradores escriben palabras clave para encontrar artículos. Piensa como tu comprador potencial. Incluye el nombre de la marca bien escrito, el tipo de prenda (vaqueros, vestido, chaqueta, jersey, abrigo...), el color, la talla y el tejido principal. Si tu artículo es vintage o de diseñador, menciónalo explícitamente — estos términos tienen mucha búsqueda. Evita los errores ortográficos: 'Adidas' mal escrito no aparecerá en las búsquedas de esa marca.",
        },
        {
          title: 'Especifica el estado y las medidas con precisión',
          body: "El estado y las medidas son dos datos críticos para el comprador. Para el estado, no te limites a marcar la casilla de Vinted — amplíalo en la descripción: 'Sin defectos visibles', 'Leve decoloración en el forro no visible por fuera', o 'Talla un poco grande, también vale para una talla M/L'. Para las medidas, no te fíes solo de las tallas indicadas en las etiquetas — varían mucho de una marca a otra. Da las medidas reales de la prenda: ancho de hombros, contorno de pecho, largo total.",
        },
        {
          title: 'Sé reactivo y construye tu reputación',
          body: 'Redactar tu anuncio es importante, pero tu comportamiento tras publicarlo lo es igualmente. Responde rápidamente a las preguntas de los compradores, idealmente en menos de una hora. Sé amable y profesional, incluso cuando la negociación es difícil. Empaqueta bien tus artículos antes de enviarlos y envíalos rápidamente tras la venta. Estas buenas prácticas se traducen en reseñas positivas en tu perfil, y en Vinted, un perfil con buenas valoraciones vende dos o tres veces más rápido que uno sin historial.',
        },
      ],
      ctaTitle: 'Genera tus anuncios de Vinted automáticamente con IA',
      ctaBody:
        'Redactar un buen anuncio lleva tiempo y requiere experiencia. SellerLab AI genera automáticamente un título optimizado y una descripción completa para cada artículo en segundos. Anuncios profesionales, sin esfuerzo.',
    },
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}
