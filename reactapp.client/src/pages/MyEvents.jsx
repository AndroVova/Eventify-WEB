import React, { useEffect, useState } from 'react';

import axios from 'axios';
import styles from './MyEvents.module.css';
import { useSelector } from "react-redux";
import { useTable } from 'react-table';
import { useTranslation } from "react-i18next";

const MyEvents = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`https://eventify-backend.azurewebsites.net/api/Event/get-all-by-creator?userId=${user.id}`)
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the events!", error);
      });
  }, [user.id]);

  const handleView = (eventId) => {
    // Add logic to view the event details
    console.log(`View event ${eventId}`);
  };

  const handleUpdate = (eventId) => {
    // Add logic to update the event
    console.log(`Update event ${eventId}`);
  };

  const data = React.useMemo(() => events, [events]);

  const columns = React.useMemo(
    () => [
      {
        Header: t('Name'),
        accessor: 'name',
      },
      {
        Header: t('Description'),
        accessor: 'description',
      },
      {
        Header: t('Type'),
        accessor: 'type',
      },
      {
        Header: t('Age Limit'),
        accessor: 'ageLimit',
      },
      {
        Header: t('Date'),
        accessor: 'date',
      },
      {
        Header: t('Link'),
        accessor: 'link',
      },
      {
        Header: t('Actions'),
        accessor: 'id',
        Cell: ({ value }) => (
          <div className={styles.actions}>
            <button onClick={() => handleView(value)}>{t('View')}</button>
            <button onClick={() => handleUpdate(value)}>{t('Update')}</button>
          </div>
        ),
      },
    ],
    [t]
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
      <h2>{t('My Events')}</h2>
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

export default MyEvents;
