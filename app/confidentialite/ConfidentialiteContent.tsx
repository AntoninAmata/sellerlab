'use client'

import { useLang } from '@/app/providers'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'

const T = {
  fr: {
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : mai 2026',
    sections: [
      {
        title: '1. Responsable du traitement',
        body: "SellerLab AI (ci-après \"nous\") est responsable du traitement de vos données personnelles collectées via le site sellerlab.ai. Pour toute question relative à vos données, contactez-nous à : contact@sellerlab.ai.",
      },
      {
        title: '2. Données collectées',
        body: "Nous collectons les données que vous nous fournissez lors de la création de votre compte (adresse e-mail, prénom), les données d'utilisation du service (photos uploadées, annonces générées), et les données techniques (adresse IP, type de navigateur, pages visitées) à des fins statistiques.",
      },
      {
        title: '3. Finalités du traitement',
        body: "Vos données sont utilisées pour : fournir et améliorer le service, gérer votre compte et votre abonnement, vous envoyer des communications liées au service (mises à jour, factures), analyser l'utilisation du service de manière agrégée et anonymisée.",
      },
      {
        title: '4. Base légale',
        body: "Le traitement de vos données repose sur : l'exécution du contrat (fourniture du service), votre consentement (communications marketing), notre intérêt légitime (amélioration du service, sécurité), et le respect de nos obligations légales.",
      },
      {
        title: '5. Durée de conservation',
        body: "Vos données de compte sont conservées pendant toute la durée de votre abonnement et pendant 3 ans après la résiliation, sauf obligation légale contraire. Les photos uploadées sont supprimées après traitement. Les données de facturation sont conservées 10 ans conformément aux obligations comptables.",
      },
      {
        title: '6. Destinataires des données',
        body: "Vos données peuvent être transmises à nos sous-traitants techniques (hébergement, paiement, analytique) dans le respect du RGPD. Nous ne vendons jamais vos données à des tiers. En cas de transfert hors UE, nous nous assurons de garanties appropriées (clauses contractuelles types).",
      },
      {
        title: '7. Vos droits',
        body: "Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement (\"droit à l'oubli\"), limitation du traitement, portabilité, opposition. Pour exercer vos droits, contactez-nous à contact@sellerlab.ai. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).",
      },
      {
        title: '8. Cookies',
        body: "Nous utilisons des cookies essentiels au fonctionnement du service et des cookies analytiques (avec votre consentement) pour mesurer l'audience. Vous pouvez accepter ou refuser les cookies via notre bannière de consentement. Le refus n'affecte pas votre accès au service.",
      },
      {
        title: '9. Sécurité',
        body: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction (chiffrement, accès restreint, sauvegardes régulières).",
      },
      {
        title: '10. Modifications',
        body: "Nous pouvons mettre à jour cette politique à tout moment. Toute modification substantielle sera notifiée par e-mail avec un préavis de 15 jours. La date de dernière mise à jour est indiquée en haut de ce document.",
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: May 2026',
    sections: [
      {
        title: '1. Data Controller',
        body: 'SellerLab AI ("we") is the controller of your personal data collected through sellerlab.ai. For any questions about your data, contact us at: contact@sellerlab.ai.',
      },
      {
        title: '2. Data Collected',
        body: 'We collect data you provide when creating your account (email address, first name), service usage data (uploaded photos, generated listings), and technical data (IP address, browser type, pages visited) for statistical purposes.',
      },
      {
        title: '3. Purposes of Processing',
        body: 'Your data is used to: provide and improve the service, manage your account and subscription, send service-related communications (updates, invoices), and analyze service usage in an aggregated and anonymized manner.',
      },
      {
        title: '4. Legal Basis',
        body: 'Data processing is based on: performance of contract (service provision), your consent (marketing communications), our legitimate interest (service improvement, security), and compliance with legal obligations.',
      },
      {
        title: '5. Data Retention',
        body: 'Your account data is retained for the duration of your subscription and 3 years after termination, unless otherwise required by law. Uploaded photos are deleted after processing. Billing data is retained for 10 years per accounting obligations.',
      },
      {
        title: '6. Data Recipients',
        body: 'Your data may be shared with our technical subcontractors (hosting, payment, analytics) in compliance with GDPR. We never sell your data to third parties. For transfers outside the EU, we ensure appropriate safeguards (standard contractual clauses).',
      },
      {
        title: '7. Your Rights',
        body: 'Under GDPR, you have the following rights: access, rectification, erasure ("right to be forgotten"), restriction of processing, portability, and objection. To exercise your rights, contact us at contact@sellerlab.ai. You may also file a complaint with your national data protection authority.',
      },
      {
        title: '8. Cookies',
        body: 'We use cookies essential to the service and analytics cookies (with your consent) to measure traffic. You can accept or decline cookies via our consent banner. Declining does not affect your access to the service.',
      },
      {
        title: '9. Security',
        body: 'We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss or destruction (encryption, restricted access, regular backups).',
      },
      {
        title: '10. Amendments',
        body: 'We may update this policy at any time. Any material change will be notified by email with 15 days\' notice. The last updated date is shown at the top of this document.',
      },
    ],
  },
  es: {
    title: 'Política de privacidad',
    updated: 'Última actualización: mayo de 2026',
    sections: [
      {
        title: '1. Responsable del tratamiento',
        body: 'SellerLab AI ("nosotros") es el responsable del tratamiento de tus datos personales recopilados a través de sellerlab.ai. Para cualquier pregunta sobre tus datos, contáctanos en: contact@sellerlab.ai.',
      },
      {
        title: '2. Datos recopilados',
        body: 'Recopilamos los datos que proporcionas al crear tu cuenta (dirección de correo electrónico, nombre), datos de uso del servicio (fotos subidas, anuncios generados) y datos técnicos (dirección IP, tipo de navegador, páginas visitadas) con fines estadísticos.',
      },
      {
        title: '3. Finalidades del tratamiento',
        body: 'Tus datos se utilizan para: proporcionar y mejorar el servicio, gestionar tu cuenta y suscripción, enviarte comunicaciones relacionadas con el servicio (actualizaciones, facturas) y analizar el uso del servicio de forma agregada y anonimizada.',
      },
      {
        title: '4. Base legal',
        body: 'El tratamiento de datos se basa en: ejecución del contrato (prestación del servicio), tu consentimiento (comunicaciones de marketing), nuestro interés legítimo (mejora del servicio, seguridad) y el cumplimiento de obligaciones legales.',
      },
      {
        title: '5. Período de conservación',
        body: 'Tus datos de cuenta se conservan durante toda tu suscripción y 3 años después de la cancelación, salvo obligación legal contraria. Las fotos subidas se eliminan tras el procesamiento. Los datos de facturación se conservan 10 años conforme a las obligaciones contables.',
      },
      {
        title: '6. Destinatarios de los datos',
        body: 'Tus datos pueden compartirse con nuestros subcontratistas técnicos (alojamiento, pago, analítica) en cumplimiento del RGPD. Nunca vendemos tus datos a terceros. Para transferencias fuera de la UE, garantizamos salvaguardas apropiadas (cláusulas contractuales tipo).',
      },
      {
        title: '7. Tus derechos',
        body: 'En virtud del RGPD, tienes los siguientes derechos: acceso, rectificación, supresión ("derecho al olvido"), limitación del tratamiento, portabilidad y oposición. Para ejercer tus derechos, contáctanos en contact@sellerlab.ai. También puedes presentar una reclamación ante tu autoridad de protección de datos.',
      },
      {
        title: '8. Cookies',
        body: 'Utilizamos cookies esenciales para el funcionamiento del servicio y cookies analíticas (con tu consentimiento) para medir el tráfico. Puedes aceptar o rechazar las cookies a través de nuestro banner de consentimiento. El rechazo no afecta tu acceso al servicio.',
      },
      {
        title: '9. Seguridad',
        body: 'Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos contra accesos no autorizados, pérdida o destrucción (cifrado, acceso restringido, copias de seguridad regulares).',
      },
      {
        title: '10. Modificaciones',
        body: 'Podemos actualizar esta política en cualquier momento. Cualquier cambio significativo se notificará por correo electrónico con un preaviso de 15 días. La fecha de última actualización se indica al principio de este documento.',
      },
    ],
  },
  it: {
    title: 'Informativa sulla Privacy',
    updated: 'Ultimo aggiornamento: maggio 2026',
    sections: [
      { title: '1. Titolare del trattamento', body: 'SellerLab AI ("noi") è il titolare del trattamento dei tuoi dati personali raccolti tramite sellerlab.ai. Per qualsiasi domanda sui tuoi dati, contattaci a: contact@sellerlab.ai.' },
      { title: '2. Dati raccolti', body: "Raccogliamo i dati che fornisci durante la creazione dell'account (indirizzo email, nome), i dati di utilizzo del servizio (foto caricate, annunci generati) e i dati tecnici (indirizzo IP, tipo di browser, pagine visitate) a fini statistici." },
      { title: '3. Finalità del trattamento', body: "I tuoi dati vengono utilizzati per: fornire e migliorare il servizio, gestire il tuo account e abbonamento, inviarti comunicazioni relative al servizio (aggiornamenti, fatture) e analizzare l'utilizzo del servizio in modo aggregato e anonimizzato." },
      { title: '4. Base giuridica', body: "Il trattamento dei dati si basa su: esecuzione del contratto (erogazione del servizio), tuo consenso (comunicazioni di marketing), nostro legittimo interesse (miglioramento del servizio, sicurezza) e rispetto degli obblighi legali." },
      { title: '5. Periodo di conservazione', body: "I dati del tuo account vengono conservati per tutta la durata del tuo abbonamento e per 3 anni dopo la risoluzione, salvo diverso obbligo di legge. Le foto caricate vengono eliminate dopo l'elaborazione. I dati di fatturazione vengono conservati per 10 anni ai sensi degli obblighi contabili." },
      { title: '6. Destinatari dei dati', body: "I tuoi dati possono essere trasmessi ai nostri subappaltatori tecnici (hosting, pagamento, analisi) nel rispetto del GDPR. Non vendiamo mai i tuoi dati a terzi. Per trasferimenti al di fuori dell'UE, garantiamo misure di salvaguardia appropriate (clausole contrattuali standard)." },
      { title: '7. I tuoi diritti', body: "Ai sensi del GDPR, hai i seguenti diritti: accesso, rettifica, cancellazione (\"diritto all'oblio\"), limitazione del trattamento, portabilità e opposizione. Per esercitare i tuoi diritti, contattaci a contact@sellerlab.ai. Puoi anche presentare un reclamo all'autorità di protezione dei dati competente." },
      { title: '8. Cookie', body: 'Utilizziamo cookie essenziali per il funzionamento del servizio e cookie analitici (con il tuo consenso) per misurare il traffico. Puoi accettare o rifiutare i cookie tramite il nostro banner di consenso. Il rifiuto non influisce sul tuo accesso al servizio.' },
      { title: '9. Sicurezza', body: 'Implementiamo misure tecniche e organizzative appropriate per proteggere i tuoi dati contro accessi non autorizzati, perdita o distruzione (crittografia, accesso limitato, backup regolari).' },
      { title: '10. Modifiche', body: "Possiamo aggiornare questa informativa in qualsiasi momento. Qualsiasi modifica sostanziale sarà notificata via email con un preavviso di 15 giorni. La data dell'ultimo aggiornamento è indicata in cima al documento." },
    ],
  },
  de: {
    title: 'Datenschutzrichtlinie',
    updated: 'Letzte Aktualisierung: Mai 2026',
    sections: [
      { title: '1. Verantwortlicher', body: 'SellerLab AI ("wir") ist Verantwortlicher für die Verarbeitung deiner über sellerlab.ai erhobenen personenbezogenen Daten. Bei Fragen zu deinen Daten kontaktiere uns: contact@sellerlab.ai.' },
      { title: '2. Erhobene Daten', body: 'Wir erheben Daten, die du bei der Kontoerstellung angibst (E-Mail-Adresse, Vorname), Nutzungsdaten (hochgeladene Fotos, generierte Angebote) und technische Daten (IP-Adresse, Browsertyp, besuchte Seiten) für statistische Zwecke.' },
      { title: '3. Verarbeitungszwecke', body: 'Deine Daten werden verwendet, um den Dienst bereitzustellen und zu verbessern, dein Konto und Abonnement zu verwalten, dienstbezogene Mitteilungen zu senden (Updates, Rechnungen) und die Dienstnutzung aggregiert und anonymisiert zu analysieren.' },
      { title: '4. Rechtsgrundlage', body: 'Die Datenverarbeitung basiert auf: Vertragserfüllung (Dienstleistungserbringung), deiner Einwilligung (Marketingkommunikation), unserem berechtigten Interesse (Dienstverbesserung, Sicherheit) und der Einhaltung gesetzlicher Verpflichtungen.' },
      { title: '5. Datenspeicherung', body: 'Deine Kontodaten werden für die Dauer deines Abonnements und 3 Jahre nach Kündigung aufbewahrt, sofern keine gesetzliche Aufbewahrungspflicht besteht. Hochgeladene Fotos werden nach der Verarbeitung gelöscht. Rechnungsdaten werden gemäß Buchführungspflichten 10 Jahre aufbewahrt.' },
      { title: '6. Datenempfänger', body: 'Deine Daten können an unsere technischen Auftragsverarbeiter (Hosting, Zahlung, Analytik) weitergegeben werden, unter Einhaltung der DSGVO. Wir verkaufen deine Daten nie an Dritte. Für Übermittlungen außerhalb der EU gewährleisten wir geeignete Schutzmaßnahmen (Standardvertragsklauseln).' },
      { title: '7. Deine Rechte', body: 'Gemäß DSGVO hast du folgende Rechte: Zugang, Berichtigung, Löschung ("Recht auf Vergessenwerden"), Einschränkung der Verarbeitung, Portabilität und Widerspruch. Zur Ausübung deiner Rechte wende dich an contact@sellerlab.ai. Du kannst auch Beschwerde bei der zuständigen Datenschutzbehörde einlegen.' },
      { title: '8. Cookies', body: 'Wir verwenden für den Dienst notwendige Cookies und Analyse-Cookies (mit deiner Einwilligung) zur Besuchsmessung. Du kannst Cookies über unser Einwilligungsbanner akzeptieren oder ablehnen. Die Ablehnung beeinträchtigt deinen Zugang zum Dienst nicht.' },
      { title: '9. Sicherheit', body: 'Wir treffen angemessene technische und organisatorische Maßnahmen zum Schutz deiner Daten vor unbefugtem Zugriff, Verlust oder Vernichtung (Verschlüsselung, eingeschränkter Zugang, regelmäßige Backups).' },
      { title: '10. Änderungen', body: 'Wir können diese Richtlinie jederzeit aktualisieren. Wesentliche Änderungen werden per E-Mail mit 15 Tagen Vorankündigung mitgeteilt. Das Datum der letzten Aktualisierung ist oben im Dokument angegeben.' },
    ],
  },
  pl: {
    title: 'Polityka Prywatności',
    updated: 'Ostatnia aktualizacja: maj 2026',
    sections: [
      { title: '1. Administrator danych', body: 'SellerLab AI ("my") jest administratorem Twoich danych osobowych zbieranych za pośrednictwem sellerlab.ai. W przypadku jakichkolwiek pytań dotyczących Twoich danych, skontaktuj się z nami: contact@sellerlab.ai.' },
      { title: '2. Zbierane dane', body: 'Zbieramy dane podane podczas tworzenia konta (adres email, imię), dane użytkowania usługi (przesłane zdjęcia, wygenerowane ogłoszenia) oraz dane techniczne (adres IP, typ przeglądarki, odwiedzone strony) w celach statystycznych.' },
      { title: '3. Cele przetwarzania', body: "Twoje dane są wykorzystywane do: świadczenia i ulepszania usługi, zarządzania Twoim kontem i subskrypcją, wysyłania komunikacji związanych z usługą (aktualizacje, faktury) i analizowania korzystania z usługi w sposób zagregowany i zanonimizowany." },
      { title: '4. Podstawa prawna', body: 'Przetwarzanie danych opiera się na: wykonaniu umowy (świadczenie usługi), Twojej zgodzie (komunikacja marketingowa), naszym uzasadnionym interesie (ulepszanie usługi, bezpieczeństwo) i przestrzeganiu obowiązków prawnych.' },
      { title: '5. Okres przechowywania', body: "Twoje dane konta są przechowywane przez cały okres subskrypcji i 3 lata po jej zakończeniu, chyba że prawo stanowi inaczej. Przesłane zdjęcia są usuwane po przetworzeniu. Dane rozliczeniowe są przechowywane przez 10 lat zgodnie z obowiązkami księgowymi." },
      { title: '6. Odbiorcy danych', body: 'Twoje dane mogą być przekazywane naszym podwykonawcom technicznym (hosting, płatności, analityka) zgodnie z RODO. Nigdy nie sprzedajemy Twoich danych stronom trzecim. W przypadku przekazywania poza UE zapewniamy odpowiednie zabezpieczenia (standardowe klauzule umowne).' },
      { title: '7. Twoje prawa', body: 'Zgodnie z RODO masz następujące prawa: dostęp, sprostowanie, usunięcie ("prawo do bycia zapomnianym"), ograniczenie przetwarzania, przenoszalność i sprzeciw. Aby skorzystać z praw, skontaktuj się z nami pod adresem contact@sellerlab.ai. Możesz też złożyć skargę do właściwego organu ochrony danych.' },
      { title: '8. Pliki cookie', body: 'Używamy plików cookie niezbędnych do działania usługi i analitycznych plików cookie (za Twoją zgodą) do mierzenia ruchu. Możesz zaakceptować lub odrzucić pliki cookie za pomocą naszego banera zgody. Odrzucenie nie wpływa na Twój dostęp do usługi.' },
      { title: '9. Bezpieczeństwo', body: 'Wdrażamy odpowiednie środki techniczne i organizacyjne w celu ochrony Twoich danych przed nieautoryzowanym dostępem, utratą lub zniszczeniem (szyfrowanie, ograniczony dostęp, regularne kopie zapasowe).' },
      { title: '10. Zmiany', body: 'Możemy w dowolnym momencie aktualizować tę politykę. Wszelkie istotne zmiany będą komunikowane pocztą elektroniczną z 15-dniowym wyprzedzeniem. Data ostatniej aktualizacji jest podana na początku tego dokumentu.' },
    ],
  },
  nl: {
    title: 'Privacybeleid',
    updated: 'Laatste update: mei 2026',
    sections: [
      { title: '1. Verwerkingsverantwoordelijke', body: 'SellerLab AI ("wij") is de verwerkingsverantwoordelijke voor je persoonsgegevens die worden verzameld via sellerlab.ai. Voor vragen over je gegevens neem je contact met ons op: contact@sellerlab.ai.' },
      { title: '2. Verzamelde gegevens', body: "We verzamelen gegevens die je verstrekt bij het aanmaken van een account (e-mailadres, voornaam), gebruiksgegevens van de dienst (geüploade foto's, gegenereerde advertenties) en technische gegevens (IP-adres, browsertype, bezochte pagina's) voor statistische doeleinden." },
      { title: '3. Verwerkingsdoeleinden', body: 'Je gegevens worden gebruikt om de dienst te leveren en te verbeteren, je account en abonnement te beheren, dienstgerelateerde communicatie te sturen (updates, facturen) en het gebruik van de dienst geaggregeerd en geanonimiseerd te analyseren.' },
      { title: '4. Juridische grondslag', body: 'De verwerking van gegevens is gebaseerd op: uitvoering van de overeenkomst (dienstverlening), je toestemming (marketingcommunicatie), ons gerechtvaardigd belang (verbetering van de dienst, beveiliging) en naleving van wettelijke verplichtingen.' },
      { title: '5. Bewaartermijn', body: "Je accountgegevens worden bewaard gedurende de looptijd van je abonnement en 3 jaar na beëindiging, tenzij de wet anders vereist. Geüploade foto's worden na verwerking verwijderd. Factureringsgegevens worden 10 jaar bewaard conform boekhoudkundige verplichtingen." },
      { title: '6. Ontvangers van gegevens', body: 'Je gegevens kunnen worden gedeeld met onze technische onderaannemers (hosting, betaling, analytics) in overeenstemming met de AVG. We verkopen je gegevens nooit aan derden. Voor overdrachten buiten de EU zorgen we voor passende waarborgen (standaard contractuele clausules).' },
      { title: '7. Jouw rechten', body: 'Onder de AVG heb je de volgende rechten: toegang, rectificatie, wissing ("recht op vergetelheid"), beperking van de verwerking, overdraagbaarheid en bezwaar. Om je rechten uit te oefenen, neem contact op via contact@sellerlab.ai. Je kunt ook een klacht indienen bij de bevoegde gegevensbeschermingsautoriteit.' },
      { title: '8. Cookies', body: "We gebruiken cookies die essentieel zijn voor de dienst en analytische cookies (met jouw toestemming) om het verkeer te meten. Je kunt cookies accepteren of weigeren via onze toestemmingsbanner. Weigering heeft geen invloed op je toegang tot de dienst." },
      { title: '9. Beveiliging', body: 'We treffen passende technische en organisatorische maatregelen om je gegevens te beschermen tegen ongeautoriseerde toegang, verlies of vernietiging (versleuteling, beperkte toegang, regelmatige back-ups).' },
      { title: '10. Wijzigingen', body: 'We kunnen dit beleid op elk moment bijwerken. Wezenlijke wijzigingen worden per e-mail meegedeeld met 15 dagen voorafgaande kennisgeving. De datum van de laatste update staat bovenaan dit document.' },
    ],
  },
}

export default function ConfidentialiteContent() {
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
            {page.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{section.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-gray-400 border-t border-gray-100 pt-6">
            contact@sellerlab.ai
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
