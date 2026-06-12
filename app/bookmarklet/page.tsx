'use client'

import { useEffect, useRef } from 'react'
import { Bookmark, AlertTriangle } from 'lucide-react'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'
import { useLang } from '@/app/providers'
import type { Lang } from '@/lib/i18n'

/* ─── Traductions — 7 langues ─────────────────────────────────────────────── */

const T: Record<Lang, {
  title: string
  subtitle: string
  step1Title: string; step1Desc: string
  step2Title: string; step2Desc: string
  step3Title: string; step3Desc: string
  dragBtn: string
  dragHint: string
  warningTitle: string; warningDesc: string
  bookmarkletName: string
}> = {
  fr: {
    title: 'Installer le Bookmarklet',
    subtitle: 'Remplissez votre annonce Vinted en un clic depuis SellerLab.',
    step1Title: '1. Affichez votre barre de favoris',
    step1Desc: 'Chrome : Ctrl+Shift+B (Windows) / Cmd+Shift+B (Mac) · Safari : Présentation → Barre de favoris',
    step2Title: '2. Glissez le bouton dans vos favoris',
    step2Desc: 'Faites glisser le bouton orange ci-dessous vers votre barre de favoris.',
    step3Title: '3. Utilisez-le sur Vinted',
    step3Desc: 'Cliquez sur "Remplir Vinted automatiquement" dans SellerLab, puis sur le bookmarklet dans vos favoris.',
    dragBtn: 'SellerLab',
    dragHint: 'Ne cliquez pas — glissez ce bouton dans votre barre de favoris',
    warningTitle: 'Si le bookmarklet cesse de fonctionner',
    warningDesc: 'Supprimez l\'ancien favoris, revenez sur cette page et réinstallez-le.',
    bookmarkletName: 'SellerLab — remplir Vinted',
  },
  en: {
    title: 'Install the Bookmarklet',
    subtitle: 'Fill your Vinted listing in one click from SellerLab.',
    step1Title: '1. Show your bookmarks bar',
    step1Desc: 'Chrome: Ctrl+Shift+B (Windows) / Cmd+Shift+B (Mac) · Safari: View → Bookmarks Bar',
    step2Title: '2. Drag the button to your bookmarks bar',
    step2Desc: 'Drag the orange button below to your bookmarks bar.',
    step3Title: '3. Use it on Vinted',
    step3Desc: 'Click "Auto-fill Vinted" in SellerLab, then click the bookmarklet in your bookmarks bar.',
    dragBtn: 'SellerLab',
    dragHint: 'Don\'t click — drag this button to your bookmarks bar',
    warningTitle: 'If the bookmarklet stops working',
    warningDesc: 'Delete the old bookmark, come back to this page and reinstall it.',
    bookmarkletName: 'SellerLab — fill Vinted',
  },
  es: {
    title: 'Instalar el Bookmarklet',
    subtitle: 'Rellena tu anuncio de Vinted con un clic desde SellerLab.',
    step1Title: '1. Muestra tu barra de favoritos',
    step1Desc: 'Chrome: Ctrl+Shift+B (Windows) / Cmd+Shift+B (Mac)',
    step2Title: '2. Arrastra el botón a tu barra de favoritos',
    step2Desc: 'Arrastra el botón naranja de abajo a tu barra de favoritos.',
    step3Title: '3. Úsalo en Vinted',
    step3Desc: 'Haz clic en "Rellenar Vinted automáticamente" en SellerLab, luego en el bookmarklet.',
    dragBtn: 'SellerLab',
    dragHint: 'No hagas clic — arrastra este botón a tu barra de favoritos',
    warningTitle: 'Si el bookmarklet deja de funcionar',
    warningDesc: 'Elimina el marcador antiguo, vuelve a esta página y reinstálalo.',
    bookmarkletName: 'SellerLab — rellenar Vinted',
  },
  de: {
    title: 'Bookmarklet installieren',
    subtitle: 'Fülle dein Vinted-Inserat mit einem Klick aus SellerLab heraus aus.',
    step1Title: '1. Lesezeichen-Leiste anzeigen',
    step1Desc: 'Chrome: Strg+Shift+B (Windows) / Cmd+Shift+B (Mac)',
    step2Title: '2. Ziehe die Schaltfläche in die Lesezeichen-Leiste',
    step2Desc: 'Ziehe die orangefarbene Schaltfläche in deine Lesezeichen-Leiste.',
    step3Title: '3. Auf Vinted verwenden',
    step3Desc: 'Klicke auf "Vinted automatisch ausfüllen" in SellerLab, dann auf das Bookmarklet.',
    dragBtn: 'SellerLab',
    dragHint: 'Nicht klicken — ziehe diesen Button in deine Lesezeichen-Leiste',
    warningTitle: 'Falls das Bookmarklet nicht mehr funktioniert',
    warningDesc: 'Lösche das alte Lesezeichen, kehre zu dieser Seite zurück und installiere es neu.',
    bookmarkletName: 'SellerLab — Vinted ausfüllen',
  },
  it: {
    title: 'Installa il Bookmarklet',
    subtitle: 'Compila il tuo annuncio Vinted in un clic da SellerLab.',
    step1Title: '1. Mostra la barra dei segnalibri',
    step1Desc: 'Chrome: Ctrl+Shift+B (Windows) / Cmd+Shift+B (Mac)',
    step2Title: '2. Trascina il pulsante nella barra dei segnalibri',
    step2Desc: 'Trascina il pulsante arancione qui sotto nella barra dei segnalibri.',
    step3Title: '3. Usalo su Vinted',
    step3Desc: 'Clicca su "Compila Vinted automaticamente" in SellerLab, poi sul bookmarklet.',
    dragBtn: 'SellerLab',
    dragHint: 'Non cliccare — trascina questo pulsante nella barra dei segnalibri',
    warningTitle: 'Se il bookmarklet smette di funzionare',
    warningDesc: 'Elimina il vecchio segnalibro, torna su questa pagina e reinstallalo.',
    bookmarkletName: 'SellerLab — compila Vinted',
  },
  nl: {
    title: 'Installeer de Bookmarklet',
    subtitle: 'Vul je Vinted-advertentie in één klik in vanuit SellerLab.',
    step1Title: '1. Toon je bladwijzerbalk',
    step1Desc: 'Chrome: Ctrl+Shift+B (Windows) / Cmd+Shift+B (Mac)',
    step2Title: '2. Sleep de knop naar de bladwijzerbalk',
    step2Desc: 'Sleep de oranje knop hieronder naar je bladwijzerbalk.',
    step3Title: '3. Gebruik het op Vinted',
    step3Desc: 'Klik op "Vinted automatisch invullen" in SellerLab, dan op de bookmarklet.',
    dragBtn: 'SellerLab',
    dragHint: 'Niet klikken — sleep deze knop naar de bladwijzerbalk',
    warningTitle: 'Als de bookmarklet stopt met werken',
    warningDesc: 'Verwijder de oude bladwijzer, kom terug naar deze pagina en herinstalleer.',
    bookmarkletName: 'SellerLab — Vinted invullen',
  },
  pl: {
    title: 'Zainstaluj Bookmarklet',
    subtitle: 'Wypełnij ogłoszenie Vinted jednym kliknięciem z SellerLab.',
    step1Title: '1. Pokaż pasek zakładek',
    step1Desc: 'Chrome: Ctrl+Shift+B (Windows) / Cmd+Shift+B (Mac)',
    step2Title: '2. Przeciągnij przycisk na pasek zakładek',
    step2Desc: 'Przeciągnij pomarańczowy przycisk poniżej na pasek zakładek.',
    step3Title: '3. Użyj na Vinted',
    step3Desc: 'Kliknij "Automatycznie wypełnij Vinted" w SellerLab, następnie kliknij bookmarklet.',
    dragBtn: 'SellerLab',
    dragHint: 'Nie klikaj — przeciągnij ten przycisk na pasek zakładek',
    warningTitle: 'Jeśli bookmarklet przestanie działać',
    warningDesc: 'Usuń stary zakładkę, wróć na tę stronę i zainstaluj ponownie.',
    bookmarkletName: 'SellerLab — wypełnij Vinted',
  },
}

