export const GradientDivider = () => <div className="h-24 bg-gradient-to-b from-black to-red-950" />

export const EmberDivider = () => (
  <div className="relative h-24 w-full overflow-hidden bg-gradient-to-b from-black to-red-950">
    <div className="absolute inset-0 flex justify-around items-end">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-red-500 rounded-full animate-float"
          style={{
            animationDelay: `${i * 0.1}s`,
            opacity: Math.random() * 0.5 + 0.5,
          }}
        />
      ))}
    </div>
  </div>
)
export const FadeDivider = () => <div className="h-12 bg-gradient-to-r from-black via-red-800 to-black" />;
