<template>
  <section
    class="abastecimiento-welcome"
    :class="[
      { 'abastecimiento-welcome--visible': isVisible },
      `abastecimiento-welcome--${timeOfDay}`,
    ]"
    aria-label="Bienvenida al módulo de Abastecimiento"
  >
    <!-- Decorative SVG background — morning -->
    <svg
      v-if="timeOfDay === 'morning'"
      class="abastecimiento-welcome__scene"
      aria-hidden="true"
      viewBox="0 0 1120 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <!-- Sun -->
      <circle cx="920" cy="80" r="52" fill="#fde68a" opacity="0.55" />
      <circle cx="920" cy="80" r="36" fill="#fbbf24" opacity="0.4" />
      <!-- Sun rays -->
      <g stroke="#fbbf24" stroke-width="2" opacity="0.25" stroke-linecap="round">
        <line x1="920" y1="18" x2="920" y2="6" />
        <line x1="920" y1="142" x2="920" y2="154" />
        <line x1="858" y1="80" x2="846" y2="80" />
        <line x1="982" y1="80" x2="994" y2="80" />
        <line x1="876" y1="36" x2="868" y2="28" />
        <line x1="964" y1="124" x2="972" y2="132" />
        <line x1="876" y1="124" x2="868" y2="132" />
        <line x1="964" y1="36" x2="972" y2="28" />
      </g>
      <!-- Cloud 1 -->
      <g opacity="0.35">
        <ellipse cx="200" cy="60" rx="50" ry="20" fill="#e0f2fe" />
        <ellipse cx="230" cy="52" rx="35" ry="18" fill="#e0f2fe" />
        <ellipse cx="175" cy="55" rx="30" ry="14" fill="#e0f2fe" />
      </g>
      <!-- Cloud 2 -->
      <g opacity="0.25">
        <ellipse cx="680" cy="42" rx="40" ry="15" fill="#dbeafe" />
        <ellipse cx="705" cy="36" rx="28" ry="13" fill="#dbeafe" />
      </g>
      <!-- Gentle hills -->
      <path d="M0 260 Q280 200 560 240 Q840 280 1120 220 L1120 320 L0 320Z" fill="#f0fdf4" opacity="0.5" />
      <path d="M0 280 Q300 240 600 270 Q900 300 1120 250 L1120 320 L0 320Z" fill="#ecfdf5" opacity="0.4" />
    </svg>

    <!-- Decorative SVG background — afternoon -->
    <svg
      v-else-if="timeOfDay === 'afternoon'"
      class="abastecimiento-welcome__scene"
      aria-hidden="true"
      viewBox="0 0 1120 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <!-- Radiant sun -->
      <circle cx="960" cy="70" r="60" fill="#fcd34d" opacity="0.45" />
      <circle cx="960" cy="70" r="40" fill="#f59e0b" opacity="0.3" />
      <!-- Rays -->
      <g stroke="#f59e0b" stroke-width="2.5" opacity="0.18" stroke-linecap="round">
        <line x1="960" y1="2" x2="960" y2="18" />
        <line x1="960" y1="122" x2="960" y2="138" />
        <line x1="902" y1="70" x2="886" y2="70" />
        <line x1="1018" y1="70" x2="1034" y2="70" />
        <line x1="918" y1="28" x2="908" y2="18" />
        <line x1="1002" y1="112" x2="1012" y2="122" />
        <line x1="918" y1="112" x2="908" y2="122" />
        <line x1="1002" y1="28" x2="1012" y2="18" />
        <line x1="960" y1="2" x2="960" y2="18" />
        <line x1="890" y1="70" x2="874" y2="70" />
        <line x1="1030" y1="70" x2="1046" y2="70" />
      </g>
      <!-- Warm landscape -->
      <path d="M0 270 Q280 220 560 255 Q840 290 1120 230 L1120 320 L0 320Z" fill="#fef3c7" opacity="0.4" />
      <path d="M0 290 Q300 255 600 280 Q900 305 1120 260 L1120 320 L0 320Z" fill="#fef9ec" opacity="0.35" />
    </svg>

    <!-- Decorative SVG background — night -->
    <svg
      v-else
      class="abastecimiento-welcome__scene"
      aria-hidden="true"
      viewBox="0 0 1120 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <!-- Moon -->
      <circle cx="940" cy="70" r="32" fill="#c7d2fe" opacity="0.35" />
      <circle cx="952" cy="62" r="28" fill="#1e293b" opacity="0.6" />
      <!-- Stars -->
      <g fill="#e0e7ff" opacity="0.5">
        <circle cx="120" cy="35" r="1.5" />
        <circle cx="280" cy="55" r="1" />
        <circle cx="420" cy="25" r="1.5" />
        <circle cx="580" cy="48" r="1" />
        <circle cx="740" cy="30" r="1.5" />
        <circle cx="850" cy="58" r="1" />
        <circle cx="1050" cy="40" r="1.5" />
        <circle cx="180" cy="70" r="1" />
        <circle cx="500" cy="15" r="1" />
        <circle cx="660" cy="65" r="1.5" />
        <circle cx="350" cy="42" r="1" />
        <circle cx="1000" cy="22" r="1" />
      </g>
      <!-- Subtle twinkling stars (larger) -->
      <g fill="#c7d2fe" opacity="0.3">
        <circle cx="200" cy="28" r="2" />
        <circle cx="620" cy="20" r="2" />
        <circle cx="800" cy="50" r="2" />
        <circle cx="1080" cy="32" r="2" />
      </g>
      <!-- Distant hills silhouette -->
      <path d="M0 270 Q280 230 560 260 Q840 290 1120 240 L1120 320 L0 320Z" fill="#1e293b" opacity="0.3" />
      <path d="M0 290 Q300 260 600 285 Q900 310 1120 265 L1120 320 L0 320Z" fill="#0f172a" opacity="0.25" />
    </svg>

    <div class="abastecimiento-welcome__hero">
      <div
        class="abastecimiento-welcome__badge abastecimiento-welcome__animate"
        :style="{ animationDelay: '0.05s' }"
      >
        <q-icon name="local_shipping" size="18px" />
        <span>Módulo de Abastecimiento</span>
      </div>

      <h1
        class="abastecimiento-welcome__title abastecimiento-welcome__animate"
        :style="{ animationDelay: '0.15s' }"
      >
        {{ greeting }}, {{ displayName }}
      </h1>

      <p
        class="abastecimiento-welcome__subtitle abastecimiento-welcome__animate"
        :style="{ animationDelay: '0.25s' }"
      >
        Gestiona solicitudes, presupuestos, órdenes de compra y proveedores desde un
        solo lugar. Todo listo para que comiences.
      </p>

      <div
        class="abastecimiento-welcome__actions abastecimiento-welcome__animate"
        :style="{ animationDelay: '0.35s' }"
      >
        <q-btn
          unelevated
          no-caps
          icon="post_add"
          label="Nueva solicitud"
          class="abastecimiento-welcome__btn abastecimiento-welcome__btn--primary"
          :to="{ name: 'crear-solicitud-abastecimiento' }"
        />
        <q-btn
          outline
          no-caps
          icon="receipt_long"
          label="Ver solicitudes"
          class="abastecimiento-welcome__btn abastecimiento-welcome__btn--outline"
          :to="{ name: 'lista-solicitudes-abastecimiento' }"
        />
      </div>
    </div>

    <div class="abastecimiento-welcome__cards">
      <article
        v-for="(card, index) in quickLinks"
        :key="card.id"
        class="abastecimiento-welcome__card abastecimiento-welcome__animate"
        :style="{ animationDelay: `${0.45 + index * 0.1}s` }"
      >
        <div class="abastecimiento-welcome__card-icon">
          <q-icon :name="card.icon" size="26px" />
        </div>
        <h2 class="abastecimiento-welcome__card-title">{{ card.title }}</h2>
        <p class="abastecimiento-welcome__card-desc">{{ card.description }}</p>
        <router-link
          v-if="card.routeName"
          :to="{ name: card.routeName }"
          class="abastecimiento-welcome__card-link"
        >
          Ir ahora
          <q-icon name="arrow_forward" size="16px" />
        </router-link>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from "pinia";
