<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="fondo-nav">
      <q-toolbar class="constrain">
        <q-btn
          class="q-mr-sm v-step-0"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-input filled placeholder="Buscar" class="q-ml-md nav-search">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <!-- <nav-bar-user /> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      class="bg-sidebar"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
    >
      <div class="logo-area">
        <img width="80px" src="/icons/app-icon.png" alt="Logo" />
      </div>
      <div class="search-area q-px-md q-pb-md">
        <q-input
          v-model="searchQuery"
          dense
          filled
          placeholder="Buscar en el menú..."
          class="sidebar-search"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" size="18px" color="#64748B" />
          </template>
        </q-input>
      </div>

      <q-list class="menu-scroll q-pt-sm q-pb-md">
        <template v-for="(link, index) in filteredLinks">
          <!-- Section Header -->
          <q-item-label
            v-if="link.sectionHeader"
            header
            class="sidebar-section"
            :key="'header-' + index"
          >
            {{ link.sectionHeader }}
          </q-item-label>

          <q-expansion-item
            v-if="link.children"
            :key="link.title"
            :icon="link.icon"
            :label="link.title"
            :caption="link.caption"
            :value="searchQuery ? true : undefined"
            class="sidebar-expansion-item"
          >
            <EssentialLink
              v-for="sublink in link.children"
              :key="sublink.title"
              v-bind="sublink"
            />
          </q-expansion-item>
          <EssentialLink v-else :key="link.title" v-bind="link" />
        </template>
        <q-separator class="q-my-md" />
        <q-item clickable v-ripple @click="logout" class="btn-final">
          <q-item-section avatar class="sidebar-icon-section">
            <q-icon name="logout" class="sidebar-icon" size="18px" />
          </q-item-section>

          <q-item-section class="sidebar-item-label text-weight-bold"
            >Cerrar sesión</q-item-section
          >
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <keep-alive :include="['PageCategorias']">
        <router-view />
      </keep-alive>
    </q-page-container>
    <!-- <tour></tour> -->
  </q-layout>
</template>

<script>
import { mapActions } from "vuex";
import EssentialLink from "components/EssentialLink";

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
export default {
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  data() {
    return {
      searchQuery: "",
      showAppInstallBanner: false,
      leftDrawerOpen: false,
      essentialLinks: [
        {
          sectionHeader: "Gestión General",
          title: "Inicio",
          caption: "",
          icon: "ti-home",
          link: "/",
        },
        {
          title: "Encuestas",
          caption: "",
          icon: "ti-bar-chart-alt",
          link: "/encuestas",
        },
        {
          title: "Municipios",
          caption: "",
          icon: "ti-map-alt",
          link: "/app/municipios",
        },
        {
          title: "Comunidades",
          caption: "",
          icon: "ti-location-pin",
          link: "/app/comunidad",
        },
        {
          title: "Viviendas",
          caption: "",
          icon: "ti-home",
          link: "/app/vivienda",
        },
        {
          title: "Jac",
          caption: "",
          icon: "ti-view-list",
          link: "/jac",
        },
        {
          title: "Icos",
          caption: "",
          icon: "ti-pencil-alt",
          link: "/icos",
        },
        {
          title: "Planes de Trabajo",
          caption: "",
          icon: "ti-bar-chart-alt",
          link: "/plan-trabajo",
        },
        {
          sectionHeader: "Abastecimiento",
          title: "Abastecimiento",
          caption: "",
          icon: "ti-layout-grid2",
          link: "/abastecimiento",
        },
        {
          sectionHeader: "Sistema",
          title: "Parametrización",
          caption: "",
          icon: "ti-settings",
          link: "/parametrizacion",
        },
        {
          title: "Reportes",
          caption: "",
          icon: "ti-export",
          link: "/reporte",
        },
      ],
    };
  },
  computed: {
    filteredLinks() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) return this.essentialLinks;

      const results = [];
      let lastSection = null;

      this.essentialLinks.forEach((link) => {
        // Determine the section this item belongs to
        if (link.sectionHeader) lastSection = link.sectionHeader;

        const matchesTitle =
          link.title && link.title.toLowerCase().includes(query);
        let filteredChildren = [];
        if (link.children) {
          filteredChildren = link.children.filter((child) =>
            child.title.toLowerCase().includes(query)
          );
        }

        if (matchesTitle || filteredChildren.length > 0) {
          results.push({
            ...link,
            _tempSection: lastSection,
            children: link.children ? filteredChildren : undefined,
          });
        }
      });

      // Re-apply section headers to the first visible item in each section
      let currentHeader = null;
      return results.map((link) => {
        const item = { ...link };
        if (link._tempSection !== currentHeader) {
          item.sectionHeader = link._tempSection;
          currentHeader = link._tempSection;
        } else {
          delete item.sectionHeader;
        }
        return item;
      });
    },
  },
  methods: {
    ...mapActions("auth", ["logoutAction"]),
    logout() {
      this.logoutAction();
    },
    installApp() {
      this.showAppInstallBanner = false;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User acepted install");
          this.neverShowAppInstallBanner();
        } else {
          console.log("User dismissed install");
        }
      });
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set("neverShowInstallBanner", true);
    },
  },
  mounted() {
    const neverShowAppInstallBanner = this.$q.localStorage.getItem(
      "neverShowInstallBanner"
    );
    if (!neverShowAppInstallBanner) {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        this.showAppInstallBanner = true;
      });
    }
  },
};
</script>
<style lang="scss">
.WAL__layout {
  margin: 0 auto;
  z-index: 4000;
  height: 100%;
  width: 90%;
  max-width: 950px;
  border-radius: 5px;
}

