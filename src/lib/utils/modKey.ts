export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPhone|iPad|iPod/.test(`${navigator.platform} ${navigator.userAgent}`)
}

/** Label for the command-palette shortcut (⌘K on Apple, Ctrl+K elsewhere). */
export function commandPaletteShortcutLabel(apple = isApplePlatform()): string {
  return apple ? '⌘K' : 'Ctrl+K'
}
