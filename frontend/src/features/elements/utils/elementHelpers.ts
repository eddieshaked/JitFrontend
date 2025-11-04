/**
 * Convert color value to valid CSS color (for backward compatibility)
 */
export const getColorValue = (color?: string): string => {
  if (!color) return '#667eea';

  // If it's already a valid CSS color format, return as-is
  if (
    color.startsWith('#') ||
    color.startsWith('rgb') ||
    color.startsWith('rgba') ||
    color.startsWith('hsl')
  ) {
    return color;
  }

  // Try to use as CSS color name (browser will validate)
  const tempDiv = document.createElement('div');
  tempDiv.style.color = color;
  if (tempDiv.style.color) {
    return color;
  }

  return '#667eea';
};

/**
 * Convert size to CSS values
 */
export const getSizeStyles = (size?: string | number): React.CSSProperties => {
  const sizeMap: Record<string, React.CSSProperties> = {
    small: { padding: '8px 16px', fontSize: '0.875em' },
    medium: { padding: '12px 24px', fontSize: '1em' },
    large: { padding: '16px 32px', fontSize: '1.125em' },
    'very small': { padding: '6px 12px', fontSize: '0.75em' },
    'very large': { padding: '20px 40px', fontSize: '1.25em' },
  };

  const lowerSize = (size || 'medium').toString().toLowerCase();
  if (sizeMap[lowerSize]) {
    return sizeMap[lowerSize];
  }

  // If numeric, treat as pixel-based size
  if (!isNaN(Number(size))) {
    const numSize = parseInt(size!.toString());
    return {
      padding: `${numSize * 0.5}px ${numSize}px`,
      fontSize: `${numSize / 16}em`,
    };
  }

  return sizeMap['medium'];
};

