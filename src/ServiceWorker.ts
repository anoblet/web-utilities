import { html } from "lit-element";
import { render } from "lit-html";

export const install = ({ source }: { source: string }) => {
  if (location.hostname !== "localhost") {
    let updateRequested = false;
    registerServiceWorker({
      installed: (event) => {
        if (event.isUpdate) {
          if (!updateRequested) showUpdateSnackbar();
          updateRequested = true;
        }
      },
      message: (event) => {
        if (event.data.meta === "workbox-broadcast-update") {
          if (!updateRequested) showUpdateSnackbar();
          updateRequested = true;
        }
      },
      source,
    });
  }
};

export const registerServiceWorker = ({
  installed,
  message,
  source,
}: {
  installed?: (event) => any;
  message?: (event) => any;
  source: string;
}) => {
  import("workbox-window").then(({ Workbox }) => {
    if ("serviceWorker" in navigator) {
      const workbox = new Workbox(source);
      if (installed) workbox.addEventListener("installed", installed);
      if (message) workbox.addEventListener("message", message);
      workbox.register();
    }
  });
};

export const showUpdateSnackbar = async () => {
  await import("@material/mwc-snackbar");
  await import("@material/mwc-button");

  const snackbar = html`
    <mwc-snackbar labelText="Application has been updated">
      <mwc-button slot="action" @click=${reload}>Reload</mwc-button>
    </mwc-snackbar>
  `;

  const el = document.createElement("div");
  document.body.appendChild(el);
  render(snackbar, el);
  el.querySelector("mwc-snackbar").open = true;
};

const reload = () => {
  window.location.reload();
  return false;
};

const snackbar = async () => {
  await import("@material/mwc-snackbar");
  await import("@material/mwc-button");

  const snackbar = html`
    <mwc-snackbar labelText="Application has been updated">
      <mwc-button slot="action" @click=${reload}>Reload</mwc-button>
    </mwc-snackbar>
  `;

  const el = document.createElement("div");
  document.body.appendChild(el);
  render(snackbar, el);
  el.querySelector("mwc-snackbar").open = true;
};

export class ServiceWorker {
  private installedCallback: () => void = snackbar;
  private local: boolean = false;
  private messageCallback: () => void = snackbar;
  private source: string;

  constructor(properties: { source: string }) {
    Object.assign(this, properties);

    this.register();
  }

  register() {
    // Make sure we are not running locally
    if (!this.local && location.hostname === "localhost") return;

    // Make sure the browser supports a service worker
    if (!("serviceWorker" in navigator)) return;

    import("workbox-window").then(({ Workbox }) => {
      const workbox = new Workbox(this.source);
      this.installedCallback &&
        workbox.addEventListener(
          "installed",
          (event) => event.isUpdate && this.installedCallback()
        );
      this.messageCallback &&
        workbox.addEventListener(
          "message",
          (event) =>
            event.data.meta === "workbox-broadcast-update" &&
            this.messageCallback()
        );
      workbox.register();
    });
  }
}
