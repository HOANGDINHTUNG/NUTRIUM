import styled from "styled-components";

type Props = {
  mode: boolean;
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

const StyledWrapper = styled.div<{ $dark: boolean }>`
  .checkbox-wrapper {
    display: inline-flex;
    align-items: center;
  }

  .checkbox-wrapper input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .checkbox-wrapper .terms-label {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 0.875rem;
    color: ${(props) => (props.$dark ? "#C9C9CF" : "#1C1C1E")};
    transition: color 0.2s ease;
  }

  .checkbox-wrapper .checkbox-svg {
    width: 28px;
    height: 28px;
  }

  .checkbox-wrapper .checkbox-box {
    fill: ${(props) =>
      props.$dark ? "rgba(20,22,27,0.6)" : "rgba(244,244,245,0.65)"};
    stroke: ${(props) => (props.$dark ? "#D4AF37" : "#B88A1B")};
    stroke-dasharray: 800;
    stroke-dashoffset: 800;
    transition: stroke-dashoffset 0.45s ease-in;
  }

  .checkbox-wrapper .checkbox-tick {
    stroke: ${(props) => (props.$dark ? "#D4AF37" : "#B88A1B")};
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 172;
    stroke-dashoffset: 172;
    transition: stroke-dashoffset 0.45s ease-in;
  }

  .checkbox-wrapper input[type="checkbox"]:focus-visible + .terms-label {
    outline: 2px solid rgba(212, 175, 55, 0.35);
    outline-offset: 4px;
    border-radius: 10px;
  }

  .checkbox-wrapper input[type="checkbox"]:checked + .terms-label .checkbox-box,
  .checkbox-wrapper
    input[type="checkbox"]:checked
    + .terms-label
    .checkbox-tick {
    stroke-dashoffset: 0;
  }
`;

export default function RememberMe({ mode, checked, label, onChange }: Props) {
  const checkboxId = "remember-checkbox";
  if (!mode) {
    return (
      <label
        htmlFor={checkboxId}
        className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 transition-colors duration-300"
      >
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
        />
        <span className="text-slate-700">{label}</span>
      </label>
    );
  }

  return (
    <StyledWrapper $dark={mode}>
      <div className="checkbox-wrapper">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className="terms-label" htmlFor={checkboxId}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 200 200"
            className="checkbox-svg"
          >
            <mask fill="white" id="remember-checkbox-mask">
              <rect height={200} width={200} />
            </mask>
            <rect
              mask="url(#remember-checkbox-mask)"
              strokeWidth={40}
              className="checkbox-box"
              height={200}
              width={200}
              rx={36}
            />
            <path
              strokeWidth={16}
              d="M52 111.018L76.9867 136L149 64"
              className="checkbox-tick"
            />
          </svg>
          <span className="label-text">{label}</span>
        </label>
      </div>
    </StyledWrapper>
  );
}
