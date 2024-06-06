import React, { useCallback, useEffect, useState } from 'react';

import DraggableModal from '../components/layout/DraggableModal/DraggableModal';
import Event from '../components/events/Event';
import axios from 'axios';
import styles from './MyEvents.module.css';
import { useSelector } from "react-redux";
import { useTable } from 'react-table';
import { useTranslation } from "react-i18next";

const MyEvents = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    axios.get(`https://eventify-backend.azurewebsites.net/api/Event/get-all-by-creator?userId=${user.id}`)
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the events!", error);
      });
  }, [user.id]);

  const handleView = useCallback((eventId) => {
    axios.get(`https://eventify-backend.azurewebsites.net/api/Event/get-by-id?eventId=${eventId}`)
      .then(response => {
        setSelectedEvent(response.data);
        setIsModalVisible(true);
      })
      .catch(error => {
        console.error("There was an error fetching the event details!", error);
      });
  }, []);

  const handleUpdate = useCallback((eventId) => {
    // Add logic to update the event
    console.log(`Update event ${eventId}`);
  }, []);

  const handleDelete = useCallback((eventId) => {
    if (window.confirm(t("Are you sure you want to delete this event?"))) {
      axios.delete(`https://eventify-backend.azurewebsites.net/api/Event/delete-event?eventId=${eventId}`)
        .then(() => {
          // Update the events state to remove the deleted event
          setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
          console.log(`Event ${eventId} deleted successfully`);
        })
        .catch(error => {
          console.error("There was an error deleting the event!", error);
        });
    }
  }, [t]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  }, []);

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
            <button onClick={() => handleDelete(value)}>{t('Delete')}</button>
          </div>
        ),
      },
    ],
    [handleView, handleUpdate, handleDelete, t]
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
      {isModalVisible && selectedEvent && (
        <DraggableModal
          isVisible={isModalVisible}
          onClose={closeModal}
          headerText={t("Event Details")}
        >
          <Event
            event={selectedEvent}
            setEventsData={setEvents}
          />
        </DraggableModal>
      )}
    </div>
  );
};

export default MyEvents;
