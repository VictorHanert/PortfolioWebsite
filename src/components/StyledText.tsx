import React from 'react';
import styled from 'styled-components';

const StyledText = () => {
    return (
        <StyledWrapper>
            <p className="btn-shine">Fullstack Developer</p>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  .btn-shine {
    color: #fff;
    background: linear-gradient(to right, #9f9f9f 0, #fff 10%, #868686 20%);
    background-position: 0;
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 4.5s infinite linear;
    -webkit-text-size-adjust: none;
    font-weight: 600;
    font-size: 16px;
    text-decoration: none;
    white-space: nowrap;
    font-family: "Poppins", sans-serif;
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }
  @-moz-keyframes shine {
    0% {
      background-position: -235px;
    }
    100% {
      background-position: 235px;
    }
  }
  @-webkit-keyframes shine {
    0% {
      background-position: -235px;
    }
    100% {
      background-position: 235px;
    }
  }
  @-o-keyframes shine {
    0% {
      background-position: -235px;
    }
    100% {
      background-position: 235px;
    }
  }
  @keyframes shine {
    0% {
      background-position: -235px;
    }
    100% {
      background-position: 235px;
    }
  }`;

export default StyledText;
