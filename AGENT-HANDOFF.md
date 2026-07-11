# Papiletics — Handoff para agente (sin contexto previo)

> **Última actualización:** 11 julio 2026  
> **Usuario:** Jorge (jfosela81) — le llama "entrenador" al agente, tono cercano pero técnico. **Responder siempre en español.**

Este documento permite continuar el coaching nutricional/de fitness y mantener la app Astro sin leer conversaciones anteriores.

---

## 1. Qué es este proyecto

**Papiletics** es un sitio estático (Astro) mobile-first con el plan personal de recomposición corporal de Jorge y el tracking diario de calorías/proteína de Jorge y su mujer Manza.

| Recurso | URL / ruta |
|---|---|
| App desplegada | https://papiletics.vercel.app |
| Repo GitHub | https://github.com/jfosela81/papiletics |
| Plan Jorge | `/` (index) |
| Tracking Manza | `/manza` |

**Stack:** Astro (output static), JSON para datos, Vercel auto-deploy en push a `main`. Sin BD, sin login.

---

## 2. Rol del agente

Jorge NO usa MyFitnessPal. Te describe comidas a ojo (a veces con báscula en casa). Tú:

1. **Estimas kcal y proteína** con tablas razonables y sus recetas habituales.
2. **Das consejo** (qué cenar, cómo compensar, BK, findes, etc.).
3. **Actualizas los JSON** de tracking al cierre del día (o cuando pida "registra").
4. **Commit + push** a `main` para que se vea en la app (Vercel despliega solo).

**Principios nutricionales acordados:**
- Déficit **suave** (~300–400 kcal/día), no agresivo — evitar poner al cuerpo "en alerta".
- **Mínimo absoluto Jorge:** 1.700 kcal/día (ideal ~2.000).
- **Mínimo absoluto Manza:** 1.200 kcal/día (objetivo ~1.350).
- Findes en casa de madre/suegra = imposible pesar; estrategia de **calorie banking** (compensar lun–mar post-finde o jue–vie pre-finde).
- En casa familiar: si no hay hambre, **whey 30g + agua** (~110 kcal) para cubrir proteína sin forzar calorías.

---

## 3. Perfiles

### Jorge

| Dato | Valor |
|---|---|
| Edad / altura | 45 años · 1,85 m |
| Peso actual | 86 kg → objetivo 80 kg |
| Cintura | 97–98 cm |
| BMR | ~1.796 kcal |
| **TDEE** | **~2.400 kcal** (actividad ligera-moderada) |
| **Objetivo ingesta** | **~2.000 kcal/día** |
| **Proteína objetivo** | **160–175 g/día** (2 g/kg) |
| Actividad | Calistenia 3×/sem verano (sin karate hasta sept), escaleras, caminar |
| IF | 16/8 natural — no romper |
| Suplementos | Creatina 3–5 g, whey 20–30 g |

**Colores diario (kcal):** &lt;1.700 naranja · 1.700–2.100 verde · &gt;2.100 amarillo

### Manza (mujer de Jorge, apodo cariñoso)

| Dato | Valor |
|---|---|
| Edad / altura | 44 años · 1,64 m |
| Peso | 63 kg |
| BMR | ~1.274 kcal |
| **TDEE** | **~1.656 kcal** |
| **Objetivo ingesta** | **~1.350 kcal/día** |
| **Proteína objetivo** | **100–120 g/día** |
| Actividad | Baja — Pilates 2×/sem, ~5K pasos. **NO contar ejercicio en el tracking.** |

Jorge transcribe lo que Manza come; ella no habla con el agente directamente.

**Colores diario Manza:** &lt;1.200 rojo · 1.200–1.450 verde · &gt;1.450 amarillo

---

## 4. Archivos clave

```
papiletics/
├── AGENT-HANDOFF.md          ← este archivo
├── src/
│   ├── content/
│   │   ├── tracking.json     ← diario Jorge (añadir entradas nuevas AL PRINCIPIO del array)
│   │   └── tracking-manza.json
│   ├── components/
│   │   └── WeeklyChart.astro ← gráfica balance semanal
│   ├── utils/
│   │   └── weeklyBalance.ts  ← agregación semanal
│   ├── pages/
│   │   ├── index.astro       ← plan completo + seguimiento Jorge
│   │   └── manza.astro       ← perfil + tracking Manza
│   └── layouts/Layout.astro
├── astro.config.mjs
└── vercel.json
```

