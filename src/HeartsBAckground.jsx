// HeartsBackground.jsx
export default function HeartsBackground() {
  return (
    <div className="hearts-bg">
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="heart"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            fontSize: `${14 + Math.random() * 20}px`,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
