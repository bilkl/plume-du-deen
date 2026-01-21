import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home, Bug } from "lucide-react";
import { Component, ReactNode, ErrorInfo } from "react";
import { Link } from "wouter";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console and analytics
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Store error details for debugging
    this.setState({ errorInfo });

    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: sendErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      // Max retries reached, reload the page
      window.location.reload();
    }
  };

  handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <h2 className="text-xl font-semibold mb-2 text-center">
              Une erreur inattendue s'est produite
            </h2>

            <p className="text-muted-foreground text-center mb-6">
              Nous nous excusons pour la gêne occasionnée. Vous pouvez essayer de recharger la page ou retourner à l'accueil.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="p-4 w-full rounded bg-muted overflow-auto mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Bug size={16} className="text-destructive" />
                  <span className="text-sm font-medium">Détails de l'erreur (mode développement)</span>
                </div>
                <pre className="text-sm text-muted-foreground whitespace-break-spaces">
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-sm cursor-pointer text-muted-foreground">
                      Informations supplémentaires
                    </summary>
                    <pre className="text-xs mt-2 whitespace-break-spaces">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button
                onClick={this.handleRetry}
                disabled={this.state.retryCount >= this.maxRetries}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2 rounded-lg flex-1",
                  "bg-primary text-primary-foreground",
                  "hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <RotateCcw size={16} />
                {this.state.retryCount >= this.maxRetries ? 'Recharger' : 'Réessayer'}
              </button>

              <Link href="/" onClick={this.handleGoHome}>
                <button className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2 rounded-lg flex-1",
                  "bg-secondary text-secondary-foreground border border-border",
                  "hover:bg-secondary/80 cursor-pointer"
                )}>
                  <Home size={16} />
                  Accueil
                </button>
              </Link>
            </div>

            {this.state.retryCount > 0 && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Tentatives de récupération : {this.state.retryCount}/{this.maxRetries}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