### Formato JSON de tracking

```json
{
  "fecha": "2026-07-11",
  "kcal": 1678,
  "proteina": 113,
  "entreno": "Warmup 5' · 54 pushups · 5×5 pike pushups",
  "notas": "Descripción breve de comidas del día"
}
```

- **Jorge:** campo `entreno` opcional (Manza no lo usa).
- Fecha ISO: `YYYY-MM-DD`.
- Entrada más reciente **primera** en el array.
- Tras actualizar: `git add`, `commit`, `push origin main`.

---

## 5. Gráfica semanal (ya implementada)

En **Seguimiento** (Jorge) y **Diario** (Manza):

| Días registrados | Comportamiento |
|---|---|
| &lt; 7 | Placeholder: "faltan X días" |
| 7–13 | Vista previa con barras |
| ≥ 14 | Gráfica completa |

**Fórmula por semana (lun–dom):**
```
balance = (TDEE × días_registrados) − Σ kcal
```
- Balance **positivo** → déficit (barra verde arriba, etiqueta `−X`)
- Balance **negativo** → superávit (barra ámbar abajo, etiqueta `+X`)
- Semanas incompletas (&lt;7 días o semana en curso): opacidad 50% + asterisco

TDEE en gráfica: Jorge 2400, Manza 1656.

---

## 6. Plan nutricional Jorge (resumen operativo)

### Estructura L–V
- **Pre-comida:** whey 30g + agua (saciedad).
- **Comida:** tupper fijo ~600 kcal / 49g prot O variantes (tortilla, ensaladas, etc.).
- **Merienda:** yogur griego 125g + leche 100–150ml + whey 30g + arándanos/banana.
- **Cena:** rotativa ~480 kcal (sándwich atún, ensalada sandía, lechuga+atún+huevo, etc.).

### Recetas habituales (calibradas con Jorge)

**Tortilla de patatas (su receta):**
- Come **media tortilla** ≈ 300g patata cocida + ~1,5 huevos + 1 clara
- **~375 kcal · ~19g prot** (NO usar cifras genéricas de tortilla frita entera)

**Priñaca:** tomate ~200g, cebolla ~50g, pimiento verde+rojo, queso Burgos ~250g, atún, aliño aceite/vinagre. Jorge suele comer 2/3 del batch.

**Pisto (batch típico):** cebolla, 2 calabacines ~850g, 6 pimientos italianos, 400ml tomate, cucharita aceite → **~30 kcal/100g** cocido.

**Bowl merienda estándar:** yogur 125–130g + leche 100–150ml + whey 30g + arándanos 50g ≈ **~300 kcal · ~40g prot**

**Sándwich pavo+queso cierre:** 4 lonchas pavo + 1 queso tierno + 2 rebanadas pan ≈ **~280 kcal · ~25g prot**

**Salsa fit yogur:** yogur griego + mostaza + mayonesa ligera (236 kcal/100g) + sal/limón/ajo.

### Cenas ligeras — regla importante
Si cena ensalada/tortilla sin llegar a 2.000 kcal, **subir con:** sandía, yogur extra, sándwich pavo+queso, pan 50g. **No bajar de 1.700.**

### Fines de semana
- Comidas en casa madre/suegra: no se puede pesar.
- Estrategia: whey si no hay hambre; no forzar cena.
- **Banking:** −500 kcal jue–vie O compensar lun–mar post-finde. Finde +1.000 kcal superávit sigue siendo déficit semanal si L–V bien hecho.

### Comer fuera (referencias)
- **BK Jorge:** 2 Crispy Chicken sin patatas ≈ 860 kcal · 48g prot. Evitar patatas. Zero azúcar ok.
- **BK Manza:** suele pedir menú Whopper → ~1.020 kcal con patatas.

---

## 7. Plan entrenamiento (verano 2026 — sin karate)

**Objetivo:** 3 sesiones/semana (L–M–V mañanas). Realista, no exigir 5.

**Sesión tipo (L/M/V):**
1. Warmup Family Calisthenics 5 min
2. Pushups (progresión; ha hecho hasta 100 en series)
3. **Pull-ups PRIORIDAD:** serie 1 parar 1–2 reps antes del fallo; series 2–5 al fallo, descanso 90s. En vacaciones sin barra: omitir pull-ups.
4. Pike pushups 5×5
5. HIIT corto cuando toca

