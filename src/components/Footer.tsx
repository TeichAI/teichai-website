import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[var(--foreground)] font-medium">
              TeichAI
            </Link>
            <a
              href="https://huggingface.co/TeichAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors"
            >
              Hugging Face
            </a>
            <a
              href="https://paypal.me/TeichAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors"
            >
              Support Us
            </a>
          </div>

          <p className="text-[var(--muted-foreground)] text-sm">
            &copy; {new Date().getFullYear()} TeichAI
          </p>
        </div>
      </div>
    </footer>
  );
}