import { useAuthStore } from "src/stores/authStore";

export default {
  name: "AbastecimientoWelcome",

  props: {
    timeOverride: {
      type: Number,
      default: null,
      validator: function (v) {
        return v === null || (v >= 0 && v <= 23);
      },
    },
  },

  data() {
    return {
      isVisible: false,
      currentHour: new Date().getHours(),
      _timer: null,
      quickLinks: [
        {
          id: "presupuesto",
          title: "Presupuestos",
          description: "Crea y administra planes de abastecimiento y sus rubros.",
          icon: "account_balance_wallet",
          routeName: "lista-planes-abastecimiento",
        },
        {
          id: "compras",
          title: "Órdenes de compra",
          description: "Registra transacciones y compara proveedores con facilidad.",
          icon: "shopping_cart",
          routeName: "gestion-orden-compra",
        },
        {
          id: "config",
          title: "Proveedores",
          description: "Mantén actualizado el catálogo de proveedores del módulo.",
          icon: "groups",
          routeName: "lista-proveedores-terceros",
        },
      ],
    };
  },

  computed: {
    ...mapState(useAuthStore, ["user"]),

    displayName() {
      if (this.user && this.user.fullName) {
        return this.user.fullName;
      }
      if (this.user && this.user.username) {
        return this.user.username;
      }
      return "Usuario";
    },

    hour() {
      return this.timeOverride !== null ? this.timeOverride : this.currentHour;
    },

    timeOfDay() {
      var h = this.hour;
      if (h >= 5 && h < 12) return "morning";
      if (h >= 12 && h < 19) return "afternoon";
      return "night";
    },

    greeting() {
      var h = this.hour;
      if (h >= 5 && h < 12) return "Buenos días";
      if (h >= 12 && h < 19) return "Buenas tardes";
      return "Buenas noches";
    },
  },

  mounted() {
    var self = this;
    requestAnimationFrame(function () {
      self.isVisible = true;
    });
    this._timer = setInterval(function () {
      self.currentHour = new Date().getHours();
    }, 60000);
  },

  beforeDestroy() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },
};
</script>

