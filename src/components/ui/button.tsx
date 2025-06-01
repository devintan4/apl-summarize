import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button
      className={className}
      {...props} // ini penting agar props seperti `type` ikut diteruskan
    />
  );
};