/* 1. Sidebar Background and Layout */
.bg-sidebar {
  display: flex !important;
  flex-direction: column;
}

/* 2. Scroll and Sticky Areas */
.logo-area {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 24px 16px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-area {
  position: sticky;
  top: 80px; /* Adjust based on logo-area height approx */
  z-index: 9;
  padding-bottom: 12px;
}

.menu-scroll {
  overflow-y: auto;
  flex-grow: 1;
}

/* 3. Search Input Restyling */
.sidebar-search {
  .q-field__control {
    background-color: #e2e8f0 !important;
    border-radius: 8px !important;
    &:before,
    &:after {
      display: none;
    }
  }
  .q-field__native {
    font-size: 13px;
    color: #1e293b;
  }
}

/* 4. Section Headers (Nivel 1) */
.sidebar-section {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8 !important;
  text-transform: uppercase;
  margin-top: 20px;
  margin-bottom: 8px;
  padding-left: 20px;
  letter-spacing: 0.5px;
  line-height: normal;
  min-height: auto;
}

/* 5. Main Items & Dropdowns Base (Nivel 2) */
.sidebar-item,
.sidebar-expansion-item {
  margin: 2px 12px;
  border-radius: 8px;
  color: #1e293b;
  transition: all 0.2s ease;
}

.sidebar-item {
  padding: 10px 14px;
  min-height: auto;

  &:hover {
    background-color: #e2e8f0;
  }

  &--active {
    background-color: #dbeafe !important;
    color: #1d4ed8 !important;

    .sidebar-icon,
    .sidebar-item-label {
      color: #1d4ed8 !important;
    }
  }
}

/* Main Item Text and Icon */
.sidebar-item-label {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: inherit;
}

.sidebar-icon {
  color: #64748b;
  transition: color 0.2s ease;
}
.sidebar-item:hover .sidebar-icon {
  color: #1e293b;
}

/* 6. Expansion Item specifics */
.sidebar-expansion-item {
  .q-item {
    border-radius: 8px;
    padding: 10px 14px;
    min-height: auto;

    &:hover {
      background-color: #e2e8f0;
    }
  }

  .q-item__label {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: #1e293b;
  }

  .q-item__section--side {
    color: #64748b;
  }
}

/* 7. Dropdown Subitems (Nivel 3) */
.sidebar-expansion-item .q-expansion-item__content {
  .sidebar-item {
    padding: 8px 14px 8px 42px; /* 28px left padding + 14px normal */
    margin-top: 2px;
    margin-bottom: 2px;

    .sidebar-item-label {
      font-size: 13px;
      font-weight: 400;
      line-height: 1.5;
      color: #64748b;
    }

    .sidebar-icon {
      color: #94a3b8; /* Even softer for subitem icons */
    }

    &:hover {
      .sidebar-item-label,
      .sidebar-icon {
        color: #1e293b;
      }
    }

    &--active {
      background-color: transparent !important;

      .sidebar-item-label {
        color: #1d4ed8 !important;
        font-weight: 500;
      }
      .sidebar-icon {
        color: #1d4ed8 !important;
      }
    }
  }
}

/* 8. Botón Final */
.btn-final {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  padding: 10px 14px;
  margin: 4px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: auto;

  &:hover {
    background-color: #e2e8f0;
    color: #1e293b;

    .sidebar-icon,
    .sidebar-item-label {
      color: #1e293b;
    }
  }

  .sidebar-item-label {
    color: #64748b;
  }
}

/* General Layout adjustments */
.q-separator {
  background-color: rgba(0, 0, 0, 0.05);
}

.q-toolbar {
  @media (min-width: 600px) {
    height: 77px;
  }
}

.q-toolbar__title {
  font-size: 30px;
  @media (max-width: 599px) {
    text-align: center;
  }
}

.nav-search {
  .q-field__control {
    background-color: rgba(0, 0, 0, 0.04) !important;
    border-radius: 8px !important;
    &:before,
    &:after {
      display: none;
    }
  }
  .q-field__native {
    color: #1e293b;
  }
}

/* Sidebar Icon Section adjustment */
.sidebar-icon-section {
  min-width: 32px;
  padding-right: 8px;
}
</style>
