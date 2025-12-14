import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-background/95 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="font-semibold tracking-tight text-foreground">
              TeichAI
            </Link>
            <a
              href="https://huggingface.co/TeichAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Hugging Face
            </a>
            <a
              href="https://paypal.me/TeichAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Support Us
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TeichAI
          </p>
        </div>
      </div>
    </footer>
  );
}
