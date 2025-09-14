import React from "react";
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  showItemsPerPage?: boolean;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  showItemsPerPage = true,
  onItemsPerPageChange,
  itemsPerPageOptions = [12, 24, 48, 96],
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <div className="items-info">
          <span>
            Mostrando {startItem} - {endItem} de {totalItems} productos
          </span>
        </div>
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="items-per-page">
            <label htmlFor="items-per-page">Productos por página:</label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="pagination-select"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="pagination-controls">
        <button
          className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Página anterior"
        >
          <FaChevronLeft />
          <span>Anterior</span>
        </button>

        <div className="pagination-numbers">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="pagination-dots">
                  <FaEllipsisH />
                </span>
              ) : (
                <button
                  className={`pagination-number ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Página siguiente"
        >
          <span>Siguiente</span>
          <FaChevronRight />
        </button>
      </div>

      <div className="pagination-jump">
        <label htmlFor="jump-to-page">Ir a página:</label>
        <input
          id="jump-to-page"
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = Number(e.target.value);
            if (page >= 1 && page <= totalPages) {
              onPageChange(page);
            }
          }}
          className="pagination-input"
        />
      </div>
    </div>
  );
};

export default Pagination;
