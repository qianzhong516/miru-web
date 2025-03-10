import React from "react";

import classnames from "classnames";

const DEFAULT_STYLE = "rounded text-center p-2";

const PRIMARY =
  "bg-miru-han-purple-1000 hover:bg-miru-han-purple-600 text-white  border border-miru-han-purple-1000 hover:border-miru-han-purple-600";

const PRIMARY_DISABLED =
  "bg-miru-gray-1000 text-white border border-miru-gray-1000";

const SECONDARY =
  "bg-transparent hover:bg-miru-gray-1000 text-miru-han-purple-1000 border border-miru-han-purple-1000";

const SECONDARY_DISABLED =
  "bg-transparent text-miru-dark-purple-200 border border-miru-dark-purple-200";

const TERNARY =
  "bg-transparent text-miru-han-purple-1000 hover:text-miru-han-purple-600 border-0";
const TERNARY_DISABLED = "bg-transparent text-miru-dark-purple-200 border-0";

const SMALL = "px-5/100 py-1vh text-xs font-bold leading-4";
const MEDIUM = "px-10/100 py-1vh text-base font-bold leading-5";
const LARGE = "px-15/100 py-1vh text-xl font-bold leading-7";

type ButtonProps = {
  style?: string;
  onClick?;
  disabled?: boolean;
  size?: string;
  className?: string;
  fullWidth?: boolean;
  children?: any;
  type?: any;
};

const BUTTON_STYLES = {
  primary: "primary",
  secondary: "secondary",
  ternary: "ternary",
};
const SIZES = { small: "small", medium: "medium", large: "large" };

const Button = ({
  style = "primary",
  size,
  disabled = false,
  className = "",
  fullWidth = false,
  onClick,
  children,
  type,
}: ButtonProps) => (
  <button
    disabled={disabled}
    type={type}
    className={classnames(
      DEFAULT_STYLE,
      fullWidth && "w-full",
      style == BUTTON_STYLES.primary && !disabled && PRIMARY,
      style == BUTTON_STYLES.primary && disabled && PRIMARY_DISABLED,

      style == BUTTON_STYLES.secondary && !disabled && SECONDARY,
      style == BUTTON_STYLES.secondary && disabled && SECONDARY_DISABLED,

      style == BUTTON_STYLES.ternary && !disabled && TERNARY,
      style == BUTTON_STYLES.ternary && disabled && TERNARY_DISABLED,

      size == SIZES.small && SMALL,
      size == SIZES.medium && MEDIUM,
      size == SIZES.large && LARGE,
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
