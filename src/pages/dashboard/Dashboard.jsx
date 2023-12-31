import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import PageTitle from "../../components/pageTitle/PageTitle";
import ReservationList from "./layouts/reservationList/ReservationList";
import ActivityList from "./layouts/activityList/ActivityList";
import Chart from "../../components/UI/Chart";
import libraryApi from "../../api/apiCalls";
import { LoaderRented } from "../rentingBooks/rentingBooks";
import "./dashboard.css";

export default function Dashboard() {
  console.log("Dwadwa");
  const [reservations, setReservations] = useState({
    active: [
      {
        student: { name: "loading...", surname: "loading..." },
        knjiga: { title: "loading..." },
        action_date: "loading...",
      },
    ],
  });

  const [rented, setRented] = useState({
    izdate: [
      {
        bibliotekar0: { name: "loading...", surname: "loading..." },
        knjiga: { title: "loading..." },
        student: { name: "loading...", surname: "loading..." },
      },
    ],
    prekoracene: [],
  });

  const fetchedDataReservation = useLoaderData();
  console.log(fetchedDataReservation);

  useEffect(() => {
    setReservations(fetchedDataReservation);
    const fetchData = async () => {
      try {
        const data = await LoaderRented();
        setRented(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageTitle title="Dashboard" />
      <div className="dashboard-wrapper">
        <ActivityList rented={rented.izdate} />
        <div className="right-side">
          <ReservationList reservations={reservations.active} />
          <Chart
            reservations={reservations.active.length}
            izdate={{
              izdate: rented.izdate.length,
              prekoracene: rented.prekoracene.length,
            }}
          />
        </div>
      </div>
    </>
  );
}

export async function reservationLoader() {
  try {
    const response = await libraryApi.get(`/books/reservations`);
    const responseData = response.data.data;
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Loader function error:", error);
    throw error;
  }
}
