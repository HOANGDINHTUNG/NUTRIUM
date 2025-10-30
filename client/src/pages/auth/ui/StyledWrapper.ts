import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const StyledWrapper = styled.span`
  position: relative;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.2em;
  background: linear-gradient(
    90deg,
    rgba(82, 76, 62, 0.3) 0%,
    #f5d27a 45%,
    #d4af37 55%,
    rgba(82, 76, 62, 0.3) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 3.2s ease-in-out infinite;
`;

export default StyledWrapper;

export const StyledWrapper2 = styled.div`
  .txt {
    position: relative;
    font-family: "Poppins", sans-serif;
    font-size: 1em;
    letter-spacing: 4px;
    overflow: hidden;
    background: linear-gradient(
      90deg,
      #f9e79f 0%,
      #f1c40f 20%,
      #d4ac0d 40%,
      #f7dc6f 60%,
      #f1c40f 80%,
      #f9e79f 100%
    );
    background-repeat: no-repeat;
    background-size: 80%;
    animation: animate 3s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @keyframes animate {
    0% {
      background-position: -500%;
    }
    100% {
      background-position: 500%;
    }
  }
`;

export const StyledWrapper3 = styled.div`
  button {
    border: none;
    outline: none;
    background: linear-gradient(90deg, #f9e79f, #f1c40f, #d4ac0d);
    padding: 10px 20px;
    font-weight: 700;
    color: #1c1c1e;
    border-radius: 5px;
    transition: all ease 0.1s;
    box-shadow: 0px 5px 0px 0px #b7950b;
  }

  button:hover {
    background: linear-gradient(90deg, #f7dc6f, #f1c40f, #f9e79f);
    box-shadow: 0px 6px 10px rgba(255, 215, 0, 0.4);
  }

  button:active {
    transform: translateY(5px);
    box-shadow: 0px 0px 0px 0px #b7950b;
  }
`;

export const StyledWrapper4 = styled.div`
  .cta {
    border: none;
    background: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #f1c40f; /* chữ vàng sang */
    transition: color 0.3s ease;
    position: relative;
  }

  .cta span {
    padding-bottom: 7px;
    padding-right: 10px;
    text-transform: uppercase;
    font-weight: 600;
  }

  /* SVG ẩn lúc đầu */
  .cta svg {
    fill: #f1c40f;
    stroke: #f1c40f;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.4s ease;
    filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.4));
  }

  /* Khi hover thì hiện lên */
  .cta:hover svg {
    opacity: 1;
    transform: translateX(0);
    fill: #ffd700;
    stroke: #ffd700;
    filter: drop-shadow(0 0 8px rgba(255, 223, 0, 0.8));
  }

  .cta:active svg {
    transform: scale(0.9);
    filter: drop-shadow(0 0 3px rgba(255, 223, 0, 0.6));
  }

  .hover-underline-animation {
    position: relative;
    padding-bottom: 20px;
  }

  .hover-underline-animation:after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, #f9e79f, #f1c40f, #d4ac0d);
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
  }

  .cta:hover .hover-underline-animation:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

export const StyledWrapper5 = styled.div`
  .btn {
    --color1: #1a8516;
    --color2: #236b19;
    perspective: 1000px;
    padding: 1em 1em;
    background: linear-gradient(var(--color1), var(--color2));
    border: none;
    outline: none;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: #fff;
    text-shadow: 0 10px 10px #000;
    cursor: pointer;
    transform: rotateX(70deg) rotateZ(30deg);
    transform-style: preserve-3d;
    transition: transform 0.5s;
  }

  .btn::before {
    content: "";
    width: 100%;
    height: 15px;
    background-color: var(--color2);
    position: absolute;
    bottom: 0;
    right: 0;
    transform: rotateX(90deg);
    transform-origin: bottom;
  }

  .btn::after {
    content: "";
    width: 15px;
    height: 100%;
    background-color: var(--color1);
    position: absolute;
    top: 0;
    right: 0;
    transform: rotateY(-90deg);
    transform-origin: right;
  }

  .btn:hover {
    transform: rotateX(30deg) rotateZ(0);
  }