/* ─── Script bookmarklet (injecté avec l'origine dynamique) ──────────────── */

function buildBookmarkletHref(origin: string): string {
  // sv : injecte une valeur dans un champ React sans déclencher d'erreur React
  const sv = `function sv(el,v){if(!el)return;try{var P=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(P,'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}}`

  // sc : ouvre le dropdown Catégorie via input[name="category"] et navigue jusqu'à 5 niveaux
  // af : auto-sélectionne la 1re option si Vinted affiche encore un sous-niveau après le dernier niveau du path
  const sc = `function sc(path,cb){if(!path){cb&&cb();return;}var parts=path.split(' > ');function cv(text){var opts=Array.from(document.querySelectorAll('[class*="Cell__navigating"],[class*="Cell__clickable"]')).filter(function(el){var r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.top>0;});var m=opts.find(function(el){return el.textContent.trim()===text;});if(!m)m=opts.find(function(el){return el.textContent.trim().toLowerCase().startsWith(text.toLowerCase());});if(m)m.click();return!!m;}function af(cb){var opts=Array.from(document.querySelectorAll('[class*="Cell__navigating"],[class*="Cell__clickable"]')).filter(function(el){var r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.top>0;});if(opts.length>0){opts[0].click();setTimeout(function(){cb&&cb();},600);}else{cb&&cb();}}setTimeout(function(){document.querySelector('input[name="category"]').click();setTimeout(function(){cv(parts[0]);if(parts.length<2){setTimeout(function(){af(cb);},1200);return;}setTimeout(function(){cv(parts[1]);if(parts.length<3){setTimeout(function(){af(cb);},1200);return;}setTimeout(function(){cv(parts[2]);if(parts.length<4){setTimeout(function(){af(cb);},1200);return;}setTimeout(function(){cv(parts[3]);if(parts.length<5){setTimeout(function(){af(cb);},1200);return;}setTimeout(function(){cv(parts[4]);setTimeout(function(){af(cb);},1200);},1200);},1200);},1200);},1200);},1000);},600);}`

  // fb : ouvre le dropdown Marque, tape la marque dans le champ de recherche, clique le résultat
  const fb = `function fb(brand,cb){if(!brand){cb&&cb();return;}var brandInput=document.querySelector('input[name="brand"]');if(!brandInput){cb&&cb();return;}brandInput.click();setTimeout(function(){var s=document.querySelector('input[name="brand-search-input"]');if(!s){cb&&cb();return;}var setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(s,brand);s.dispatchEvent(new Event('input',{bubbles:true}));setTimeout(function(){var opts=Array.from(document.querySelectorAll('[class*="Cell__clickable"]')).filter(function(el){var r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.top>0;});var m=opts.find(function(el){return el.textContent.trim()===brand;});if(!m)m=opts.find(function(el){return el.textContent.trim().toLowerCase().startsWith(brand.toLowerCase());});if(m)m.click();setTimeout(function(){cb&&cb();},500);},1500);},500);}`

  // fs : sélectionne la taille — null-check + fallback "Taille unique" multi-locale
  const fs = `function fs(v,cb){if(!v){cb&&cb();return;}var sEl=document.querySelector('input[name="size"]');if(!sEl){cb&&cb();return;}sEl.click();setTimeout(function(){var m=document.querySelector('[role="checkbox"][aria-label="'+v+'"]');if(!m){var os=['Taille unique','One Size','Einheitsgröße','Taglia unica','Talla única','Één maat','Jeden rozmiar'];if(os.indexOf(v)!==-1){for(var i=0;i<os.length;i++){m=document.querySelector('[role="checkbox"][aria-label="'+os[i]+'"]');if(m)break;}}}if(m)m.click();setTimeout(function(){cb&&cb();},300);},800);}`

  // fd : ouvre un dropdown par input[name], sélectionne la valeur exacte ou startsWith
  const fd = `function fd(name,v,cb){if(!v){cb&&cb();return;}var el=document.querySelector('input[name="'+name+'"]');if(!el){cb&&cb();return;}el.click();setTimeout(function(){var opts=Array.from(document.querySelectorAll('[class*="Cell__clickable"]')).filter(function(el){var r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.top>0;});var m=opts.find(function(el){return el.textContent.trim()===v;});if(!m)m=opts.find(function(el){return el.textContent.trim().startsWith(v);});if(m)m.click();setTimeout(function(){cb&&cb();},500);},800);}`

  const script = [
    '(function(){',
    `var O='${origin}';`,
    `var t=new URLSearchParams(location.search).get('sltoken');`,
    `if(!t){alert('[SellerLab] Token manquant. Ouvrez Vinted depuis SellerLab.');return;}`,
    sv, sc, fb, fs, fd,
    `fetch(O+'/api/bookmarklet-data?token='+t,{credentials:'omit'})`,
    `.then(function(r){return r.json();})`,
    `.then(function(d){`,
    `if(d.error){alert('[SellerLab] '+(d.error==='expired'?'Donnees expirees. Regenerez depuis SellerLab.':'Donnees introuvables.'));return;}`,
    // Champs texte — sélecteurs exacts Vinted
    `sv(document.querySelector('input[name="title"]'),d.titre);`,
    `sv(document.querySelector('textarea[name="description"]'),d.description);`,
    `sv(document.querySelector('input[name="price"]'),String(d.prix));`,
    // Catégorie (jusqu'à 4 niveaux), puis dropdowns en cascade
    `sc(d.categorie,function(){setTimeout(function(){`,
    `fb(d.marque,function(){setTimeout(function(){`,
    `fs(d.taille,function(){setTimeout(function(){`,
    `fd('condition',d.etat,function(){setTimeout(function(){`,
    `fd('color',d.couleurs&&d.couleurs[0],function(){setTimeout(function(){`,
    `fd('color',d.couleurs&&d.couleurs[1],function(){setTimeout(function(){`,
    `fd('material',d.materiau,function(){`,
    `alert('[SellerLab] Formulaire rempli !');`,
    '});},600);});',
    '},600);});},600);});},600);});},600);});',
    `},1500);});`,
    `}).catch(function(err){alert('[SellerLab] Erreur: '+err.message);});`,
    '})();',
  ].join('')

  return 'javascript:' + encodeURIComponent(script)
}

