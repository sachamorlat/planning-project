import React from 'react';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonIntent = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
type ButtonVariant = 'solid' | 'outline' | 'ghost';

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: ButtonSize;
    intent?: ButtonIntent;
    variant?: ButtonVariant;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-1.5 text-base',
    lg: 'px-6 py-2 text-lg'
};

const intentClasses: Record<ButtonIntent, Record<ButtonVariant, string>> = {
    primary: {
        solid: 'bg-blue-500 hover:bg-blue-600 text-white',
        outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
        ghost: 'text-blue-500 hover:bg-blue-50'
    },
    secondary: {
        solid: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
        ghost: 'text-gray-700 hover:bg-gray-100'
    },
    success: {
        solid: 'bg-green-500 hover:bg-green-600 text-white',
        outline: 'border-2 border-green-500 text-green-500 hover:bg-green-50',
        ghost: 'text-green-500 hover:bg-green-50'
    },
    danger: {
        solid: 'bg-red-500 hover:bg-red-600 text-white',
        outline: 'border-2 border-red-500 text-red-500 hover:bg-red-50',
        ghost: 'text-red-500 hover:bg-red-50'
    },
    warning: {
        solid: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        outline: 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50',
        ghost: 'text-yellow-500 hover:bg-yellow-50'
    }
};

const BaseButton: React.FC<BaseButtonProps> = ({
                                                   size = 'md',
                                                   intent = 'primary',
                                                   variant = 'solid',
                                                   isLoading = false,
                                                   leftIcon,
                                                   rightIcon,
                                                   fullWidth = false,
                                                   className = '',
                                                   children,
                                                   disabled,
                                                   ...props
                                               }) => {
    const classes = [
        'rounded-lg font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        intentClasses[intent][variant],
        fullWidth ? 'w-full' : '',
        className
    ].join(' ');

    return (
        <button
            className={classes}
            disabled={isLoading || disabled}
            {...props}
        >
      <span className="inline-flex items-center justify-center gap-2">
        {isLoading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
            </svg>
        )}
          {!isLoading && leftIcon}
          {children}
          {!isLoading && rightIcon}
      </span>
        </button>
    );
};

export const SaveButton: React.FC<BaseButtonProps> = (props) => (
    <BaseButton intent="success" {...props}>
        {props.children || 'Enregistrer'}
    </BaseButton>
);

export const CancelButton: React.FC<BaseButtonProps> = (props) => (
    <BaseButton
        intent="secondary"
        variant="ghost"
        {...props}
    >
        {props.children || 'Annuler'}
    </BaseButton>
);

export const DeleteButton: React.FC<BaseButtonProps> = (props) => (
    <BaseButton
        intent="danger"
        {...props}
    >
        {props.children || 'Supprimer'}
    </BaseButton>
);

export const EditButton: React.FC<BaseButtonProps> = (props) => (
    <BaseButton
        intent="primary"
        variant="outline"
        {...props}
    >
        {props.children || 'Modifier'}
    </BaseButton>
);

export const ButtonGroup: React.FC<{
    children: React.ReactNode;
    align?: 'left' | 'center' | 'right';
    spacing?: 'tight' | 'normal' | 'wide';
    className?: string;
}> = ({
          children,
          align = 'right',
          spacing = 'normal',
          className = ''
      }) => {
    const alignClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end'
    };

    const spacingClasses = {
        tight: 'gap-2',
        normal: 'gap-4',
        wide: 'gap-6'
    };

    return (
        <div className={`flex ${alignClasses[align]} ${spacingClasses[spacing]} ${className}`}>
            {children}
        </div>
    );
};

export default BaseButton;