`;

export const StyledWrapper6 = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.25);

    /* Nền vàng đen sang trọng */
    background: linear-gradient(135deg, #d4af37 0%, #b8860b 40%, #1c1c1c 100%);
  }

  /* icon (+) */
  .sign {
    width: 100%;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 17px;
  }

  .sign svg path {
    fill: #111; /* icon đen */
    transition: fill 0.3s ease;
  }

  /* text */
  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: #111; /* chữ đen */
    font-size: 1.1em;
    font-weight: 600;
    transition-duration: 0.3s;
    letter-spacing: 0.5px;
  }

  /* hover mở rộng */
  .Btn:hover {
    width: 125px;
    border-radius: 40px;
    transition-duration: 0.3s;
    background: linear-gradient(135deg, #ffdf00 0%, #d4af37 40%, #8b7500 100%);
    box-shadow: 0px 0px 12px 3px rgba(212, 175, 55, 0.4);
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-left: 20px;
  }

  .Btn:hover .sign svg path {
    fill: #000; /* icon tối hơn khi hover */
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-right: 10px;
  }

  /* click effect */
  .Btn:active {
    transform: translate(2px, 2px);
  }
`;

export const StyledWrapper7 = styled.div`
  .button {
    width: fit-content;
    display: flex;
    padding: 0.6em 0.5rem;
    cursor: pointer;
    gap: 0.4rem;
    font-weight: bold;
    border-radius: 30px;
    text-shadow: 2px 2px 3px rgb(136 0 136 / 50%);
    background: linear-gradient(
        15deg,
        #880088,
        #aa2068,
        #cc3f47,
        #de6f3d,
        #f09f33,
        #de6f3d,
        #cc3f47,
        #aa2068,
        #880088
      )
      no-repeat;
    background-size: 300%;
    color: #fff;
    border: none;
    background-position: left center;
    box-shadow: 0 30px 10px -20px rgba(0, 0, 0, 0.2);
    transition: background 0.3s ease;
  }

  .button:hover {
    background-size: 320%;
    background-position: right center;
  }

  .button:hover #icon_font {
    color: #B9384F;
  }

  .button #icon_font {
    width: 23px;
    color: #f09f33;
    transition: 0.3s ease;
  }
`;

export const StyledWrapperGold = styled.div`
  /* Bảng màu: vàng – nâu đồng sáng */
  --gold-1: #d4af37;   /* vàng kim chuẩn */
  --gold-2: #e6c766;   /* vàng nhạt */
  --bronze-1: #c58c45; /* nâu sáng ánh kim */
  --bronze-2: #a66d2f; /* nâu trầm hơn */
  --glow: rgba(212, 175, 55, 0.25);
  --bg: #0b0b0c;

  .box-input {
    position: relative;
    display: inline-block;
  }

  .border {
    border-radius: 12px;
  }

  .input {
    background-color: #1a1a1a;
    width: 388px;
    height: 40px;
    padding: 0 19px 0 12px;
    font-size: 1.05em;
    position: relative;
    border: none;
    outline: 0;
    color: #f9e7b3; /* chữ vàng nhạt sang trọng */
    border-radius: 10px;
    transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  }

  /* Hiệu ứng bóng sáng nhẹ quanh input */
  .input:hover {
    box-shadow: 0 0 4px 1px rgba(197, 140, 69, 0.35);
  }

  /* Placeholder animation */
  .input::placeholder {
    color: #c6a24c;
    opacity: 0.9;
    transition: all 0.5s ease-in, transform 0.2s ease-in 0.6s;
  }

  .input:focus::placeholder {
    padding-left: 265px;
    transform: translateY(-50px);
    opacity: 0.6;
  }

  /* Border chuyển động vàng-nâu */
  .input:focus {
    animation: rotateShadow 2.5s infinite linear;
    background-color: #111112;
    color: #fff9d1;
  }

  @keyframes rotateShadow {
    0% {
      box-shadow: 0 0 3px 1px var(--gold-1), 0 0 8px 2px transparent inset;
    }
    20% {
      box-shadow: 0 0 3px 1px var(--gold-2), 0 0 8px 2px var(--bronze-1) inset;
    }
    40% {
      box-shadow: 0 0 3px 1px var(--bronze-1), 0 0 8px 2px var(--bronze-2) inset;
    }
    60% {
      box-shadow: 0 0 3px 1px var(--bronze-2), 0 0 8px 2px var(--gold-2) inset;
    }
    80% {
      box-shadow: 0 0 3px 1px var(--gold-2), 0 0 8px 2px var(--gold-1) inset;
    }
    100% {
      box-shadow: 0 0 3px 1px var(--gold-1), 0 0 8px 2px transparent inset;
    }
  }
`;