<style scoped>
/* ── Base ── */
.abastecimiento-welcome {
  --header-bg-start: #ffffff;
  --header-bg-end: #f8faf8;
  --header-text: #4a5a63;
  --header-text-sub: #6b7c85;
  --header-accent: #4e9c4c;
  --header-accent-hover: #3d7d3b;
  --header-badge-bg: rgba(255, 255, 255, 0.85);
  --header-badge-border: rgba(78, 156, 76, 0.18);
  --header-badge-text: #4a5a63;
  --header-btn-primary-bg: #4e9c4c;
  --header-btn-primary-text: #ffffff;
  --header-btn-outline-bg: rgba(255, 255, 255, 0.7);
  --header-btn-outline-border: #d1d5db;
  --header-btn-outline-text: #374151;
  --header-card-bg: rgba(255, 255, 255, 0.82);
  --header-card-border: rgba(232, 236, 239, 0.9);
  --header-card-shadow: 0 8px 32px rgba(74, 90, 99, 0.06);
  --header-card-hover-shadow: 0 16px 40px rgba(78, 156, 76, 0.12);
  --header-card-icon-bg: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
  --header-card-link: #4e9c4c;
  --header-card-link-hover: #3d7d3b;
  --header-title-gradient: linear-gradient(
    120deg,
    #84b24d 0%, #4e9c4c 18%, #14b8a6 38%,
    #afca0b 58%, #75af7e 78%, #2dd4bf 100%
  );

  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 4vw, 2rem);
  box-sizing: border-box;
  background: linear-gradient(160deg, var(--header-bg-start), var(--header-bg-end));
  border-radius: 16px;
  transition: background 500ms ease;
  position: relative;
  overflow: hidden;
}

/* ── SVG scene (decorative) ── */
.abastecimiento-welcome__scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 600ms ease;
}

.abastecimiento-welcome--visible .abastecimiento-welcome__scene {
  opacity: 1;
}

