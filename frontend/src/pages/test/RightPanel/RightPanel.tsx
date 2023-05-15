import React, { useState } from 'react';

const RightPanel = () => {
  const [properties, setProperties] = useState({
    name: 'My Component',
    color: '#ffffff',
    size: 'medium',
  });

  const handlePropertyChange = (propertyName: any, newValue: any) => {
    setProperties({
      ...properties,
      [propertyName]: newValue,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '400px',
        paddingTop: "64px",
        backgroundColor: '#f1f1f1',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
        zIndex: 999, // ensure panel is above other elements
      }}
    >
      <h2>Properties</h2>
      <label>
        Name:
        <input
          type="text"
          value={properties.name}
          onChange={(e) => handlePropertyChange('name', e.target.value)}
        />
      </label>
      <label>
        Color:
        <input
          type="color"
          value={properties.color}
          onChange={(e) => handlePropertyChange('color', e.target.value)}
        />
      </label>
      <label>
        Size:
        <select
          value={properties.size}
          onChange={(e) => handlePropertyChange('size', e.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>
    </div>
  );
};

export default RightPanel;
