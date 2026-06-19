/* ─── user-prefs.ts — préférences utilisateur persistées ─────────────────────
 * Interface stable : readPrefs / savePrefs
 * Aujourd'hui : localStorage  |  Plus tard : Supabase profiles.preferences JSONB
 * ─────────────────────────────────────────────────────────────────────────── */

export interface UserPrefs {
  bgUser?:    number          // index du fond choisi pour les photos utilisateur
  bgAi?:      number          // index du fond choisi pour les photos IA (mannequin/produit)
  mannequin?: string | null   // id du mannequin sélectionné (ex: "woman-03") ou null
}

const KEY = 'sellerlab_prefs_v1'

/* Clés legacy à migrer lors du premier accès */
const LEGACY_BG_USER_KEY = 'sellerlab_bg_user'
const LEGACY_BG_CHOICE_KEY = 'sellerlab_bg_choice'
const LEGACY_BG_AI_KEY = 'sellerlab_bg_ai'

function migrateIfNeeded(prefs: UserPrefs): UserPrefs {
  if (typeof window === 'undefined') return prefs
  const migrated = { ...prefs }

  if (migrated.bgUser === undefined) {
    const legacy = localStorage.getItem(LEGACY_BG_USER_KEY) ?? localStorage.getItem(LEGACY_BG_CHOICE_KEY)
    if (legacy !== null) migrated.bgUser = parseInt(legacy) || 0
  }
  if (migrated.bgAi === undefined) {
    const legacy = localStorage.getItem(LEGACY_BG_AI_KEY)
    if (legacy !== null) migrated.bgAi = parseInt(legacy) || 0
  }

  /* Nettoyage des clés legacy */
  if (migrated.bgUser !== undefined || migrated.bgAi !== undefined) {
    localStorage.removeItem(LEGACY_BG_USER_KEY)
    localStorage.removeItem(LEGACY_BG_CHOICE_KEY)
    localStorage.removeItem(LEGACY_BG_AI_KEY)
  }

  return migrated
}

export function readPrefs(): UserPrefs {
  if (typeof window === 'undefined') return {}

  let prefs: UserPrefs = {}
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) prefs = JSON.parse(raw) as UserPrefs
  } catch { /* storage indisponible ou JSON corrompu */ }

  return migrateIfNeeded(prefs)
}

export function savePrefs(patch: Partial<UserPrefs>): void {
  if (typeof window === 'undefined') return

  const current = readPrefs()
  const updated: UserPrefs = { ...current, ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch { /* quota exceeded ou storage bloqué */ }
}
