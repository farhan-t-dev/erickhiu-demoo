class Pagination {
    constructor(containerId, totalItems, itemsPerPage, onPageChange) {
      this.containerId = containerId; // ID of the pagination container
      this.totalItems = totalItems; // Total number of items
      this.itemsPerPage = itemsPerPage; // Items per page
      this.onPageChange = onPageChange; // Callback for page change
      this.currentPage = 1; // Current active page
      this.totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages
      this.renderPaginationControls();
    }
  
    // Render pagination buttons dynamically
    renderPaginationControls() {
      const container = document.getElementById(this.containerId);
      if (!container) return;
      container.innerHTML = ""; // Clear previous controls
  
      // Create "First" button
      this.createButton(container, "First", () => this.goToPage(1), this.currentPage === 1);
  
      // Create "Previous" button
      this.createButton(container, "Previous", () => this.goToPage(this.currentPage - 1), this.currentPage === 1);
  
      // Create numbered page buttons
      for (let i = 1; i <= this.totalPages; i++) {
        const isActive = i === this.currentPage;
        this.createButton(container, i, () => this.goToPage(i), false, isActive);
      }
  
      // Create "Next" button
      this.createButton(container, "Next", () => this.goToPage(this.currentPage + 1), this.currentPage === this.totalPages);
  
      // Create "Last" button
      this.createButton(container, "Last", () => this.goToPage(this.totalPages), this.currentPage === this.totalPages);
    }
  
    // Helper function to create a pagination button
    createButton(container, text, onClick, disabled = false, active = false) {
      const button = document.createElement("button");
      button.textContent = text;
      button.disabled = disabled;
      if (active) button.classList.add("active");
      button.addEventListener("click", onClick);
      container.appendChild(button);
    }
  
    // Navigate to a specific page
    goToPage(page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.currentPage = page;
      this.onPageChange(page); // Notify about the page change
      this.renderPaginationControls(); // Re-render pagination controls
    }
  }
  