import React, { useState, useEffect, useRef } from 'react';

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [blockType, setBlockType] = useState('p'); // Default to paragraph

  // Helper function to create data structure
  const createContentData = (htmlContent) => {
    return {
      contentBlocks: [
        {
          type: 'richtext',
          content: htmlContent
        }
      ],
      htmlContent: htmlContent
    };
  };

  // Get the block type at the current cursor position
  const getCurrentBlockType = () => {
    if (!editorRef.current) return 'p';
    const selection = window.getSelection();
    if (!selection.rangeCount) return 'p';
    let node = selection.getRangeAt(0).commonAncestorContainer;
    while (node && node !== editorRef.current) {
      if (node.nodeType === 1) {
        const tagName = node.tagName.toLowerCase();
        if (['h2', 'h3', 'h4', 'h5', 'p'].includes(tagName)) {
          return tagName;
        }
      }
      node = node.parentNode;
    }
    return 'p'; // Default to paragraph if no block element is found
  };

  // Apply block formatting
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      if (onChange) {
        try {
          const content = editorRef.current.innerHTML;
          const contentData = createContentData(content);
          onChange(contentData);
        } catch (error) {
          console.error('Error in formatText:', error);
        }
      }
      // Update blockType state based on current cursor position
      setBlockType(getCurrentBlockType());
    }
  };

  const isFormatActive = (command) => {
    return document.queryCommandState(command);
  };

  const handleBlockTypeChange = (type) => {
    setBlockType(type);
    // Ensure the entire content or selected block is wrapped in the chosen tag
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const selectedContent = range.extractContents();
      const newBlock = document.createElement(type);
      newBlock.appendChild(selectedContent);
      range.insertNode(newBlock);
      // Place cursor inside the new block
      const newRange = document.createRange();
      newRange.selectNodeContents(newBlock);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // If no selection, apply formatBlock to the entire editor
      document.execCommand('formatBlock', false, type.toUpperCase());
    }
    if (editorRef.current) {
      editorRef.current.focus();
      if (onChange) {
        try {
          const content = editorRef.current.innerHTML;
          const contentData = createContentData(content);
          onChange(contentData);
        } catch (error) {
          console.error('Error in handleBlockTypeChange:', error);
        }
      }
    }
  };

  // Handle content change with null safety
  const handleContentChange = () => {
    if (onChange && editorRef.current) {
      try {
        const content = editorRef.current.innerHTML;
        const contentData = createContentData(content);
        onChange(contentData);
        // Update blockType based on cursor position
        setBlockType(getCurrentBlockType());
      } catch (error) {
        console.error('Error in handleContentChange:', error);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    
    if (onChange && editorRef.current) {
      try {
        const content = editorRef.current.innerHTML;
        const contentData = createContentData(content);
        onChange(contentData);
        setBlockType(getCurrentBlockType());
      } catch (error) {
        console.error('Error in handlePaste:', error);
      }
    }
  };

  // Initialize editor content and ensure default block type is 'p'
  useEffect(() => {
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      const newValue = value || '';
      
      // Only update if content has changed
      if (newValue !== currentContent) {
        editorRef.current.innerHTML = newValue || `<p></p>`;
        // Ensure default block type is paragraph if empty
        if (!newValue) {
          document.execCommand('formatBlock', false, 'P');
          setBlockType('p');
        }
      }
      // Update blockType based on current content
      setBlockType(getCurrentBlockType());
    }
  }, [value]);

  // Set placeholder when component mounts
  useEffect(() => {
    if (editorRef.current && placeholder && !value) {
      editorRef.current.setAttribute('data-placeholder', placeholder);
    }
  }, [placeholder, value]);

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ 
        padding: '10px', 
        background: '#f8f9fa', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center'
      }}>
        {/* Block Type (Headings and Paragraph) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <label style={{ fontSize: '12px', fontWeight: '500' }}>Kiểu:</label>
          <select 
            value={blockType} 
            onChange={(e) => handleBlockTypeChange(e.target.value)}
            style={{ 
              padding: '4px 8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value="p">Đoạn văn</option>
            <option value="h2">Tiêu đề 2</option>
            <option value="h3">Tiêu đề 3</option>
            <option value="h4">Tiêu đề 4</option>
            <option value="h5">Tiêu đề 5</option>
          </select>
        </div>

        <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 5px' }}></div>

        {/* Basic Formatting */}
        <button
          onClick={() => formatText('bold')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: isFormatActive('bold') ? '#007bff' : 'white',
            color: isFormatActive('bold') ? 'white' : '#333',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          B
        </button>
        <button
          onClick={() => formatText('italic')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: isFormatActive('italic') ? '#007bff' : 'white',
            color: isFormatActive('italic') ? 'white' : '#333',
            borderRadius: '4px',
            fontStyle: 'italic',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          I
        </button>
        <button
          onClick={() => formatText('underline')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: isFormatActive('underline') ? '#007bff' : 'white',
            color: isFormatActive('underline') ? 'white' : '#333',
            borderRadius: '4px',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          U
        </button>

        <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 5px' }}></div>

        {/* Alignment */}
        <button
          onClick={() => formatText('justifyLeft')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ←
        </button>
        <button
          onClick={() => formatText('justifyCenter')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ═
        </button>
        <button
          onClick={() => formatText('justifyRight')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          →
        </button>

        <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 5px' }}></div>

        {/* Lists */}
        <button
          onClick={() => formatText('insertOrderedList')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          1.
        </button>
        <button
          onClick={() => formatText('insertUnorderedList')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          •
        </button>

        <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 5px' }}></div>

        {/* Colors */}
        <button
          onClick={() => formatText('foreColor', '#ff0000')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: 'white',
            color: '#ff0000',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          A
        </button>
        <button
          onClick={() => formatText('foreColor', '#0000ff')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: 'white',
            color: '#0000ff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          A
        </button>
        <button
          onClick={() => formatText('foreColor', '#008000')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: 'white',
            color: '#008000',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          A
        </button>

        <button
          onClick={() => formatText('removeFormat')}
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            background: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            marginLeft: '10px'
          }}
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleContentChange}
        onPaste={handlePaste}
        style={{
          minHeight: '120px',
          padding: '12px',
          outline: 'none',
          lineHeight: '1.5',
          direction: 'ltr', // Ensure left-to-right text direction
          unicodeBidi: 'embed' // Support Unicode characters
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;