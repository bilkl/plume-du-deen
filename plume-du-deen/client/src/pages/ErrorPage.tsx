import { useState } from 'react'
import { useLocation } from 'wouter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCw, Bug, Mail } from 'lucide-react'

interface ErrorPageProps {
  error?: Error
  errorInfo?: any
  retry?: () => void
}

export default function ErrorPage({ error, errorInfo, retry }: ErrorPageProps) {
  const [, setLocation] = useLocation()
  const [showDetails, setShowDetails] = useState(false)

  const handleRetry = () => {
    if (retry) {
      retry()
    } else {
      window.location.reload()
    }
  }

  const handleReport = () => {
    const subject = encodeURIComponent('Rapport d\'erreur - Plume du Deen')
    const body = encodeURIComponent(`
Erreur rencontrée sur le site Plume du Deen

Message d'erreur: ${error?.message || 'Erreur inconnue'}
URL: ${window.location.href}
Navigateur: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}

Détails techniques:
${errorInfo ? JSON.stringify(errorInfo, null, 2) : 'Aucun détail disponible'}

Veuillez décrire ce que vous faisiez quand l'erreur s'est produite:
[Description de l'utilisateur]
    `)
    window.location.href = `mailto:support@plume-du-deen.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 bg-red-100 dark:bg-red-950/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl text-red-700 dark:text-red-400">
            Oups ! Une erreur inattendue s'est produite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Nous sommes désolés pour la gêne occasionnée. Notre équipe a été notifiée de ce problème.
            </p>
            <div className="bg-secondary/50 dark:bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Que faire maintenant ?</p>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Actualisez la page</li>
                <li>• Vérifiez votre connexion internet</li>
                <li>• Essayez de nouveau dans quelques minutes</li>
                <li>• Contactez notre support si le problème persiste</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleRetry}
              className="flex-1"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>

          <div className="border-t pt-4">
            <Button
              onClick={handleReport}
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <Mail className="w-4 h-4 mr-2" />
              Signaler cette erreur
            </Button>

            {error && (
              <div className="mt-4">
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  {showDetails ? 'Masquer' : 'Afficher'} les détails techniques
                </Button>

                {showDetails && (
                  <div className="mt-3 p-3 bg-secondary/30 rounded-lg">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all">
                      {error.message}
                      {errorInfo && (
                        <>
                          {'\n\nStack trace:'}
                          {errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <p>Erreur #{Date.now().toString().slice(-6)}</p>
            <p>Si le problème persiste, contactez notre support technique</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}