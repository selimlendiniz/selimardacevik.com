// Bu proje pnpm ile kurulur. npm / yarn / bun ile kurulumu engeller.
// preinstall olarak calisir; pnpm icin sessizce gecer.
// npm_config_user_agent ornegi: "pnpm/11.25.0 npm/? node/v24.20.0 linux x64"
const ua = process.env.npm_config_user_agent ?? "";
const pm = ua.split("/")[0] || "bilinmiyor";

if (pm !== "pnpm") {
  console.error(`
  Bu proje pnpm kullanir — calistirilan: ${pm}

    pnpm install

  pnpm kurulu degilse:  mise use -g pnpm@11
`);
  process.exit(1);
}
