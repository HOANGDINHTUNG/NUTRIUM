import React from "react";
import styled from "styled-components";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string; 
};

export default function GoldCosmicSearch({
  value,
  onChange,
  placeholder = "Search recipes in style…",
  className,
}: Props) {
  return (
    <StyledWrapper className={className}>
      <div id="search-container">
        {/* lớp hiệu ứng */}
        <div className="nebula" />
        <div className="starfield" />
        <div className="cosmic-dust" />
        <div className="cosmic-dust" />
        <div className="cosmic-dust" />
        <div className="stardust" />
        <div className="cosmic-ring" />

        {/* main box */}
        <div id="main">
          <input
            className="input"
            name="text"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
          <div id="input-mask" />
          <div id="cosmic-glow" />
          <div className="wormhole-border" />
          <div id="wormhole-icon">
            <svg
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth={2}
              stroke="#e6c766"
              fill="none"
              height={24}
              width={24}
              viewBox="0 0 24 24"
            >
              <circle r={10} cy={12} cx={12} />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <div id="search-icon">
            <svg
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth={2}
              stroke="url(#cosmic-search-gold)"
              fill="none"
              height={24}
              width={24}
              viewBox="0 0 24 24"
            >
              <circle r={8} cy={11} cx={11} />
              <line y2="16.65" x2="16.65" y1={21} x1={21} />
              <defs>
                <linearGradient gradientTransform="rotate(45)" id="cosmic-search-gold">
                  <stop stopColor="#e6c766" offset="0%" />
                  <stop stopColor="#d4af37" offset="55%" />
                  <stop stopColor="#c58c45" offset="100%" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Palette + kích thước ràng buộc */
  --bg: #0b0b0c;
  --gold-1: #d4af37;
  --gold-2: #e6c766;
  --bronze-1: #c58c45;
  --ink: #111216;

  /* Chiều cao input; thay đổi 1 chỗ này nếu muốn */
  --h: 46px;
  --radius: 10px;

  /* Container flex: component sẽ giãn theo lớp ngoài */
  #search-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;              /* giãn full */
    min-width: 0;             /* để không phá flex container cha */
  }

  /* Box chính chiếm toàn bộ chiều rộng */
  #main {
    position: relative;
    width: 100%;
    min-width: 0;
  }

  /* Lớp hiệu ứng phủ theo kích thước input */
  .stardust,
  .cosmic-ring,
  .starfield,
  .nebula {
    position: absolute;
    inset: 0;                 /* phủ khít theo #main */
    height: var(--h);
    border-radius: calc(var(--radius) + 1px);
    z-index: -1;
    overflow: hidden;
    filter: blur(3px);
  }

  .input {
    width: 100%;              /* GIÃN THEO FLEX */
    height: var(--h);
    background-color: var(--ink);
    color: #fff4c2;
    font-size: 14px;
    border: none;
    border-radius: var(--radius);
    /* chừa chỗ icon: trái 20px + icon 24px + gap ~15px = 59px */
    padding-left: 59px;
    /* phải 8px + icon 24px + gap ~15px + viền = 52px */
    padding-right: 52px;
    transition: box-shadow .3s ease, background-color .3s ease, color .3s ease;
  }

  .input::placeholder { color: #e3cf8a; opacity: .9; }

  .input:focus {
    outline: none;
    box-shadow:
      0 0 0 1px rgba(212,175,55,.45),
      0 0 18px 2px rgba(197,140,69,.25);
  }

  /* mask tinh chỉnh khi focus */
  #main:focus-within > #input-mask { display: none; }
  #input-mask {
    pointer-events: none;
    width: 100px;
    height: 20px;
    position: absolute;
    background: linear-gradient(90deg, transparent, var(--ink));
    top: calc((var(--h) - 20px)/2);
    left: 70px;
  }

  #cosmic-glow {
    pointer-events: none;
    width: 30px;
    height: 20px;
    position: absolute;
    background: var(--gold-1);
    left: 5px;
    top: calc((var(--h) - 20px)/2);
    filter: blur(20px);
    opacity: 0.8;
    transition: all 2s;
  }
  #main:hover > #cosmic-glow { opacity: 0; }

  /* Icon CĂN TÂM THEO CHIỀU CAO INPUT */
  #search-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);  /* ✅ căn giữa vertical */
    pointer-events: none;
  }

  #wormhole-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);  /* ✅ căn giữa vertical */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    height: calc(var(--h) - 16px);
    width: 38px;
    isolation: isolate;
    overflow: hidden;
    border-radius: var(--radius);
    background: linear-gradient(180deg, #1a160a, var(--ink), #2a2310);
    border: 1px solid transparent;
  }

  .wormhole-border {
    position: absolute;
    right: 7px;
    top: 50%;
    transform: translateY(-50%);
    height: calc(var(--h) - 14px);
    width: 40px;
    overflow: hidden;
    border-radius: var(--radius);
    pointer-events: none;
  }

  .wormhole-border::before {
    content: "";
    text-align: center;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.25);
    background-image: conic-gradient(
      rgba(0,0,0,0),
      var(--gold-1),
      rgba(0,0,0,0) 50%,
      rgba(0,0,0,0) 50%,
      var(--bronze-1),
      rgba(0,0,0,0) 100%
    );
    animation: rotate 4s linear infinite;
  }

  /* Gold/bronze sweeps */
  .stardust::before,
  .cosmic-ring::before,
  .starfield::before,
  .nebula::before {
    content: "";
    z-index: -2;
    text-align: center;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(80deg);
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    transition: all 2s;
  }

  .stardust { filter: blur(2px); border-radius: var(--radius); }
  .stardust::before {
    filter: brightness(1.2);
    background-image: conic-gradient(
      rgba(0,0,0,0) 0%,
      var(--gold-1),
      rgba(0,0,0,0) 8%,
      rgba(0,0,0,0) 50%,
      var(--bronze-1),
      rgba(0,0,0,0) 58%
    );
  }

  .cosmic-ring { filter: blur(.5px); }
  .cosmic-ring::before {
    filter: brightness(1.25);
    background-image: conic-gradient(
      var(--ink),
      var(--gold-2) 6%,
      var(--ink) 14%,
      var(--ink) 50%,
      var(--bronze-1) 60%,
      var(--ink) 66%
    );
  }

  .starfield::before {
    background-image: conic-gradient(
      rgba(0,0,0,0),
      #2a2310,
      rgba(0,0,0,0) 10%,
      rgba(0,0,0,0) 50%,
      #3a2d14,
      rgba(0,0,0,0) 60%
    );
  }

  .nebula { overflow: hidden; filter: blur(30px); opacity: .35; height: calc(var(--h) + 60px); }
  .nebula::before {
    width: 999px; height: 999px;
    background-image: conic-gradient(
      #000,
      var(--gold-2) 6%,
      #000 38%,
      #000 50%,
      var(--bronze-1) 60%,
      #000 86%
    );
  }

  /* Hover/Focus rotations */
  #search-container:hover > .starfield::before { transform: translate(-50%, -50%) rotate(-98deg); }
  #search-container:hover > .nebula::before   { transform: translate(-50%, -50%) rotate(-120deg); }
  #search-container:hover > .stardust::before { transform: translate(-50%, -50%) rotate(-97deg); }
  #search-container:hover > .cosmic-ring::before { transform: translate(-50%, -50%) rotate(-110deg); }

  #search-container:focus-within > .starfield::before { transform: translate(-50%, -50%) rotate(442deg); transition: all 4s; }
  #search-container:focus-within > .nebula::before    { transform: translate(-50%, -50%) rotate(420deg); transition: all 4s; }
  #search-container:focus-within > .stardust::before  { transform: translate(-50%, -50%) rotate(443deg); transition: all 4s; }
  #search-container:focus-within > .cosmic-ring::before { transform: translate(-50%, -50%) rotate(430deg); transition: all 4s; }

  @keyframes rotate { 100% { transform: translate(-50%, -50%) rotate(450deg); } }
`;
