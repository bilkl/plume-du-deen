import { Target, BookOpen, Flower2 } from 'lucide-react';

export default function Values() {
  const values = [
    {
      icon: Target,
      title: 'Produits conçus avec intention',
      description: '',
    },
    {
      icon: BookOpen,
      title: 'Rituels simples pour le quotidien',
      description: '',
    },
    {
      icon: Flower2,
      title: 'Formats utiles & idées cadeaux',
      description: '',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl text-foreground">
            Pensée avec sens
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chaque création est pensée avec conscience pour accompagner la foi au quotidien.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg hover:bg-card/50 dark:hover:bg-card/20 transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 flex items-center justify-center bg-accent/10 rounded-lg transition-transform duration-300 hover:scale-110">
                  <Icon className="w-8 h-8 text-accent" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  {/* Title */}
                  <h3 className="text-xl md:text-2xl text-foreground">
                    {value.title}
                  </h3>
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
