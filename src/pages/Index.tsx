import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, Zap, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Interactive Charts',
      description: 'Create stunning 2D and 3D visualizations with dynamic data mapping',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Real-time Analytics',
      description: 'Parse Excel files instantly and get immediate insights from your data',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Fast Processing',
      description: 'Upload and analyze large datasets with lightning-fast performance',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Storage',
      description: 'Enterprise-grade security for all your data and visualizations',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="container relative mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg"
            >
              <BarChart3 className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            
            <h1 className="mb-6 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              Excel Analytics{' '}
              <span className="text-gradient">AI Platform</span>
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground sm:text-2xl">
              Transform your spreadsheets into powerful insights with advanced visualization and AI-powered analytics
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/signup">
                <Button size="lg" className="group text-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for professional data analysis
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass-card h-full transition-all hover:shadow-lg hover:shadow-primary/20">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-secondary">
              <CardContent className="p-12 text-center text-primary-foreground">
                <h2 className="mb-4 text-4xl font-bold">
                  Ready to Transform Your Data?
                </h2>
                <p className="mb-8 text-xl opacity-90">
                  Join thousands of professionals using Excel Analytics AI Platform
                </p>
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="text-lg">
                    Start Analyzing Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Excel Analytics AI Platform. Built for IBM Project Excellence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
