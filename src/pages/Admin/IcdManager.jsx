import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

// Default icdOptions removed; options are loaded dynamically from the API.

/* Custom MenuList that preserves react-select's Option elements */
const CollapsibleMenuList = (props) => {
  // track collapsed state per group label
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (label) =>
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  // props.children are Group elements created by react-select.
  // Each groupElem.props.data.label is the group label,
  // and groupElem.props.children contains the Option elements.
  return (
    // spread props.innerProps onto the container so keyboard/scroll works
    <div {...props.innerProps}>
      {React.Children.map(props.children, (groupElem, idx) => {
        if (!groupElem) return null;

        // Try to get the group label from the generated Group element props
        const groupLabel =
          (groupElem.props && groupElem.props.data && groupElem.props.data.label) ||
          (groupElem.props && groupElem.props.label) ||
          `group-${idx}`;

        const isCollapsed = !!collapsedGroups[groupLabel];

        return (
          <div key={groupLabel} style={{ userSelect: "none" }}>
            {/* Category header */}
            <div
          
              onClick={() => toggleGroup(groupLabel)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 10px",
                background: "#f5f7fa",
                borderBottom: "1px solid #eceff3",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <span>{groupLabel}</span>
              <span style={{ fontSize: 12 }}>{isCollapsed ? "▶" : "▼"}</span>
            </div>

            {/* If not collapsed -> render the original Option elements (preserves hover) */}
            {!isCollapsed && (
              <div style={{ paddingLeft: 6 }}>
                {/* groupElem.props.children can be a single element or array */}
                {groupElem.props && groupElem.props.children
                  ? groupElem.props.children
                  : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function IcdCollapsibleDropdown({ onChange }) {
  const [selected, setSelected] = useState([]);

  const handleChange = (value) => {
    setSelected(value);
    if (onChange) {
      onChange(value);
    }
  };

  const [options, setOptions] = useState([]);

   useEffect(() => {
    axios.get("http://localhost/api/ICD-10.php").then((res) => {
      const grouped = groupByCategory(res.data);
      setOptions(grouped);
    });
  }, []);

  const groupByCategory = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      if (!groupedData[item.Category]) {
        groupedData[item.Category] = [];
      }
      groupedData[item.Category].push({
        value: item.Code,
        label: `${item.Code} - ${item.Description}`,
      });
    });

    return Object.keys(groupedData).map((key) => ({
      label: key,
      options: groupedData[key],
    }));

  }


  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 12 }}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        Select Diagnosis (ICD)
      </label>

      <Select
  options={options}
  value={selected}
  onChange={handleChange}
  isSearchable
  isMulti
  placeholder="Search or select ICD..."
  components={{ MenuList: CollapsibleMenuList }}
  styles={{
    container: (base) => ({
      ...base,
      width: "100%",          // match parent width
    }),
    control: (base) => ({
      ...base,
      minHeight: 38,          // match typical input height
      borderRadius: 4,        // match your input box radius
      borderColor: "#ced4da",// match form input border
      boxShadow: "none",      // remove default shadow
      "&:hover": { borderColor: "#a1a1a1" }, // hover border
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e6f0ff", // match your selected background if needed
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",       // match your placeholder color
    }),
  }}
/>
{/*
      {selected && selected.length > 0 && (
        <div
            style={{
            marginTop: 12,
            padding: 10,
            border: "1px solid #e6eef9",
            borderRadius: 6,
            background: "#f8fbff",
            }}
        >
            <strong>Selected ICDs:</strong>
            <ul style={{ marginTop: 6, paddingLeft: 20 }}>
            {selected.map((s) => (
                <li key={s.value}>{s.label}</li>
            ))}
            </ul>
        </div>
        )}
        */}
    </div>
  );
}

