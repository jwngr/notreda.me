import {darken, lighten} from 'polished';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

interface SliderWrapperProps {
  readonly $width: number;
  readonly $widthSm: number;
}

const SliderWrapper = styled.div<SliderWrapperProps>`
  width: ${({$width}) => `${$width}px`};
  position: relative;
  height: 40px;

  @media (max-width: 600px) {
    max-width: ${({$widthSm}) => `${$widthSm}px`};
  }
`;

const Track = styled.div`
  position: absolute;
  height: 4px;
  width: 100%;
  background: ${({theme}) => lighten(0.2, theme.colors.gray)};
  border-radius: 4px;
  top: 50%;
  transform: translateY(-50%);
`;

const Range = styled.div`
  position: absolute;
  height: 4px;
  background: ${({theme}) => theme.colors.green};
  border-radius: 4px;
  top: 50%;
  transform: translateY(-50%);
`;

interface TooltipProps {
  readonly $visible: boolean;
}

const Tooltip = styled.div<TooltipProps>`
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({theme}) => theme.colors.green};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Inter';
  opacity: ${({$visible}) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  pointer-events: none;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${({theme}) => theme.colors.green};
  }
`;

interface ThumbProps {
  readonly $position: number;
  readonly $isDragging: boolean;
}

const Thumb = styled.div<ThumbProps>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({theme}) => theme.colors.green};
  border: 2px solid ${({theme}) => darken(0.2, theme.colors.green)};
  position: absolute;
  top: 50%;
  left: ${({$position}) => `${$position}%`};
  transform: translate(-50%, -50%) ${({$isDragging}) => ($isDragging ? 'scale(1.1)' : 'scale(1)')};
  cursor: pointer;
  transition: transform 0.2s ease;
  z-index: 1;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const Mark = styled.div`
  position: absolute;
  top: 100%;
  transform: translateX(-50%);
  font-family: 'Inter';
  font-size: 14px;
  color: ${({theme}) => theme.colors.gray};
`;

interface SliderRangeProps {
  readonly min: number;
  readonly max: number;
  readonly width?: number;
  readonly widthSm?: number;
  readonly onChange?: (value: number[]) => void;
  readonly className?: string;
  readonly initialValue?: number[];
}

export const SliderRange: React.FC<SliderRangeProps> = ({
  min,
  max,
  width = 200,
  widthSm = 140,
  onChange,
  className,
  initialValue = [min, max],
}) => {
  const [values, setValues] = useState<number[]>(initialValue);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = useCallback(
    (value: number) => {
      return ((value - min) / (max - min)) * 100;
    },
    [min, max]
  );

  const getValueFromPosition = useCallback(
    (position: number) => {
      const sliderRect = sliderRef.current?.getBoundingClientRect();
      if (!sliderRect) return 0;

      const percentage = (position - sliderRect.left) / sliderRect.width;
      const value = Math.round(percentage * (max - min) + min);
      return Math.max(min, Math.min(max, value));
    },
    [min, max]
  );

  const handleMouseDown = useCallback((index: number) => {
    setIsDragging(index);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging === null) return;

      const newValue = getValueFromPosition(event.clientX);
      const newValues = [...values];
      newValues[isDragging] = newValue;

      if (isDragging === 0 && newValue < values[1]) {
        setValues(newValues);
      } else if (isDragging === 1 && newValue > values[0]) {
        setValues(newValues);
      }
    },
    [isDragging, values, getValueFromPosition]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging !== null) {
      onChange?.(values);
      setIsDragging(null);
    }
  }, [isDragging, onChange, values]);

  useEffect(() => {
    if (isDragging !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <SliderWrapper ref={sliderRef} className={className} $width={width} $widthSm={widthSm}>
      <Track />
      <Range
        style={{
          left: `${getPercentage(values[0])}%`,
          width: `${getPercentage(values[1]) - getPercentage(values[0])}%`,
        }}
      />
      {[0, 1].map((index) => (
        <Thumb
          key={index}
          $position={getPercentage(values[index])}
          $isDragging={isDragging === index}
          onMouseDown={() => handleMouseDown(index)}
          onMouseEnter={() => setHoveredThumb(index)}
          onMouseLeave={() => setHoveredThumb(null)}
        >
          <Tooltip $visible={isDragging === index || hoveredThumb === index}>
            {values[index]}
          </Tooltip>
        </Thumb>
      ))}
      <Mark style={{left: '0%'}}>{min}</Mark>
      <Mark style={{left: '100%'}}>{max}</Mark>
    </SliderWrapper>
  );
};
