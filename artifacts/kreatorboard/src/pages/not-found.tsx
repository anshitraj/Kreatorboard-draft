import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-display font-bold glow-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-6">Page not found</h2>
        <p className="text-muted-foreground mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-bold">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