/* ── Morning ── */
.abastecimiento-welcome--morning {
  --header-bg-start: #fffdf5;
  --header-bg-end: #fef9ec;
  --header-text: #5c4a1e;
  --header-text-sub: #7a6b3d;
  --header-accent: #b8941f;
  --header-accent-hover: #9a7b18;
  --header-badge-bg: rgba(255, 253, 245, 0.9);
  --header-badge-border: rgba(184, 148, 31, 0.2);
  --header-badge-text: #6b5a20;
  --header-btn-primary-bg: #b8941f;
  --header-btn-primary-text: #ffffff;
  --header-btn-outline-bg: rgba(255, 253, 245, 0.8);
  --header-btn-outline-border: #d4c98a;
  --header-btn-outline-text: #5c4a1e;
  --header-card-bg: rgba(255, 253, 245, 0.88);
  --header-card-border: rgba(212, 201, 138, 0.5);
  --header-card-shadow: 0 8px 32px rgba(184, 148, 31, 0.08);
  --header-card-hover-shadow: 0 16px 40px rgba(184, 148, 31, 0.14);
  --header-card-icon-bg: linear-gradient(135deg, #d4a017 0%, #b8941f 50%, #9a7b18 100%);
  --header-card-link: #9a7b18;
  --header-card-link-hover: #7a6213;
  --header-title-gradient: linear-gradient(
    120deg,
    #b8941f 0%, #d4a017 25%, #c9960f 50%,
    #a88516 75%, #9a7b18 100%
  );
}

/* ── Afternoon (default brand) ── */
.abastecimiento-welcome--afternoon {
  --header-bg-start: #ffffff;
  --header-bg-end: #f8faf8;
  --header-text: #4a5a63;
  --header-text-sub: #6b7c85;
  --header-accent: #4e9c4c;
  --header-accent-hover: #3d7d3b;
  --header-badge-bg: rgba(255, 255, 255, 0.85);
  --header-badge-border: rgba(78, 156, 76, 0.18);
  --header-badge-text: #4a5a63;
  --header-btn-primary-bg: #4e9c4c;
  --header-btn-primary-text: #ffffff;
  --header-btn-outline-bg: rgba(255, 255, 255, 0.7);
  --header-btn-outline-border: #d1d5db;
  --header-btn-outline-text: #374151;
  --header-card-bg: rgba(255, 255, 255, 0.82);
  --header-card-border: rgba(232, 236, 239, 0.9);
  --header-card-shadow: 0 8px 32px rgba(74, 90, 99, 0.06);
  --header-card-hover-shadow: 0 16px 40px rgba(78, 156, 76, 0.12);
  --header-card-icon-bg: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
  --header-card-link: #4e9c4c;
  --header-card-link-hover: #3d7d3b;
  --header-title-gradient: linear-gradient(
    120deg,
    #84b24d 0%, #4e9c4c 18%, #14b8a6 38%,
    #afca0b 58%, #75af7e 78%, #2dd4bf 100%
  );
}

/* ── Night ── */
.abastecimiento-welcome--night {
  --header-bg-start: #0f172a;
  --header-bg-end: #1e293b;
  --header-text: #e2e8f0;
  --header-text-sub: #94a3b8;
  --header-accent: #818cf8;
  --header-accent-hover: #6366f1;
  --header-badge-bg: rgba(30, 41, 59, 0.85);
  --header-badge-border: rgba(129, 140, 248, 0.25);
  --header-badge-text: #c7d2fe;
  --header-btn-primary-bg: #818cf8;
  --header-btn-primary-text: #0f172a;
  --header-btn-outline-bg: rgba(30, 41, 59, 0.6);
  --header-btn-outline-border: #334155;
  --header-btn-outline-text: #cbd5e1;
  --header-card-bg: rgba(30, 41, 59, 0.75);
  --header-card-border: rgba(51, 65, 85, 0.7);
  --header-card-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  --header-card-hover-shadow: 0 16px 40px rgba(129, 140, 248, 0.15);
  --header-card-icon-bg: linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a78bfa 100%);
  --header-card-link: #a5b4fc;
  --header-card-link-hover: #c7d2fe;
  --header-title-gradient: linear-gradient(
    120deg,
    #818cf8 0%, #a78bfa 25%, #c084fc 50%,
    #818cf8 75%, #6366f1 100%
  );
}

/* ── Hero ── */
.abastecimiento-welcome__hero {
  text-align: center;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
  position: relative;
  z-index: 1;
}

