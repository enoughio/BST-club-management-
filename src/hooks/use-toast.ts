export type ToastOptions = { title?: string; description?: string; variant?: "destructive" | "default" }

export function useToast() {
  function toast(options: ToastOptions) {
    // Lightweight placeholder: replace with UI toast implementation
    // eslint-disable-next-line no-console
    console.log("toast:", options.title, options.description, options.variant)
  }

  return { toast }
}
