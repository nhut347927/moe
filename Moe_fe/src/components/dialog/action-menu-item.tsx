import type { ReactNode, ButtonHTMLAttributes } from "react"
import { cn } from "@/common/utils/utils"

interface ActionMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Icon hiển thị bên trái
   */
  icon?: ReactNode
  /**
   * Nội dung của item
   */
  children: ReactNode
  /**
   * Màu sắc của item (mặc định, nguy hiểm, thành công)
   */
  variant?: "default" | "destructive" | "success"
  /**
   * Lớp CSS tùy chỉnh
   */
  className?: string
}

export function ActionMenuItem({ icon, children, variant = "default", className, ...props }: ActionMenuItemProps) {
  const variantClasses = {
    default: "hover:bg-muted",
    destructive: "text-destructive hover:bg-destructive/10",
    success: "text-green-600 hover:bg-green-50",
  }

  return (
    <button
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm rounded-xl transition-colors",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}

