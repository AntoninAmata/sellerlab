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
