import React from "react";

const Footer = () => {
  return (
    <footer className="py-4 px-6 mt-auto">
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-neutral-500">
          &copy; {new Date().getFullYear()} DIMAP CRM. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;