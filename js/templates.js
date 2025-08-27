// Template Loader for SDG Website
// This script dynamically loads header, sidebar, and footer templates

document.addEventListener("DOMContentLoaded", function () {
  // Function to load template content
  function loadTemplate(templatePath, targetElementId) {
    return fetch(templatePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
          targetElement.innerHTML = html;
        }
        return html;
      })
      .catch((error) => {
        console.error(`Error loading template ${templatePath}:`, error);
      });
  }

  // Load all templates
  const templatePromises = [];

  // Load header if container exists
  if (document.getElementById("header-template")) {
    templatePromises.push(
      loadTemplate("templates/header.html", "header-template")
    );
  }

  // Load sidebar if container exists
  if (document.getElementById("sidebar-template")) {
    templatePromises.push(
      loadTemplate("templates/sidebar.html", "sidebar-template")
    );
  }

  // Load footer if container exists
  if (document.getElementById("footer-template")) {
    templatePromises.push(
      loadTemplate("templates/footer.html", "footer-template")
    );
  }

  // After all templates are loaded, initialize functionality
  Promise.all(templatePromises).then(() => {
    // Set current year
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Set active navigation based on current page
    const currentPage = document.body.getAttribute("data-page");
    if (currentPage) {
      // Remove active class from all nav links
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.style.color = "rgba(255,255,255,0.9)";
        link.style.borderBottom = "none";
      });

      // Add active class to current page
      const activeLink = document.querySelector(`[data-page="${currentPage}"]`);
      if (activeLink) {
        activeLink.style.color = "white";
        activeLink.style.borderBottom = "3px solid #fcc30b";
      }
    }

    // Initialize sidebar functionality
    initializeSidebar();

    // Sidebar hamburger toggle logic (must run after sidebar is loaded)
    var sidebar = document.querySelector(".sidebar");
    var toggleBtn = document.getElementById("sidebar-toggle");

    // Create overlay element
    var overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    if (sidebar && toggleBtn) {
      toggleBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (window.innerWidth <= 900) {
          sidebar.classList.toggle("open");
          document.body.classList.toggle("sidebar-open");
        }
      });
    }

    // Close sidebar when clicking overlay
    if (overlay) {
      overlay.addEventListener("click", function () {
        if (
          window.innerWidth <= 900 &&
          sidebar &&
          sidebar.classList.contains("open")
        ) {
          sidebar.classList.remove("open");
          document.body.classList.remove("sidebar-open");
        }
      });
    }

    // Close sidebar when clicking outside (mobile only)
    document.addEventListener("click", function (e) {
      if (
        window.innerWidth <= 900 &&
        sidebar &&
        sidebar.classList.contains("open")
      ) {
        if (
          !sidebar.contains(e.target) &&
          e.target !== toggleBtn &&
          !toggleBtn.contains(e.target)
        ) {
          sidebar.classList.remove("open");
          document.body.classList.remove("sidebar-open");
        }
      }
    });

    // Hide sidebar on resize if needed
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && sidebar) {
        sidebar.classList.remove("open");
        document.body.classList.remove("sidebar-open");
      }
    });
  });
});

// Collapsible sidebar menu functionality
function toggleSubmenu(menuId) {
  const menu = document.getElementById(menuId);
  const icon = document.getElementById(menuId.replace("-menu", "-icon"));

  if (menu && icon) {
    if (menu.style.maxHeight === "0px" || !menu.style.maxHeight) {
      // Calculate the actual height needed
      menu.style.maxHeight = menu.scrollHeight + "px";
      icon.style.transform = "rotate(180deg)";
    } else {
      menu.style.maxHeight = "0px";
      icon.style.transform = "rotate(0deg)";
    }
  }
}

// Initialize sidebar hover effects
function initializeSidebar() {
  // Add hover effects to sidebar links
  const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
  sidebarLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.background = "rgba(255,255,255,0.2)";
      this.style.borderLeft = "3px solid #fcc30b";
      this.style.transform = "translateX(5px)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.background = "transparent";
      this.style.borderLeft = "3px solid transparent";
      this.style.transform = "translateX(0px)";
    });
  });

  // Add hover effects to quick action buttons
  const quickActions = document.querySelectorAll(".sidebar a");
  quickActions.forEach((action) => {
    if (
      action.style.borderBottom &&
      action.style.borderBottom.includes("rgba(255,255,255,0.05)")
    ) {
      action.addEventListener("mouseenter", function () {
        this.style.background = "rgba(255,255,255,0.1)";
        this.style.transform = "translateY(-2px)";
      });

      action.addEventListener("mouseleave", function () {
        this.style.background = "transparent";
        this.style.transform = "translateY(0px)";
      });
    }
  });
}

// Make toggleSubmenu function globally available
window.toggleSubmenu = toggleSubmenu;