/* ─── Composant ──────────────────────────────────────────────────────────── */

export default function BookmarkletPage() {
  const { lang } = useLang()
  const t = T[lang] ?? T.fr
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.setAttribute('href', buildBookmarkletHref(window.location.origin))
    }
  }, [])

  const steps = [
    { title: t.step1Title, desc: t.step1Desc, icon: '1' },
    { title: t.step2Title, desc: t.step2Desc, icon: '2' },
    { title: t.step3Title, desc: t.step3Desc, icon: '3' },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <SiteHeader />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto space-y-10">

          {/* En-tête */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 mb-4">
              <Bookmark className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="font-display font-extrabold text-3xl text-gray-900 mb-2">{t.title}</h1>
            <p className="text-gray-500 text-base">{t.subtitle}</p>
          </div>

          {/* Étapes */}
          <div className="space-y-5">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 font-extrabold text-sm flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-0.5">{s.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton à glisser */}
          <div className="flex flex-col items-center gap-4 py-8 px-6 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{t.step2Title.replace(/^2\.\s*/, '')}</p>
            <a
              ref={linkRef}
              draggable="true"
              title={t.bookmarkletName}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-200 cursor-grab active:cursor-grabbing transition-colors select-none"
            >
              <Bookmark className="w-4 h-4" />
              {t.dragBtn}
            </a>
            <p className="text-xs font-semibold text-indigo-500">{t.dragHint}</p>
          </div>

          {/* Avertissement réinstallation */}
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 mb-0.5">{t.warningTitle}</p>
              <p className="text-xs text-amber-700">{t.warningDesc}</p>
            </div>
          </div>

        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
