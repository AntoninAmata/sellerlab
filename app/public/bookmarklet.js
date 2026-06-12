// SellerLab Bookmarklet — source lisible
// La version minifiée est générée côté client dans app/bookmarklet/page.tsx.
// Ce fichier sert de référence documentée.

(function () {
  var ORIGIN = '%%ORIGIN%%'; // remplacé dynamiquement par window.location.origin
  var token = new URLSearchParams(location.search).get('sltoken');
  if (!token) {
    alert('[SellerLab] Aucun token trouvé.\nOuvrez Vinted depuis le bouton "Remplir Vinted automatiquement" dans SellerLab.');
    return;
  }

  // sv : injecte une valeur dans un champ React sans déclencher l'erreur React #418
  function sv(el, v) {
    if (!el) return;
    try {
      var P = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(P, 'value').set.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (e) { /* noop */ }
  }

  // sc : ouvre le dropdown Catégorie et navigue jusqu'à 4 niveaux
  // path = "Femmes > Vêtements > Robes > Robes courtes" (séparé par " > ")
  // Après le dernier niveau spécifié, si Vinted affiche encore des options
  // (sous-catégorie non couverte par la taxonomie), la première est auto-sélectionnée.
  function sc(path, cb) {
    if (!path) { cb && cb(); return; }
    var parts = path.split(' > ');

    function clickVisible(text) {
      var opts = Array.from(document.querySelectorAll('[class*="Cell__navigating"], [class*="Cell__clickable"]')).filter(function (el) {
        var r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top > 0;
      });
      console.log('[SL] clickVisible("' + text + '") — options:', opts.map(function (el) { return el.textContent.trim(); }));
      var match = opts.find(function (el) { return el.textContent.trim() === text; });
      if (!match) match = opts.find(function (el) { return el.textContent.trim().toLowerCase().startsWith(text.toLowerCase()); });
      console.log('[SL] match:', match ? 'OUI' : 'NON');
      if (match) match.click();
      return !!match;
    }

    // Si après le dernier niveau navigué le dropdown est encore visible, sélectionne la 1re option
    function autoFirst(cb) {
      var opts = Array.from(document.querySelectorAll('[class*="Cell__navigating"], [class*="Cell__clickable"]')).filter(function (el) {
        var r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top > 0;
      });
      if (opts.length > 0) {
        console.log('[SL] sous-niveau supplémentaire détecté, auto-sélection :', opts[0].textContent.trim());
        opts[0].click();
        setTimeout(function () { cb && cb(); }, 600);
      } else {
        cb && cb();
      }
    }

    setTimeout(function () {
      console.log('[SL] ouverture dropdown catégorie');
      document.querySelector('input[name="category"]').click();

      setTimeout(function () {
        console.log('[SL] niveau 1 — parts[0]:', parts[0]);
        clickVisible(parts[0]);
        if (parts.length < 2) { setTimeout(function () { autoFirst(cb); }, 1200); return; }

        setTimeout(function () {
          console.log('[SL] niveau 2 — parts[1]:', parts[1]);
          clickVisible(parts[1]);
          if (parts.length < 3) { setTimeout(function () { autoFirst(cb); }, 1200); return; }

          setTimeout(function () {
            console.log('[SL] niveau 3 — parts[2]:', parts[2]);
            clickVisible(parts[2]);
            if (parts.length < 4) { setTimeout(function () { autoFirst(cb); }, 1200); return; }

            setTimeout(function () {
              console.log('[SL] niveau 4 — parts[3]:', parts[3]);
              clickVisible(parts[3]);
              if (parts.length < 5) { setTimeout(function () { autoFirst(cb); }, 1200); return; }

              setTimeout(function () {
                console.log('[SL] niveau 5 — parts[4]:', parts[4]);
                clickVisible(parts[4]);
                setTimeout(function () { autoFirst(cb); }, 1200);
              }, 1200);
            }, 1200);
          }, 1200);
        }, 1200);
      }, 1000);
    }, 600);
  }

  // fb : ouvre le dropdown Marque via input[name="brand"], tape la marque, clique le résultat
  function fb(brand, cb) {
    if (!brand) { cb && cb(); return; }
    var brandInput = document.querySelector('input[name="brand"]');
    if (!brandInput) { cb && cb(); return; }
    brandInput.click();
    setTimeout(function () {
      var search = document.querySelector('input[name="brand-search-input"]');
      if (!search) { cb && cb(); return; }
      var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(search, brand);
      search.dispatchEvent(new Event('input', { bubbles: true }));
      setTimeout(function () {
        var opts = Array.from(document.querySelectorAll('[class*="Cell__clickable"]')).filter(function (el) {
          var r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.top > 0;
        });
        var match = opts.find(function (el) { return el.textContent.trim() === brand; });
        if (!match) match = opts.find(function (el) { return el.textContent.trim().toLowerCase().startsWith(brand.toLowerCase()); });
        if (match) match.click();
        setTimeout(function () { cb && cb(); }, 500);
      }, 1500);
    }, 500);
  }

  // fs : ouvre le dropdown Taille et sélectionne via [role="checkbox"][aria-label="VALEUR"]
  // Null-check si le champ n'existe pas (catégories sans taille).
  // Fallback "Taille unique" dans les 7 langues de l'interface Vinted.
  function fs(v, cb) {
    if (!v) { cb && cb(); return; }
    var sizeEl = document.querySelector('input[name="size"]');
    if (!sizeEl) { cb && cb(); return; }
    sizeEl.click();
    setTimeout(function () {
      var match = document.querySelector('[role="checkbox"][aria-label="' + v + '"]');
      if (!match) {
        var oneSize = ['Taille unique', 'One Size', 'Einheitsgröße', 'Taglia unica', 'Talla única', 'Één maat', 'Jeden rozmiar'];
        if (oneSize.indexOf(v) !== -1) {
          for (var i = 0; i < oneSize.length; i++) {
            match = document.querySelector('[role="checkbox"][aria-label="' + oneSize[i] + '"]');
            if (match) break;
          }
        }
      }
      if (match) match.click();
      setTimeout(function () { cb && cb(); }, 300);
    }, 800);
  }

  // fd : ouvre un dropdown par son input[name], sélectionne la valeur exacte ou startsWith
  function fd(name, v, cb) {
    if (!v) { cb && cb(); return; }
    var el = document.querySelector('input[name="' + name + '"]');
    if (!el) { cb && cb(); return; }
    el.click();
    setTimeout(function () {
      var opts = Array.from(document.querySelectorAll('[class*="Cell__clickable"]')).filter(function (el) {
        var r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top > 0;
      });
      var match = opts.find(function (el) { return el.textContent.trim() === v; });
      if (!match) match = opts.find(function (el) { return el.textContent.trim().startsWith(v); });
      if (match) match.click();
      setTimeout(function () { cb && cb(); }, 500);
    }, 800);
  }

  fetch(ORIGIN + '/api/bookmarklet-data?token=' + token, { credentials: 'omit' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d.error) {
        var msg = d.error === 'expired'
          ? 'Données expirées (15 min). Retournez sur SellerLab et régénérez.'
          : 'Données introuvables. Retournez sur SellerLab.';
        alert('[SellerLab] ' + msg);
        return;
      }

      // 1. Champs texte — sélecteurs stables Vinted
      sv(document.querySelector('input[name="title"]'), d.titre);
      sv(document.querySelector('textarea[name="description"]'), d.description);
      sv(document.querySelector('input[name="price"]'), String(d.prix));

      // 2. Catégorie (jusqu'à 4 niveaux), puis 1500ms d'attente
      // 3. Dropdowns en cascade : Marque → Taille → État → Couleur 1 → Couleur 2
      setTimeout(function () {
        sc(d.categorie, function () {
          setTimeout(function () {
            fb(d.marque, function () {
              setTimeout(function () {
                fs(d.taille, function () {
                  setTimeout(function () {
                    fd('condition', d.etat, function () {
                      setTimeout(function () {
                        fd('color', d.couleurs && d.couleurs[0], function () {
                          setTimeout(function () {
                            fd('color', d.couleurs && d.couleurs[1], function () {
                              setTimeout(function () {
                                fd('material', d.materiau, function () {
                                  alert('[SellerLab] ✓ Formulaire rempli !');
                                });
                              }, 600);
                            });
                          }, 600);
                        });
                      }, 600);
                    });
                  }, 600);
                });
              }, 600);
            });
          }, 1500);
        });
      }, 600);
    })
    .catch(function (err) { alert('[SellerLab] Erreur réseau : ' + err.message); });
})();
