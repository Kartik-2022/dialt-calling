// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };
