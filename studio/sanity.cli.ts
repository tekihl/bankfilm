import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'o58qfqk2',
    dataset: 'production'
  },
  deployment: {
    appId: 'oo8e2adsxjvnz6iejq8f5m3z',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
