export const TapeContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="system-shell relative min-h-screen py-[var(--space-xxxl)] overflow-hidden flex flex-col items-center justify-start gap-[var(--space-xxxl)]">
      {/* Background continuous line that turns back and forth - a simplified Dragon Curve concept using CSS */}
      <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-gradient-to-b from-transparent via-black/10 to-transparent -z-10 hidden md:block" />
      <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-gradient-to-b from-transparent via-black/10 to-transparent -z-10 hidden md:block" />
      <div className="absolute top-0 bottom-0 left-[80%] w-[1px] bg-gradient-to-b from-transparent via-black/10 to-transparent -z-10 hidden md:block" />
      {children}
    </div>
  );
};
