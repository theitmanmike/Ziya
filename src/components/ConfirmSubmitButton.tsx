"use client";

export function ConfirmSubmitButton({
  message,
  className,
  children,
  formAction,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
  /** Aynı formu, üst formdan farklı bir server action'a göndermek için (HTML formAction). */
  formAction?: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <button
      type="submit"
      formAction={formAction}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
