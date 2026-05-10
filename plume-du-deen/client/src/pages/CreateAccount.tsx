import { useState } from 'react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { PageHero, PageShell, PremiumCard } from '@/components/PageLayout'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CreateAccount() {
  const [, setLocation] = useLocation()
  const { language } = useLanguage()
  const isEnglish = language === 'en'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      showErrorToast(isEnglish ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      showErrorToast(isEnglish ? 'Password must contain at least 6 characters' : 'Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement actual account creation
      await new Promise(resolve => setTimeout(resolve, 1000))

      showSuccessToast(isEnglish ? 'Account created successfully.' : 'Compte créé avec succès !')
      setLocation('/')
    } catch (error) {
      showErrorToast(isEnglish ? 'Error while creating the account' : 'Erreur lors de la création du compte')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <PageShell>
      <PageHero
        eyebrow={isEnglish ? 'Account' : 'Compte'}
        title={isEnglish ? 'Create an account' : 'Créer un compte'}
        description={isEnglish ? 'Track your orders and find your information more easily.' : 'Suivez vos commandes et retrouvez vos informations plus facilement.'}
        className="pb-10 md:pb-14"
      />
      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="max-w-[22rem] sm:max-w-md mx-auto">
            <PremiumCard className="p-6 md:p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl md:text-3xl text-foreground">{isEnglish ? 'Your access' : 'Vos accès'}</h2>
                  <p className="mt-2 text-muted-foreground">
                    {isEnglish ? 'A few details are enough to prepare your space.' : 'Quelques informations suffisent pour préparer votre espace.'}
                  </p>
                </div>
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
                    <Label htmlFor="password">{isEnglish ? 'Password' : 'Mot de passe'}</Label>
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
                    <Label htmlFor="confirmPassword">{isEnglish ? 'Confirm password' : 'Confirmer le mot de passe'}</Label>
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
                    {isSubmitting
                      ? isEnglish ? 'Creating account...' : 'Création en cours...'
                      : isEnglish ? 'Create my account' : 'Créer mon compte'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setLocation('/')}
                    className="text-sm"
                  >
                    {isEnglish ? 'Later, return home' : "Plus tard, retourner à l'accueil"}
                  </Button>
                </div>
            </PremiumCard>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
