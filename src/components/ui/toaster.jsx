import { useToast } from "@/components/ui/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";


const variantStyles = {
  default: "bg-white border-gray-200 text-gray-900",
  destructive: "bg-red-50 border-red-500 text-red-900", // Rojo (Errores)
  success: "bg-green-50 border-green-500 text-green-900",  // Verde (Éxito)
  info: "bg-blue-50 border-blue-500 text-blue-900",        // Azul (Información)
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map(({ id, title, description, variant = "default", open }) => {
        if (!open) return null

        const estiloAplicado = variantStyles[variant] || variantStyles.default

        return (
          <div
            key={id}
            className={`relative p-4 rounded-lg border shadow-lg text-sm transition-all duration-300 ${estiloAplicado}`}
          >
            {title && <h5 className="font-bold mb-1">{title}</h5>}
            {description && <div className="opacity-90">{description}</div>}
            
            <button 
              onClick={() => dismiss(id)} 
              className="absolute top-2 right-2 opacity-50 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}