import React, { useCallback, useEffect, useState } from 'react';

import { HexColorPicker } from 'react-colorful';
import axios from 'axios';
import styles from './AdminTagsPage.module.css';
import { useTable } from 'react-table';

const AdminTagsPage = () => {
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTag, setEditingTag] = useState(null);
  const [updatedTagName, setUpdatedTagName] = useState('');
  const [updatedTagColor, setUpdatedTagColor] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [error, setError] = useState('');

  const fetchTags = useCallback(() => {
    axios.get('https://eventify-backend.azurewebsites.net/api/Tag/get-all')
      .then(response => {
        setTags(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the tags!", error);
      });
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleUpdate = (tag) => {
    setEditingTag(tag);
    setUpdatedTagName(tag.name);
    setUpdatedTagColor(tag.color);
    setShowColorPicker(false);
  };

  const handleDelete = useCallback(async (tagId) => {
    try {
      await axios.delete(`https://eventify-backend.azurewebsites.net/api/Tag/delete`, {
        params: { id: tagId },
      });
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag', error);
      setError('There was an error deleting the tag.');
    }
  }, [fetchTags, setError]);

  const handleSubmitUpdate = async () => {
    try {
      await axios.patch('https://eventify-backend.azurewebsites.net/api/Tag/update', {
        id: editingTag.id,
        name: updatedTagName,
        color: updatedTagColor
      });
      setEditingTag(null);
      fetchTags();
    } catch (error) {
      console.error("There was an error updating the tag!", error);
      setError('There was an error updating the tag.');
    }
  };

  const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const data = React.useMemo(() => filteredTags, [filteredTags]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Color',
        accessor: 'color',
        Cell: ({ value }) => (
          <div style={{ backgroundColor: value, width: '20px', height: '20px', borderRadius: '4px' }}></div>
        ),
      },
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }) => (
          <div className={styles.actions}>
            <button onClick={() => handleUpdate(row.original)}>Update</button>
            <button onClick={() => handleDelete(row.original.id)}>Delete</button>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className={styles.tableContainer}>
      <h2>Tags</h2>
      <input
        type="text"
        placeholder="Search by tag name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
      {editingTag && (
        <div className={styles.updateTagContainer}>
          <h4>Update Tag</h4>
          <input
            type="text"
            placeholder="Tag Name"
            value={updatedTagName}
            onChange={(e) => setUpdatedTagName(e.target.value)}
          />
          <div className={styles.colorPickerContainer}>
            <button type="button" onClick={() => setShowColorPicker(!showColorPicker)}>
              {showColorPicker ? "Close Color Picker" : "Pick Color"}
            </button>
            <div className={styles.selectedColor} style={{ backgroundColor: updatedTagColor }} />
          </div>
          {showColorPicker && (
            <HexColorPicker
              color={updatedTagColor}
              onChange={setUpdatedTagColor}
            />
          )}
          <button type="button" onClick={handleSubmitUpdate}>
            Submit
          </button>
          <button type="button" onClick={() => setEditingTag(null)}>
            Cancel
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map(headerGroup => {
            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map(column => {
                  const { key, ...restColumnProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...restColumnProps}>{column.render('Header')}</th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <tr key={key} {...restRowProps}>
                {row.cells.map(cell => {
                  const { key, ...restCellProps } = cell.getCellProps();
                  return (
                    <td key={key} {...restCellProps}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTagsPage;
