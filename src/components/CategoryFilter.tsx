type CategoryFilterProps = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
  };
  
  export const CategoryFilter = ({ categories, activeCategory, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12 sm:flex-nowrap">
    {categories.map((category) => (
      <button
      key={category}
      onClick={() => onSelect(category)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors w-[calc(50%-0.5rem)] sm:w-auto
        ${
        activeCategory === category
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
      {category}
      </button>
    ))}
    </div>
  );
  };
