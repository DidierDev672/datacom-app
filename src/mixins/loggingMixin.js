import { notifySessionExpired } from "src/utils/sessionExpiredHandler";

export const loggingMixin = {
  methods: {
    log(eventName, level, data) {
      var logLevel = level || "info";
      var logData = data || {};
      var logEntry = {
        timestamp: new Date().toISOString(),
        component: this.$options.name || "UnknownComponent",
        method: eventName,
        level: logLevel,
        userId: localStorage.getItem("userId") || "unknown",
        rubroId: this.rubroId || "unknown",
        payload: logData,
        sessionId: this.getSessionId(),
      };

      if (logLevel === "error") {
        console.error("[loggingMixin]", eventName, logEntry);
      } else if (logLevel === "warn") {
        console.warn("[loggingMixin]", eventName, logEntry);
      } else {
        console.info("[loggingMixin]", eventName, logEntry);
      }

      return logEntry;
    },

    getSessionId() {
      if (!window.__session_id__) {
        window.__session_id__ =
          "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      }
      return window.__session_id__;
    },

    measureExecutionTime(operationName, fn) {
      var startTime = performance.now();
      var result = fn();
      var endTime = performance.now();
      var durationMs = Math.round(endTime - startTime);

      this.log("OPERATION_TIME", "info", {
        operation: operationName,
        durationMs: durationMs,
        result: result instanceof Promise ? "Promise" : typeof result,
      });

      return result;
    },

    handleSessionExpired(source) {
      this.log("SESSION_EXPIRED_DETECTED", "warn", {
        source: source || this.$options.name || "UnknownComponent",
      });

      notifySessionExpired({
        source: source || this.$options.name || "UnknownComponent",
      });
    },
  },
};
