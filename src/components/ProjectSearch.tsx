import { useState } from 'react';
import { Search, X } from 'lucide-react';

type ProjectSearchProps = {
  onSearch: (technologies: string[]) => void;
};

export const ProjectSearch = ({ onSearch }: ProjectSearchProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedTechs([...selectedTechs, searchInput.trim()]);
      setSearchInput('');
      onSearch([...selectedTechs, searchInput.trim()]);
    }
  };

  const removeTech = (tech: string) => {
    const newTechs = selectedTechs.filter(t => t !== tech);
    setSelectedTechs(newTechs);
    onSearch(newTechs);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="mb-4 flex justify-center gap-2 h-10 sm:h-12">
        <div className="relative h-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by skill"
            className="w-48 sm:w-64 md:w-72 h-full text-xs sm:text-base pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="h-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add
        </button>
      </form>

      {selectedTechs.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedTechs.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 border shadow-lg rounded-full text-sm"
            >
              {tech}
              <button
                onClick={() => removeTech(tech)}
                className="p-0.5 hover:bg-gray-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};