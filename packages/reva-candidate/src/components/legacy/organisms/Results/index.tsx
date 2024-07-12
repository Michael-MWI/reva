interface ResultsProps {
  className?: string;
  children: React.ReactNode;
  title: string;
  listClassName?: string;
}

export const Results = ({
  children,
  className = "",
  listClassName = "space-y-2",
  title,
}: ResultsProps) => {
  return (
    <section className={`mb-2 py-4 ${className}`}>
      <div className="mb-8 text-lg text-slate-600">{title}</div>
      <ul
        data-test="results"
        className={`mx-0 px-0 list-none ${listClassName}`}
      >
        {children}
      </ul>
    </section>
  );
};
