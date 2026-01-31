/**
 * Text Formatter Utility
 * Converts markdown headings to bold text for academic display
 */

/**
 * Clean markdown heading symbols and convert to bold format
 * Transforms: "## Title" → "**Title**"
 * @param {string} text - Raw text with markdown headings
 * @returns {string} - Formatted text with bold headings instead of hashtags
 */
export const formatAnswerText = (text) => {
  if (!text) return '';

  // Convert markdown headings to bold format
  // Matches: # Title, ## Title, ### Title, etc.
  // Converts to: **Title**
  return text
    .replace(/^#+\s+(.+)$/gm, '**$1**') // Convert headers to bold
    .trim();
};

/**
 * Clean text for plain display (remove markdown symbols)
 * Used for: Copy to clipboard, Text-to-speech
 * @param {string} text - Text with markdown
 * @returns {string} - Plain text without markdown
 */
export const cleanTextForDisplay = (text) => {
  if (!text) return '';

  return text
    .replace(/^#+\s+/gm, '')              // Remove hash symbols from headers
    .replace(/\*\*(.*?)\*\*/g, '$1')     // Remove bold markers but keep content
    .replace(/\*(.*?)\*/g, '$1')         // Remove italic markers but keep content
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove code markers but keep content
    .replace(/[_>-]/g, ' ')              // Clean other markdown chars
    .trim();
};

/**
 * Parse formatted text and create React elements
 * Converts bold markdown to actual bold HTML
 * Used for: UI Display
 * @param {string} text - Text with markdown formatting
 * @returns {Array|string} - Array of elements or string for display
 */
export const parseFormattedText = (text) => {
  if (!text) return '';

  const parts = [];
  let lastIndex = 0;

  // Match bold text: **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before bold
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add bold text as object
    parts.push({
      type: 'bold',
      content: match[1],
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

/**
 * Render parsed text with proper formatting
 * Converts parsed parts to display format
 * @param {Array|string} parts - Parsed text parts
 * @returns {string} - Formatted display text
 */
export const renderFormattedText = (parts) => {
  if (typeof parts === 'string') {
    return parts;
  }

  if (Array.isArray(parts)) {
    return parts
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }
        if (part.type === 'bold') {
          return part.content; // Bold will be applied via CSS class
        }
        return '';
      })
      .join('');
  }

  return '';
};