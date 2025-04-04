const TileGroup = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: string | React.ReactNode;
}) => {
  return (
    <div className="bg-white shadow-[0px_6px_18px_0px_rgba(0,0,18,0.16)] border-b-2">
      <p className="text-xl font-bold my-0 leading-loose p-4 pl-6 border-b-2">
        <span className={icon} /> {title}
      </p>
      <div>{children}</div>
    </div>
  );
};

export default TileGroup;