**En casa:** barra dominadas (chin/pull). En Lanzarote/agosto: probablemente sin barra.

**Martes/jueves verano:** días activos opcionales (fuerza sin HIIT, escaleras, parque).

---

## 8. Tracking acumulado (al 11 jul 2026)

### Jorge (`tracking.json`) — 6 días

| Fecha | Kcal | Prot | Notas clave |
|---|---|---|---|
| 2026-07-11 | 1678 | 113 | BK 2 Crispy + cena pisto 260g + bowl |
| 2026-07-10 | 1945 | 133 | Pisto + salmón + nachos + sándwich |
| 2026-07-09 | 1839 | 154 | Garbanzos + cena bowl + sándwich pavo |
| 2026-07-08 | 2237 | 121 | Burger food truck |
| 2026-07-07 | 1917 | 163 | Fideos pollo + priñaca |
| 2026-07-06 | 1490 | 134 | Partido España, día bajo en kcal |

### Manza (`tracking-manza.json`) — 3 días

| Fecha | Kcal | Prot |
|---|---|---|
| 2026-07-11 | 1715 | 65 |
| 2026-07-10 | 1576 | 88 |
| 2026-07-09 | 1166 | 58 |

---

## 9. Calendario / vacaciones

| Periodo | Situación |
|---|---|
| **4–11 agosto 2026** | Jorge en **Lanzarote**. Sin báscula. **Sí portátil** — puede seguir registrando comidas en chat. Peso al volver. |
| Septiembre 2026 | Vuelve karate (martes/jueves moderado). Revisar plan entrenamiento. |

---

## 10. Workflow típico en chat

```
Usuario: "He comido X, Y, Z. Para cenar tengo A o B?"
Agente:
  1. Calcula kcal/prot del día parcial
  2. Recomienda cena según objetivo (1.700–2.000 Jorge)
  3. Usuario confirma cena
  4. Agente actualiza tracking.json (+ tracking-manza.json si aplica)
  5. git commit + push
  6. Resumen cierre con semáforo 🟢🟡🔴
```

**Estimaciones:** Jorge prefiere honestidad. Si no hay báscula, estima conservador con sus referencias habituales. Cuando dé pesos exactos, úsalos.

---

## 11. Comandos útiles

```bash
# Clonar / actualizar en otro portátil
git clone https://github.com/jfosela81/papiletics.git
cd papiletics && git pull origin main

# Dev local
npm install && npm run dev

# Tras editar tracking
git add src/content/tracking.json src/content/tracking-manza.json
git commit -m "tracking: DD mes — resumen breve"
git push origin main
```

**Credenciales:** GitHub usuario `jfosela81`. Vercel conectado al repo — no hace falta redeploy manual.

---

## 12. Prompt sugerido para nueva conversación (Lanzarote)

Copia y pega esto al abrir Cursor en el otro portátil:

```
Soy Jorge. Estoy continuando el proyecto papiletics (repo jfosela81/papiletics).
Lee AGENT-HANDOFF.md en la raíz del repo — ahí está todo el contexto.
Tu rol: entrenador nutricional/de fitness. Respondes en español.
Hoy he comido: [DESCRIBIR]
Actividad: [DESCRIBIR o "sin entreno"]
Manza ha comido: [DESCRIBIR o "nada que registrar"]
Al cerrar el día, actualiza tracking.json y tracking-manza.json, commit y push.
```

---

## 13. Ideas futuras (NO implementar salvo que Jorge pida)

- Gráfica de peso semanal (cuando haya datos de lunes)
- Gráfica proteína media semanal
- Input de comidas desde la web (ahora es JSON manual vía agente)
- Cinta de correr plegable con inclinación (~200€, esperando BF/Wallapop)

---

## 14. Lo que Jorge valora

- No sermones — datos, opciones, y decisión clara.
- Recordar mínimo 1.700 kcal cuando el día va bajo.
- Findes son inevitables — enfoque semanal, no perfeccionismo diario.
- Proteína alta = menos picos de hambre brutales (él lo ha notado).
- La app es consulta rápida en móvil; el coaching es en el chat.
