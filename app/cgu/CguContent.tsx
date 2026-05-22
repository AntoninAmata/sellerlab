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
