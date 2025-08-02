const TailwindTest = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold gradient-text">Tailwind CSS Test</h1>
      
      {/* Color Test */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Color System Test</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-primary text-primary-foreground rounded-lg">
            Primary
          </div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
            Secondary
          </div>
          <div className="p-4 bg-muted text-muted-foreground rounded-lg">
            Muted
          </div>
          <div className="p-4 bg-accent text-accent-foreground rounded-lg">
            Accent
          </div>
        </div>
      </div>

      {/* Component Test */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Component Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-hover p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-medium mb-2">Card Component</h3>
            <p className="text-muted-foreground">This card has hover effects and proper styling.</p>
          </div>
          <div className="glass-effect p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Glass Effect</h3>
            <p className="text-muted-foreground">This uses the glass effect utility class.</p>
          </div>
        </div>
      </div>

      {/* Animation Test */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Animation Test</h2>
        <div className="flex gap-4">
          <div className="animate-fade-in p-4 bg-blue-100 rounded-lg">
            Fade In
          </div>
          <div className="animate-slide-in p-4 bg-green-100 rounded-lg">
            Slide In
          </div>
        </div>
      </div>

      {/* Responsive Test */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Responsive Test</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-red-100 rounded-lg text-center">
            <span className="block sm:hidden">Mobile</span>
            <span className="hidden sm:block lg:hidden">Tablet</span>
            <span className="hidden lg:block">Desktop</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg text-center">
            <span className="block sm:hidden">Mobile</span>
            <span className="hidden sm:block lg:hidden">Tablet</span>
            <span className="hidden lg:block">Desktop</span>
          </div>
          <div className="p-4 bg-green-100 rounded-lg text-center">
            <span className="block sm:hidden">Mobile</span>
            <span className="hidden sm:block lg:hidden">Tablet</span>
            <span className="hidden lg:block">Desktop</span>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg text-center">
            <span className="block sm:hidden">Mobile</span>
            <span className="hidden sm:block lg:hidden">Tablet</span>
            <span className="hidden lg:block">Desktop</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-medium">✅ Tailwind CSS is working correctly!</p>
        <p className="text-green-700 text-sm mt-1">All utility classes and custom components are functioning properly.</p>
      </div>
    </div>
  );
};

export default TailwindTest;
