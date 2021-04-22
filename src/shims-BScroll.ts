/* eslint-disable */
import BScroll from '@better-scroll/core'

export type MyPluginOptions = Partial<MyPluginConfig> | true

type MyPluginConfig = {
  scrollText: string,
  scrollEndText: string
}

interface PluginAPI {
  printScrollText(): void
}

declare module '@better-scroll/core' {
  interface CustomOptions {
    myPlugin?: MyPluginOptions
  }

  interface CustomAPI {
    myPlugin: PluginAPI
  }
}