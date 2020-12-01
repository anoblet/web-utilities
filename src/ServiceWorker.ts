import { html } from "lit-element";
import { render } from "lit-html";

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
