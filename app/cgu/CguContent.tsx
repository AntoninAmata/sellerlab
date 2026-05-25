'use client'

import { useLang } from '@/app/providers'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'

const T = {
  fr: {
    title: "Conditions Générales d'Utilisation",
    updated: 'Dernière mise à jour : mai 2026',
    articles: [
      {
        title: 'Article 1 – Objet et acceptation',
        body: "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du service SellerLab AI accessible depuis le site sellerlab.ai. En créant un compte ou en utilisant le service, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service.",
      },
      {
        title: 'Article 2 – Description du service',
        body: "SellerLab AI est un service SaaS (Software as a Service) qui fournit des outils basés sur l'intelligence artificielle pour aider les vendeurs de la plateforme Vinted à optimiser leurs annonces. Les fonctionnalités comprennent notamment la suppression de fond photo, le calcul de prix et la génération automatique de descriptions d'annonces.",
      },
      {
        title: 'Article 3 – Création de compte et accès',
        body: "L'accès aux fonctionnalités payantes nécessite la création d'un compte avec une adresse e-mail valide. Vous êtes seul responsable de la confidentialité de vos identifiants et de toute activité réalisée depuis votre compte. Vous vous engagez à informer immédiatement SellerLab AI de tout accès non autorisé.",
      },
      {
        title: 'Article 4 – Abonnements et paiement',
        body: "Les plans payants sont facturés mensuellement, d'avance. Le paiement est traité par notre prestataire de paiement sécurisé. L'abonnement se renouvelle automatiquement sauf résiliation préalable. Les prix sont indiqués TTC et peuvent être modifiés avec un préavis de 30 jours.",
      },
      {
        title: 'Article 5 – Résiliation et remboursements',
        body: "Vous pouvez résilier votre abonnement à tout moment depuis votre espace personnel. La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement pro rata ne sera effectué pour les jours non utilisés, sauf défaillance grave imputable à SellerLab AI.",
      },
      {
        title: 'Article 6 – Propriété intellectuelle',
        body: "L'ensemble des éléments constitutifs du service (algorithmes, interface, contenu, marque SellerLab AI) est la propriété exclusive de l'éditeur. Toute reproduction, adaptation, distribution ou exploitation non expressément autorisée est interdite.",
      },
      {
        title: 'Article 7 – Limitation de responsabilité',
        body: "SellerLab AI est fourni \"en l'état\". L'éditeur ne garantit pas que le service sera ininterrompu, exempt d'erreurs ou adapté à un besoin particulier. La responsabilité de l'éditeur est limitée au montant des sommes versées par l'utilisateur au cours des trois derniers mois.",
      },
      {
        title: 'Article 8 – Protection des données personnelles',
        body: "Le traitement de vos données personnelles est décrit dans notre Politique de confidentialité disponible à l'adresse /confidentialite. Cette politique fait partie intégrante des présentes CGU.",
      },
      {
        title: 'Article 9 – Modification des CGU',
        body: "L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par e-mail de toute modification substantielle avec un préavis de 15 jours. La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles conditions.",
      },
      {
        title: 'Article 10 – Droit applicable et juridiction',
        body: "Les présentes CGU sont régies par le droit français. En cas de litige, les parties rechercheront en priorité une solution amiable. À défaut, les tribunaux compétents de Paris seront seuls compétents.",
      },
    ],
    contact: 'Éditeur : SellerLab AI — contact@sellerlab.ai',
  },
  en: {
    title: 'Terms and Conditions',
    updated: 'Last updated: May 2026',
    articles: [
      {
        title: 'Article 1 – Purpose and Acceptance',
        body: 'These Terms and Conditions ("Terms") govern the use of the SellerLab AI service available at sellerlab.ai. By creating an account or using the service, you fully accept these Terms. If you do not accept these Terms, you must not use the service.',
      },
      {
        title: 'Article 2 – Service Description',
        body: 'SellerLab AI is a SaaS (Software as a Service) providing AI-powered tools to help Vinted sellers optimize their listings. Features include background removal, price calculation, and automatic description generation.',
      },
      {
        title: 'Article 3 – Account Creation and Access',
        body: 'Access to paid features requires creating an account with a valid email address. You are solely responsible for the confidentiality of your credentials and all activity on your account. You agree to notify SellerLab AI immediately of any unauthorized access.',
      },
      {
        title: 'Article 4 – Subscriptions and Payment',
        body: 'Paid plans are billed monthly, in advance. Payments are processed by our secure payment provider. Subscriptions renew automatically unless cancelled beforehand. Prices are inclusive of all taxes and may be modified with 30 days\' notice.',
      },
      {
        title: 'Article 5 – Cancellation and Refunds',
        body: 'You may cancel your subscription at any time from your account. Cancellation takes effect at the end of the current billing period. No pro-rata refund will be issued for unused days, except in the case of a serious failure attributable to SellerLab AI.',
      },
      {
        title: 'Article 6 – Intellectual Property',
        body: 'All elements of the service (algorithms, interface, content, SellerLab AI brand) are the exclusive property of the publisher. Any reproduction, adaptation, distribution or exploitation not expressly authorized is prohibited.',
      },
      {
        title: 'Article 7 – Limitation of Liability',
        body: 'SellerLab AI is provided "as is." The publisher does not guarantee that the service will be uninterrupted, error-free, or suited to any particular need. The publisher\'s liability is limited to the amounts paid by the user in the past three months.',
      },
      {
        title: 'Article 8 – Personal Data Protection',
        body: 'The processing of your personal data is described in our Privacy Policy at /confidentialite, which forms an integral part of these Terms.',
      },
      {
        title: 'Article 9 – Amendments to Terms',
        body: 'The publisher reserves the right to modify these Terms at any time. Users will be notified by email of any material change with 15 days\' notice. Continued use of the service after notification constitutes acceptance of the new terms.',
      },
      {
        title: 'Article 10 – Governing Law and Jurisdiction',
        body: 'These Terms are governed by French law. In the event of a dispute, the parties will first seek an amicable resolution. Failing that, the competent courts of Paris shall have exclusive jurisdiction.',
      },
    ],
    contact: 'Publisher: SellerLab AI — contact@sellerlab.ai',
  },
  es: {
    title: 'Términos y Condiciones',
    updated: 'Última actualización: mayo de 2026',
    articles: [
      {
        title: 'Artículo 1 – Objeto y aceptación',
        body: 'Los presentes Términos y Condiciones ("Términos") regulan el uso del servicio SellerLab AI disponible en sellerlab.ai. Al crear una cuenta o utilizar el servicio, aceptas plenamente estos Términos. Si no los aceptas, no debes utilizar el servicio.',
      },
      {
        title: 'Artículo 2 – Descripción del servicio',
        body: 'SellerLab AI es un servicio SaaS (Software as a Service) que proporciona herramientas basadas en inteligencia artificial para ayudar a los vendedores de Vinted a optimizar sus anuncios. Las funcionalidades incluyen la eliminación de fondo, el cálculo de precios y la generación automática de descripciones de anuncios.',
      },
      {
        title: 'Artículo 3 – Creación de cuenta y acceso',
        body: 'El acceso a las funcionalidades de pago requiere la creación de una cuenta con una dirección de correo electrónico válida. Eres el único responsable de la confidencialidad de tus credenciales y de toda la actividad de tu cuenta. Debes notificar a SellerLab AI de inmediato cualquier acceso no autorizado.',
      },
      {
        title: 'Artículo 4 – Suscripciones y pago',
        body: 'Los planes de pago se facturan mensualmente, por adelantado. Los pagos son procesados por nuestro proveedor de pago seguro. Las suscripciones se renuevan automáticamente salvo cancelación previa. Los precios incluyen todos los impuestos aplicables y pueden modificarse con un preaviso de 30 días.',
      },
      {
        title: 'Artículo 5 – Cancelación y reembolsos',
        body: 'Puedes cancelar tu suscripción en cualquier momento desde tu cuenta. La cancelación surte efecto al final del período de facturación en curso. No se realizarán reembolsos prorrateados por los días no utilizados, salvo en caso de falla grave imputable a SellerLab AI.',
      },
      {
        title: 'Artículo 6 – Propiedad intelectual',
        body: 'Todos los elementos del servicio (algoritmos, interfaz, contenido, marca SellerLab AI) son propiedad exclusiva del editor. Cualquier reproducción, adaptación, distribución o explotación no expresamente autorizada está prohibida.',
      },
      {
        title: 'Artículo 7 – Limitación de responsabilidad',
        body: 'SellerLab AI se proporciona "tal cual". El editor no garantiza que el servicio será ininterrumpido, libre de errores o adecuado para ninguna necesidad particular. La responsabilidad del editor se limita a las cantidades pagadas por el usuario en los últimos tres meses.',
      },
      {
        title: 'Artículo 8 – Protección de datos personales',
        body: 'El tratamiento de tus datos personales se describe en nuestra Política de privacidad disponible en /confidentialite, que forma parte integrante de estos Términos.',
      },
      {
        title: 'Artículo 9 – Modificación de los Términos',
        body: 'El editor se reserva el derecho de modificar estos Términos en cualquier momento. Los usuarios serán informados por correo electrónico de cualquier cambio significativo con un preaviso de 15 días. El uso continuado del servicio tras la notificación constituye la aceptación de los nuevos términos.',
      },
      {
        title: 'Artículo 10 – Ley aplicable y jurisdicción',
        body: 'Estos Términos se rigen por la ley francesa. En caso de litigio, las partes buscarán en primer lugar una solución amistosa. En su defecto, los tribunales competentes de París tendrán jurisdicción exclusiva.',
      },
    ],
    contact: 'Editor: SellerLab AI — contact@sellerlab.ai',
  },
  it: {
    title: 'Condizioni Generali di Utilizzo',
    updated: 'Ultimo aggiornamento: maggio 2026',
    articles: [
      { title: 'Articolo 1 – Oggetto e accettazione', body: 'Le presenti Condizioni Generali di Utilizzo (CGU) disciplinano l\'uso del servizio SellerLab AI disponibile su sellerlab.ai. Creando un account o utilizzando il servizio, accetti integralmente le presenti CGU. Se non accetti queste condizioni, non devi utilizzare il servizio.' },
      { title: 'Articolo 2 – Descrizione del servizio', body: 'SellerLab AI è un servizio SaaS (Software as a Service) che fornisce strumenti basati sull\'intelligenza artificiale per aiutare i venditori di Vinted a ottimizzare i loro annunci. Le funzionalità includono la rimozione dello sfondo, il calcolo dei prezzi e la generazione automatica di descrizioni.' },
      { title: 'Articolo 3 – Creazione account e accesso', body: "L'accesso alle funzionalità a pagamento richiede la creazione di un account con un indirizzo email valido. Sei il solo responsabile della riservatezza delle tue credenziali e di tutte le attività del tuo account. Sei tenuto a notificare immediatamente SellerLab AI di qualsiasi accesso non autorizzato." },
      { title: 'Articolo 4 – Abbonamenti e pagamento', body: 'I piani a pagamento vengono fatturati mensilmente, in anticipo. I pagamenti sono elaborati dal nostro provider di pagamento sicuro. Gli abbonamenti si rinnovano automaticamente salvo cancellazione preventiva. I prezzi sono indicati IVA inclusa e possono essere modificati con un preavviso di 30 giorni.' },
      { title: 'Articolo 5 – Cancellazione e rimborsi', body: 'Puoi cancellare il tuo abbonamento in qualsiasi momento dal tuo account. La cancellazione ha effetto alla fine del periodo di fatturazione in corso. Non verranno effettuati rimborsi proporzionali per i giorni non utilizzati, salvo grave inadempimento imputabile a SellerLab AI.' },
      { title: 'Articolo 6 – Proprietà intellettuale', body: 'Tutti gli elementi del servizio (algoritmi, interfaccia, contenuto, marchio SellerLab AI) sono di proprietà esclusiva dell\'editore. Qualsiasi riproduzione, adattamento, distribuzione o sfruttamento non espressamente autorizzato è vietato.' },
      { title: 'Articolo 7 – Limitazione di responsabilità', body: 'SellerLab AI è fornito "così com\'è". L\'editore non garantisce che il servizio sarà ininterrotto, privo di errori o adatto a esigenze particolari. La responsabilità dell\'editore è limitata alle somme pagate dall\'utente negli ultimi tre mesi.' },
      { title: 'Articolo 8 – Protezione dei dati personali', body: 'Il trattamento dei tuoi dati personali è descritto nella nostra Informativa sulla Privacy disponibile su /confidentialite, che costituisce parte integrante delle presenti CGU.' },
      { title: 'Articolo 9 – Modifica delle CGU', body: "L'editore si riserva il diritto di modificare le presenti CGU in qualsiasi momento. Gli utenti saranno informati via email di qualsiasi modifica sostanziale con un preavviso di 15 giorni. Il proseguimento dell'utilizzo del servizio dopo la notifica costituisce accettazione delle nuove condizioni." },
      { title: 'Articolo 10 – Legge applicabile e giurisdizione', body: 'Le presenti CGU sono disciplinate dal diritto francese. In caso di controversia, le parti cercheranno in primo luogo una soluzione amichevole. In mancanza, i tribunali competenti di Parigi avranno giurisdizione esclusiva.' },
    ],
    contact: 'Editore: SellerLab AI — contact@sellerlab.ai',
  },
  de: {
    title: 'Allgemeine Nutzungsbedingungen',
    updated: 'Letzte Aktualisierung: Mai 2026',
    articles: [
      { title: 'Artikel 1 – Gegenstand und Annahme', body: 'Diese Allgemeinen Nutzungsbedingungen (AGB) regeln die Nutzung des SellerLab AI-Dienstes unter sellerlab.ai. Durch die Erstellung eines Kontos oder die Nutzung des Dienstes stimmst du diesen AGB uneingeschränkt zu. Wenn du diese Bedingungen nicht akzeptierst, darfst du den Dienst nicht nutzen.' },
      { title: 'Artikel 2 – Dienstbeschreibung', body: 'SellerLab AI ist ein SaaS-Dienst (Software as a Service), der KI-gestützte Tools bereitstellt, um Vinted-Verkäufern bei der Optimierung ihrer Angebote zu helfen. Funktionen umfassen Hintergrundentfernung, Preisberechnung und automatische Beschreibungsgenerierung.' },
      { title: 'Artikel 3 – Kontoerstellung und Zugang', body: 'Der Zugang zu kostenpflichtigen Funktionen erfordert die Erstellung eines Kontos mit einer gültigen E-Mail-Adresse. Du bist allein verantwortlich für die Vertraulichkeit deiner Zugangsdaten und alle Aktivitäten in deinem Konto. Du verpflichtest dich, SellerLab AI unverzüglich über jeden unbefugten Zugriff zu informieren.' },
      { title: 'Artikel 4 – Abonnements und Zahlung', body: 'Kostenpflichtige Pläne werden monatlich im Voraus abgerechnet. Die Zahlungsabwicklung erfolgt über unseren sicheren Zahlungsanbieter. Abonnements verlängern sich automatisch, sofern sie nicht vorab gekündigt werden. Preise sind inkl. aller Steuern und können mit 30 Tagen Vorankündigung geändert werden.' },
      { title: 'Artikel 5 – Kündigung und Erstattungen', body: 'Du kannst dein Abonnement jederzeit über dein Konto kündigen. Die Kündigung tritt zum Ende des aktuellen Abrechnungszeitraums in Kraft. Für nicht genutzte Tage werden keine anteiligen Erstattungen geleistet, außer bei schwerwiegendem Versagen seitens SellerLab AI.' },
      { title: 'Artikel 6 – Geistiges Eigentum', body: 'Alle Elemente des Dienstes (Algorithmen, Benutzeroberfläche, Inhalte, Marke SellerLab AI) sind Eigentum des Herausgebers. Jede nicht ausdrücklich genehmigte Vervielfältigung, Anpassung, Verbreitung oder Nutzung ist untersagt.' },
      { title: 'Artikel 7 – Haftungsbeschränkung', body: 'SellerLab AI wird "wie besehen" bereitgestellt. Der Herausgeber garantiert nicht, dass der Dienst unterbrechungsfrei, fehlerfrei oder für einen bestimmten Zweck geeignet ist. Die Haftung des Herausgebers ist auf die vom Nutzer in den letzten drei Monaten gezahlten Beträge begrenzt.' },
      { title: 'Artikel 8 – Datenschutz', body: 'Die Verarbeitung deiner personenbezogenen Daten ist in unserer Datenschutzrichtlinie unter /confidentialite beschrieben, die integraler Bestandteil dieser AGB ist.' },
      { title: 'Artikel 9 – Änderung der AGB', body: 'Der Herausgeber behält sich das Recht vor, diese AGB jederzeit zu ändern. Nutzer werden über wesentliche Änderungen mit 15 Tagen Vorankündigung per E-Mail informiert. Die weitere Nutzung des Dienstes nach der Benachrichtigung gilt als Zustimmung zu den neuen Bedingungen.' },
      { title: 'Artikel 10 – Anwendbares Recht und Gerichtsstand', body: 'Diese AGB unterliegen französischem Recht. Bei Streitigkeiten suchen die Parteien zunächst eine gütliche Einigung. Andernfalls sind die zuständigen Gerichte in Paris ausschließlich zuständig.' },
    ],
    contact: 'Herausgeber: SellerLab AI — contact@sellerlab.ai',
  },
  pl: {
    title: 'Ogólne Warunki Użytkowania',
    updated: 'Ostatnia aktualizacja: maj 2026',
    articles: [
      { title: 'Artykuł 1 – Przedmiot i akceptacja', body: 'Niniejsze Ogólne Warunki Użytkowania (OWU) regulują korzystanie z usługi SellerLab AI dostępnej pod adresem sellerlab.ai. Tworząc konto lub korzystając z usługi, w pełni akceptujesz niniejsze OWU. Jeśli nie akceptujesz tych warunków, nie powinieneś korzystać z usługi.' },
      { title: 'Artykuł 2 – Opis usługi', body: 'SellerLab AI to usługa SaaS (Software as a Service) dostarczająca narzędzia oparte na sztucznej inteligencji, pomagające sprzedawcom Vinted w optymalizacji ogłoszeń. Funkcje obejmują usuwanie tła, obliczanie cen i automatyczne generowanie opisów.' },
      { title: 'Artykuł 3 – Tworzenie konta i dostęp', body: 'Dostęp do funkcji płatnych wymaga utworzenia konta z ważnym adresem email. Jesteś wyłącznie odpowiedzialny za poufność swoich danych logowania i wszelką aktywność na swoim koncie. Zobowiązujesz się niezwłocznie powiadomić SellerLab AI o każdym nieautoryzowanym dostępie.' },
      { title: 'Artykuł 4 – Subskrypcje i płatności', body: 'Plany płatne są rozliczane miesięcznie, z góry. Płatności są przetwarzane przez naszego bezpiecznego dostawcę płatności. Subskrypcje odnawiają się automatycznie, chyba że zostaną wcześniej anulowane. Ceny są podane z podatkami i mogą być zmieniane z 30-dniowym wyprzedzeniem.' },
      { title: 'Artykuł 5 – Anulowanie i zwroty', body: 'Możesz anulować subskrypcję w dowolnym momencie ze swojego konta. Anulowanie wchodzi w życie z końcem bieżącego okresu rozliczeniowego. Zwroty proporcjonalne za niewykorzystane dni nie są dokonywane, z wyjątkiem poważnej awarii przypisywanej SellerLab AI.' },
      { title: 'Artykuł 6 – Własność intelektualna', body: 'Wszystkie elementy usługi (algorytmy, interfejs, treść, marka SellerLab AI) są wyłączną własnością wydawcy. Wszelkie reprodukcje, adaptacje, dystrybucje lub eksploatacje niewyraźnie autoryzowane są zakazane.' },
      { title: 'Artykuł 7 – Ograniczenie odpowiedzialności', body: 'SellerLab AI jest dostarczany "tak jak jest". Wydawca nie gwarantuje, że usługa będzie nieprzerwana, wolna od błędów ani odpowiednia do konkretnych potrzeb. Odpowiedzialność wydawcy jest ograniczona do kwot zapłaconych przez użytkownika w ciągu ostatnich trzech miesięcy.' },
      { title: 'Artykuł 8 – Ochrona danych osobowych', body: 'Przetwarzanie Twoich danych osobowych jest opisane w naszej Polityce prywatności dostępnej pod adresem /confidentialite, która stanowi integralną część niniejszych OWU.' },
      { title: 'Artykuł 9 – Zmiana OWU', body: 'Wydawca zastrzega sobie prawo do zmiany niniejszych OWU w dowolnym momencie. Użytkownicy będą informowani emailem o wszelkich istotnych zmianach z 15-dniowym wyprzedzeniem. Dalsze korzystanie z usługi po powiadomieniu oznacza akceptację nowych warunków.' },
      { title: 'Artykuł 10 – Prawo właściwe i jurysdykcja', body: 'Niniejsze OWU podlegają prawu francuskiemu. W przypadku sporu strony będą szukać rozwiązania polubownego. W przeciwnym razie wyłączna jurysdykcja będzie należeć do właściwych sądów w Paryżu.' },
    ],
    contact: 'Wydawca: SellerLab AI — contact@sellerlab.ai',
  },
  nl: {
    title: 'Algemene Gebruiksvoorwaarden',
    updated: 'Laatste update: mei 2026',
    articles: [
      { title: 'Artikel 1 – Doel en aanvaarding', body: 'Deze Algemene Gebruiksvoorwaarden (AGV) regelen het gebruik van de SellerLab AI-dienst beschikbaar op sellerlab.ai. Door een account aan te maken of de dienst te gebruiken, aanvaard je deze AGV volledig. Als je deze voorwaarden niet aanvaardt, mag je de dienst niet gebruiken.' },
      { title: 'Artikel 2 – Beschrijving van de dienst', body: 'SellerLab AI is een SaaS-dienst (Software as a Service) die AI-gestuurde tools biedt om Vinted-verkopers te helpen hun advertenties te optimaliseren. Functies omvatten achtergrondverwijdering, prijsberekening en automatische beschrijvinggeneratie.' },
      { title: 'Artikel 3 – Accountaanmaak en toegang', body: 'Toegang tot betaalde functies vereist het aanmaken van een account met een geldig e-mailadres. Je bent als enige verantwoordelijk voor de vertrouwelijkheid van je inloggegevens en alle activiteit op je account. Je verbindt je ertoe SellerLab AI onmiddellijk te informeren over elke ongeautoriseerde toegang.' },
      { title: 'Artikel 4 – Abonnementen en betaling', body: 'Betaalde plannen worden maandelijks vooraf gefactureerd. Betalingen worden verwerkt door onze beveiligde betalingsprovider. Abonnementen verlengen automatisch tenzij vooraf opgezegd. Prijzen zijn inclusief alle belastingen en kunnen worden gewijzigd met 30 dagen voorafgaande kennisgeving.' },
      { title: 'Artikel 5 – Opzegging en terugbetalingen', body: 'Je kunt je abonnement op elk moment opzeggen vanuit je account. De opzegging gaat in aan het einde van de lopende factureringsperiode. Er worden geen evenredige terugbetalingen gedaan voor ongebruikte dagen, behalve bij ernstig falen toe te schrijven aan SellerLab AI.' },
      { title: 'Artikel 6 – Intellectuele eigendom', body: 'Alle elementen van de dienst (algoritmen, interface, inhoud, merk SellerLab AI) zijn exclusief eigendom van de uitgever. Elke niet uitdrukkelijk geautoriseerde reproductie, aanpassing, verspreiding of exploitatie is verboden.' },
      { title: 'Artikel 7 – Beperking van aansprakelijkheid', body: 'SellerLab AI wordt geleverd "zoals het is". De uitgever garandeert niet dat de dienst ononderbroken, foutloos of geschikt voor een bepaald doel zal zijn. De aansprakelijkheid van de uitgever is beperkt tot de door de gebruiker in de afgelopen drie maanden betaalde bedragen.' },
      { title: 'Artikel 8 – Bescherming van persoonsgegevens', body: 'De verwerking van je persoonsgegevens is beschreven in ons Privacybeleid op /confidentialite, dat integraal deel uitmaakt van deze AGV.' },
      { title: 'Artikel 9 – Wijziging van de AGV', body: 'De uitgever behoudt zich het recht voor deze AGV op elk moment te wijzigen. Gebruikers worden per e-mail geïnformeerd over wezenlijke wijzigingen met 15 dagen voorafgaande kennisgeving. Voortgezet gebruik van de dienst na kennisgeving geldt als aanvaarding van de nieuwe voorwaarden.' },
      { title: 'Artikel 10 – Toepasselijk recht en bevoegde rechtbank', body: 'Deze AGV worden beheerst door Frans recht. Bij een geschil zoeken de partijen eerst een minnelijke oplossing. Bij gebreke daarvan zijn de bevoegde rechtbanken in Parijs exclusief bevoegd.' },
    ],
    contact: 'Uitgever: SellerLab AI — contact@sellerlab.ai',
  },
}

export default function CguContent() {
  const { lang } = useLang()
  const page = T[lang]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{page.title}</h1>
          <p className="text-sm text-gray-400 mb-10">{page.updated}</p>

          <div className="space-y-8">
            {page.articles.map((article, i) => (
              <div key={i}>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{article.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-gray-400 border-t border-gray-100 pt-6">{page.contact}</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
