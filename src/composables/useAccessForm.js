/**
 * Composable de lógica reactiva del wizard de creación de acceso.
 *
 * Stack del proyecto: Vue 2 + @vue/composition-api.
 * IMPORTANTE: el proyecto usa Composition API a través de @vue/composition-api
 * (NO Vue 3). Por eso importamos desde '@vue/composition-api' y no desde 'vue'.
 *
 * Responsabilidades del composable:
 *   - Calcular los checks de fuerza de contraseña en tiempo real.
 *   - Aplicar debounce a la verificación de disponibilidad de username.
 *   - Exponer estados derivados (passwordsMatch, passwordIsValid).
 *
 * UX rationale:
 *   - Los checks granulares (longitud, mayúscula, número, especial) son más
 *     pedagógicos que un único mensaje "contraseña débil".
 *   - El debounce evita pegar al backend en cada tecla.
 */
import { computed, ref, watch } from '@vue/composition-api';
import { useAccessStore } from 'src/stores/accessStore';

const DEBOUNCE_USERNAME_MS = 600;

export function useAccessForm () {
  const store = useAccessStore();

  // ============== Checks de contraseña en tiempo real ==============
  const passwordChecks = computed(() => ({
    length:    (store.password || '').length >= 8,
    uppercase: /[A-Z]/.test(store.password || ''),
    number:    /[0-9]/.test(store.password || ''),
    special:   /[!@#$%^&*]/.test(store.password || '')
  }));

  const passwordIsValid = computed(() =>
    Object.values(passwordChecks.value).every(Boolean)
  );

  const passwordsMatch = computed(() => {
    if (!store.password && !store.passwordConfirm) return null; // sin opinión aún
    return store.password === store.passwordConfirm;
  });

  // ============== Debounce de check de username ==============
  let usernameDebounceTimer = null;

  function scheduleUsernameCheck () {
    if (usernameDebounceTimer) clearTimeout(usernameDebounceTimer);
    usernameDebounceTimer = setTimeout(() => {
      store.checkUsernameAvailability();
    }, DEBOUNCE_USERNAME_MS);
  }

  // Cuando el usuario edita el username, marcamos "indeterminado" y agendamos check.
  watch(() => store.username, (newVal, oldVal) => {
    if (newVal === oldVal) return;
    store.usernameAvailable = null;
    scheduleUsernameCheck();
  });

  // ============== Mostrar/ocultar contraseña ==============
  const showPassword = ref(false);
  const showPasswordConfirm = ref(false);

  function togglePassword () {
    showPassword.value = !showPassword.value;
  }
  function togglePasswordConfirm () {
    showPasswordConfirm.value = !showPasswordConfirm.value;
  }

  // ============== Lista pintable de checks (para el template) ==============
  const passwordChecksList = computed(() => ([
    { key: 'length',    label: 'Mínimo 8 caracteres',     ok: passwordChecks.value.length },
    { key: 'uppercase', label: 'Al menos 1 mayúscula',     ok: passwordChecks.value.uppercase },
    { key: 'number',    label: 'Al menos 1 número',         ok: passwordChecks.value.number },
    { key: 'special',   label: 'Al menos 1 carácter especial (!@#$%^&*)', ok: passwordChecks.value.special }
  ]));

  return {
    store,
    // Validación de contraseña
    passwordChecks,
    passwordChecksList,
    passwordIsValid,
    passwordsMatch,
    // Mostrar/ocultar
    showPassword,
    showPasswordConfirm,
    togglePassword,
    togglePasswordConfirm
  };
}
