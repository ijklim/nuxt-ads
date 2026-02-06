import type { IConfigProvider } from "../../application/ports/IConfigProvider";

export class NuxtConfigProvider implements IConfigProvider {
  getAdsServerUrl(): string {
    const config = useRuntimeConfig();
    return (config.public.adsServer as string) || '';
  }

  getAdClient(): string {
    const config = useRuntimeConfig();
    return (config.public.adClient as string) || '';
  }
}
