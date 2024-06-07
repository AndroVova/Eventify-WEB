import React, { useCallback, useEffect, useState } from "react";

import AddEventForm from "../components/events/AddEventForm";
import DraggableModal from "../components/layout/DraggableModal/DraggableModal";
import Event from "../components/events/Event";
import Loader from "../components/utils/Loader/Loader";
import PaginationControls from "../components/events/PaginationControls";
import axios from "axios";
import styles from "./MyEvents.module.css";
import { useSelector } from "react-redux";
import { useTable } from "react-table";
import { useTranslation } from "react-i18next";

const AdminEventsPage = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalUrl, setModalUrl] = useState("");
  const itemsPerPage = 15;
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchField, setSearchField] = useState("");

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const postData = {
      searchText: searchQuery,
      page: currentPage,
      pageSize: itemsPerPage,
      userid: user.id,
    };

    try {
      const response = await axios.post(
        "https://eventify-backend.azurewebsites.net/api/Event/get-events",
        postData
      );
      if (response.status !== 200) {
        throw new Error(t("Failed to fetch events"));
      }
      const data = response.data;
      setEvents(data);

      const paginationHeader = response.headers["x-pagination"];
      if (paginationHeader) {
        const paginationData = JSON.parse(paginationHeader);
        const totalPages = paginationData.totalPages;
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error(t("Error fetching events"), error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentPage, itemsPerPage, t, user.id]);

  const handleSearchChange = (e) => {
    setSearchField(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(searchField);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, searchQuery]);

  const handleView = useCallback((eventId) => {
    axios
      .get(
        `https://eventify-backend.azurewebsites.net/api/Event/get-by-id?eventId=${eventId}`
      )
      .then((response) => {
        setSelectedEvent(response.data);
        setIsEditing(false);
        setIsModalVisible(true);
      })
      .catch((error) => {
        console.error("There was an error fetching the event details!", error);
      });
  }, []);

  const handleUpdate = useCallback((eventId) => {
    axios
      .get(
        `https://eventify-backend.azurewebsites.net/api/Event/get-by-id?eventId=${eventId}`
      )
      .then((response) => {
        setSelectedEvent(response.data);
        setModalUrl(
          "https://eventify-backend.azurewebsites.net/api/Event/update-event"
        );
        setIsEditing(true);
        setIsModalVisible(true);
      })
      .catch((error) => {
        console.error("There was an error fetching the event details!", error);
      });
  }, []);

  const handleDelete = useCallback(
    (eventId) => {
      if (window.confirm(t("Are you sure you want to delete this event?"))) {
        axios
          .delete(
            `https://eventify-backend.azurewebsites.net/api/Event/delete-event?eventId=${eventId}`
          )
          .then(() => {
            setEvents((prevEvents) =>
              prevEvents.filter((event) => event.id !== eventId)
            );
            console.log(`Event ${eventId} deleted successfully`);
          })
          .catch((error) => {
            console.error("There was an error deleting the event!", error);
          });
      }
    },
    [t]
  );

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedEvent(null);
    setIsEditing(false);
  }, []);

  const handleFormSubmit = (updatedEvent) => {
    fetchEvents();
    closeModal();
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const data = React.useMemo(() => events, [events]);

  const columns = React.useMemo(
    () => [
      {
        Header: t("Name"),
        accessor: "name",
      },
      {
        Header: t("Description"),
        accessor: "description",
      },
      {
        Header: t("Type"),
        accessor: "type",
      },
      {
        Header: t("Age Limit"),
        accessor: "ageLimit",
      },
      {
        Header: t("Date"),
        accessor: "date",
      },
      {
        Header: t("Link"),
        accessor: "link",
      },
      {
        Header: t("Actions"),
        accessor: "id",
        Cell: ({ value }) => (
          <div className={styles.actions}>
            <button onClick={() => handleView(value)}>{t("View")}</button>
            <button onClick={() => handleUpdate(value)}>{t("Update")}</button>
            <button onClick={() => handleDelete(value)}>{t("Delete")}</button>
          </div>
        ),
      },
    ],
    [handleView, handleUpdate, handleDelete, t]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className={styles.tableContainer}>
      <h2>{t("My Events")}</h2>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchField}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          placeholder={t("Search events...")}
          className={styles.searchInput}
        />
      </div>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <>
          <table {...getTableProps()} className={styles.table}>
            <thead>
              {headerGroups.map((headerGroup) => {
                const { key, ...restHeaderGroupProps } =
                  headerGroup.getHeaderGroupProps();
                return (
                  <tr key={key} {...restHeaderGroupProps}>
                    {headerGroup.headers.map((column) => {
                      const { key, ...restColumnProps } =
                        column.getHeaderProps();
                      return (
                        <th key={key} {...restColumnProps}>
                          {column.render("Header")}
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                const { key, ...restRowProps } = row.getRowProps();
                return (
                  <tr key={key} {...restRowProps}>
                    {row.cells.map((cell) => {
                      const { key, ...restCellProps } = cell.getCellProps();
                      return (
                        <td key={key} {...restCellProps}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
          />
        </>
      )}
      {isModalVisible && (
        <DraggableModal
          isVisible={isModalVisible}
          onClose={closeModal}
          headerText={isEditing ? t("Update Event") : t("Event Details")}
        >
          {isEditing ? (
            <AddEventForm
              url={modalUrl}
              initialForm={selectedEvent}
              onSubmit={handleFormSubmit}
            />
          ) : (
            <Event event={selectedEvent} setEventsData={setEvents} />
          )}
        </DraggableModal>
      )}
    </div>
  );
};

export default AdminEventsPage;
