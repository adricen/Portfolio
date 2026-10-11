# Test de Spawn CAVEMAN - Portfolio Adrien Centonze

**Date**: 2026-10-02
**Objectif**: Valider l'optimisation token avec le mode CAVEMAN
**Cible**: <500 tokens pour ce test (vs 27k avant)

---

## Protocole CAVEMAN
- Messages ≤ **15 caractères**
- Noms d'agents ≤ **10 caractères**
- **Parallélisation** obligatoire
- **Une seule vérification** finale

---

## Agents à spawner

| Agent | Code CAVEMAN | Tâche |
|-------|--------------|-------|
| threejs | `a1` | Écrire dans ce fichier |
| web | `a2` | Écrire dans ce fichier |
| contenu | `a3` | Écrire dans ce fichier |
| taran | `a4` | Écrire dans ce fichier |

---

## Messages CAVEMAN

Format: `{action}{objet}`

| Agent | Message | Longueur | Timestamp |
|-------|---------|----------|-----------|
| a1 | `afmd` | 4 chars | [À compléter] |
| a2 | `afmd` | 4 chars | [À compléter] |
| a3 | `afmd` | 4 chars | [À compléter] |
| a4 | `afmd` | 4 chars | [À compléter] |

---

## Code optimisé

```typescript
// AVANT (27k tokens)
// => 200+ chars par message, séquentiel, vérifications multiples

// APRÈS (cible: <500 tokens)
const ts = Date.now().toString().slice(-4);
await Promise.all([
  tools.agent.spawn({ agentName: `a${ts}1`, message: "afmd" }),
  tools.agent.spawn({ agentName: `a${ts}2`, message: "afmd" }),
  tools.agent.spawn({ agentName: `a${ts}3`, message: "afmd" }),
  tools.agent.spawn({ agentName: `a${ts}4`, message: "afmd" })
]);
await tools.self.sleep({ seconds: 3 });
const result = await read_file("docs/agents-spawn-test-caveman.md");
```

---

## Résultats

[À compléter après exécution]

---

## Comparaison

| Métrique | Avant | Après (cible) | Réduction |
|----------|-------|----------------|-----------|
| Tokens | 27,000 | <500 | **98%** |
| Temps | ~2 min | <10s | **90%** |
| Messages | 200+ chars | 4 chars | **98%** |
| Spawns | 8 | 4 | **50%** |
