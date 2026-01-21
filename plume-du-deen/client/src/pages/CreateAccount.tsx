import { useState } from 'react'
import { useLocation } from 'wouter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CreateAccount() {
  const [, setLocation] = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      showErrorToast('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      showErrorToast('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement actual account creation
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccessToast('Compte créé avec succès !')
      setLocation('/')
    } catch (error) {
      showErrorToast('Erreur lors de la création du compte')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 pb-12">
        <div className="container">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Créer un compte</CardTitle>
                <p className="text-muted-foreground">
                  Suivez vos commandes et bénéficiez d'avantages exclusifs
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setLocation('/')}
                    className="text-sm"
                  >
                    Plus tard, retourner à l'accueil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}