.abastecimiento-welcome__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  margin-bottom: 1.25rem;
  border-radius: 999px;
  font-size: var(--text-sm, 0.875rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--header-badge-text);
  background: var(--header-badge-bg);
  border: 1px solid var(--header-badge-border);
  box-shadow: 0 4px 20px rgba(74, 90, 99, 0.06);
  transition: background 500ms ease, border-color 500ms ease, color 500ms ease;
}

.abastecimiento-welcome__title {
  margin: 0 0 1rem;
  font-family: var(--font-family-heading, "Poppins", sans-serif);
  font-size: clamp(2rem, 5vw + 0.5rem, 3.25rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;

  background: var(--header-title-gradient);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: gradient-shift 6s ease-in-out infinite alternate;
}

.abastecimiento-welcome__subtitle {
  margin: 0 auto 1.75rem;
  max-width: 36rem;
  font-size: clamp(0.95rem, 1.5vw + 0.5rem, 1.125rem);
  line-height: 1.65;
  color: var(--header-text-sub);
  transition: color 500ms ease;
}

.abastecimiento-welcome__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.abastecimiento-welcome__btn {
  min-width: 160px;
  font-weight: 600;
  border-radius: 10px;
  transition: background 500ms ease, color 500ms ease, border-color 500ms ease;
}

.abastecimiento-welcome__btn--primary {
  background: var(--header-btn-primary-bg) !important;
  color: var(--header-btn-primary-text) !important;
}

.abastecimiento-welcome__btn--outline {
  background: var(--header-btn-outline-bg);
  border-color: var(--header-btn-outline-border) !important;
  color: var(--header-btn-outline-text) !important;
}

/* ── Cards ── */
.abastecimiento-welcome__cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.abastecimiento-welcome__card {
  display: flex;
  flex-direction: column;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: 16px;
  background: var(--header-card-bg);
  border: 1px solid var(--header-card-border);
  box-shadow: var(--header-card-shadow);
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    background 500ms ease, border-color 500ms ease;
}

.abastecimiento-welcome__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--header-card-hover-shadow);
}

.abastecimiento-welcome__card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  border-radius: 12px;
  color: #ffffff;
  background: var(--header-card-icon-bg);
  box-shadow: 0 4px 14px rgba(78, 156, 76, 0.28);
  transition: background 500ms ease;
}

.abastecimiento-welcome__card-title {
  margin: 0 0 0.5rem;
  font-family: var(--font-family-heading, "Poppins", sans-serif);
  font-size: clamp(1rem, 2vw + 0.25rem, 1.2rem);
  font-weight: 600;
  color: var(--header-text);
  transition: color 500ms ease;
}

.abastecimiento-welcome__card-desc {
  flex: 1;
  margin: 0 0 1rem;
  font-size: var(--text-sm, 0.875rem);
  line-height: 1.6;
  color: var(--header-text-sub);
  transition: color 500ms ease;
}

.abastecimiento-welcome__card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--header-card-link);
  text-decoration: none;
  transition: gap 0.2s ease, color 500ms ease;
}

.abastecimiento-welcome__card-link:hover {
  gap: 0.55rem;
  color: var(--header-card-link-hover);
}

/* ── Entrance animation ── */
.abastecimiento-welcome__animate {
  opacity: 0;
  transform: translateY(28px);
}

.abastecimiento-welcome--visible .abastecimiento-welcome__animate {
  animation: fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient-shift {
  from {
    background-position: 0% center;
  }
  to {
    background-position: 100% center;
  }
}

/* ── Responsive ── */
@media (min-width: 600px) {
  .abastecimiento-welcome__cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .abastecimiento-welcome__hero {
    text-align: left;
  }

  .abastecimiento-welcome__subtitle {
    margin-left: 0;
    margin-right: 0;
  }

  .abastecimiento-welcome__actions {
    justify-content: flex-start;
  }

  .abastecimiento-welcome__cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .abastecimiento-welcome__animate {
    opacity: 1;
    transform: none;
    animation: none !important;
  }

  .abastecimiento-welcome__title {
    animation: none;
    background-size: 100% auto;
  }
}
</style>
