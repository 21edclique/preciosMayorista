import React, { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';

// Table Components
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, className = '', ...props }) => (
  <div className={`w-full overflow-auto ${className}`}>
    <table {...props} className="w-full text-sm">{children}</table>
  </div>
);

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '', ...props }) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props}>
    {children}
  </thead>
);

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children, className = '', ...props }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
    {children}
  </tbody>
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className = '', ...props }) => (
  <tr 
    className={`border-b transition-colors hover:bg-gray-100 ${className}`} 
    {...props}
  >
    {children}
  </tr>
);

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className = '', ...props }) => (
  <th 
    className={`px-4 py-2 text-left font-medium text-gray-600 ${className}`} 
    {...props}
  >
    {children}
  </th>
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '', ...props }) => (
  <td 
    className={`px-4 py-2 align-middle ${className}`} 
    {...props}
  >
    {children}
  </td>
);

// Dialog Components
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black opacity-50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        {children}
      </div>
    </div>
  );
};

interface DialogTriggerProps {
  children: ReactNode;
  onClick?: () => void;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
);

interface DialogContentProps {
  children: ReactNode;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children }) => (
  <div>{children}</div>
);

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);

interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children, className = '' }) => (
  <div className={`flex justify-end space-x-2 mt-4 ${className}`}>
    {children}
  </div>
);

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 hover:bg-gray-100'
  };

  return (
    <button 
      className={`
        px-4 py-2 rounded-md transition-colors 
        ${variantStyles[variant]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ 
  type = 'text', 
  className = '', 
  ...props 
}) => (
  <input
    type={type}
    className={`
      w-full px-3 py-2 border border-gray-300 
      rounded-md focus:outline-none focus:ring-2 
      focus:ring-blue-500
      ${className}
    `}
    {...props}
  />
);

// Select Component
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ 
  children, 
  value, 
  onValueChange, 
  className = '',
  ...props 
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange?.(e.target.value)}
    className={`
      w-full px-3 py-2 border border-gray-300 
      rounded-md focus:outline-none focus:ring-2 
      focus:ring-blue-500
      ${className}
    `}
    {...props}
  >
    {children}
  </select>
);

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export const SelectTrigger: React.FC<{children: ReactNode}> = ({ children }) => <>{children}</>;
export const SelectValue: React.FC<{placeholder?: string}> = () => null;
export const SelectContent: React.FC<{children: ReactNode}> = ({ children }) => <>{children}</>;
export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => (
  <option value={value}>{children}</option>
);