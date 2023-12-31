import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfileTitle from "../../layout/profileTitle/ProfileTitle";
import RightSide from "./components/RightSide";
import api from "../../api/apiCalls";
import ConditionalContainer from "./components/ConditionalContainer";
import { deleteBook } from "../../redux/actions";
import "./BookInfo.css";

export default function BookInfo({
  specification,
  multimedia,
  evidence,
  rentedEvidence,
  returnedEvidence,
  reservationEvidence,
  excessEvidence,
  archivedEvidence,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const booksData = useSelector((state) => state.books);
  const fetchedData = useLoaderData();

  const [book, setBook] = useState({
    title: "loading...",
    categories: [{ name: "loading..." }],
    authors: [{ name: "loading...", surname: "loading..." }],
    genres: [{ name: "loading..." }],
    publisher: { name: "loading..." },
    pDate: "2023",
    description: "loading...",
    language: { name: "loading..." },
    bookbind: { name: "loading..." },
    format: { name: "loading..." },
    isbn: "loading...",
    photo: "",
  });

  useEffect(() => {
    setBook(fetchedData);
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/books/${fetchedData.id}/destroy`);
      dispatch(deleteBook([booksData], fetchedData.id));
      toast.success("Izbrisana knjiga");
      navigate("/books");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="book-container">
      <ProfileTitle
        userInfo={book ? { name: book.title } : { name: "loading..." }}
        linkOne={"Sve knjige"}
        linkOnePath={"/books"}
        linkTwoPath={`/books/`}
        image={book.photo}
        change={true}
        deleteMssg={true}
        booksSpecial={true}
        editPath={`/books/${fetchedData.id}/edit`}
        handleDelete={handleDelete}
      />
      <div className="bottom-wrapper">
        <ConditionalContainer
          conditionals={{
            specification: specification,
            multimedia: multimedia,
            evidence: evidence,
            rentedEvidence: rentedEvidence,
            returnedEvidence: returnedEvidence,
            reservationEvidence: reservationEvidence,
            excessEvidence: excessEvidence,
            archivedEvidence: archivedEvidence,
            book: book,
            photo: book.photo,
          }}
        />
        <RightSide bookInfo={book} />
      </div>
    </div>
  );
}

export const BookLoader = async ({ params }) => {
  const id = params.id;
  try {
    const response = await api.get(`/books/${id}`);
    const responseData = response.data.data;
    return responseData;
  } catch (error) {
    console.error("Loader function error:", error);
    throw error;
  }
};
