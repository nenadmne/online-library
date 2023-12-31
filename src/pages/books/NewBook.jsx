import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import SettingsForm from "../../components/UI/SettingsForm";
import { filterAndMap } from "../../util/Functions";
import { updateFormData } from "../../redux/new-book-data";
import api from "../../api/apiCalls";
import { updateCurrentData } from "../../redux/new-book-current";
import { blurHandler } from "../../util/NewBookFunctions";
import { fetchAuthors } from "../../util/NewBookFunctions";
import { getClasses } from "../../util/NewBookFunctions";
import "./NewBook.css";

const NewBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nextLevel, setNextLevel] = useState(false);
  const currentBookData = useSelector((state) => state.newBookCurrent);

  const [nameIsValid, setNameIsValid] = useState(false);
  const [quantityIsValid, setQuantityIsValid] = useState(false);
  const [yearIsValid, setYearIsValid] = useState(false);

  const [clickedName, setClickedName] = useState(false);
  const [clickedYear, setClickedYear] = useState(false);
  const [clickedQuantity, setClickedQuantity] = useState(false);

  const nameBlurHandler = blurHandler(setClickedName);
  const quantityBlurHandler = blurHandler(setClickedQuantity);
  const yearBlurHandler = blurHandler(setClickedYear);

  const [richTextareaValue, setRichTextareaValue] = useState("");
  const richTextareaChangeHandler = (newValue) => {
    setRichTextareaValue(newValue);
  };
  const [categoryValue, setCategoryValue] = useState({
    value: "",
    label: "",
  });
  const categoryChangeHandler = (newValue) => {
    setCategoryValue(newValue);
  };

  const [genreValue, setGenreValue] = useState({
    value: "",
    label: "",
  });
  const genreChangeHandler = (newValue) => {
    setGenreValue(newValue);
  };

  const [authorValue, setAuthorValue] = useState({
    value: "",
    label: "",
  });
  const authorChangeHandler = (newValue) => {
    setAuthorValue(newValue);
  };

  const [publisherValue, setPublisherValue] = useState({
    value: "",
    label: "",
  });
  const publisherChangeHandler = (newValue) => {
    setPublisherValue(newValue);
  };

  const [nameValue, setNameValue] = useState(currentBookData.nazivKnjiga || "");
  const nameChangeHandler = (event) => {
    setNameValue(event.target.value);
    setNameIsValid(event.target.value !== "");
  };
  const [yearValue, setYearValue] = useState(
    currentBookData.godinaIzdavanja || ""
  );
  const yearChangeHandler = (event) => {
    setYearValue(event.target.value);
    setYearIsValid(event.target.value !== "");
  };
  const [quantityValue, setQuantityValue] = useState(
    currentBookData.knjigaKolicina || ""
  );
  const quantityChangeHandler = (event) => {
    setQuantityValue(event.target.value);
    setQuantityIsValid(event.target.value !== "");
  };
  const fetchedData = useLoaderData();
  const [data, setData] = useState({});
  const [authors, setAuthors] = useState([]);

  const categoryIsValid = categoryValue.value !== "";
  const genreIsValid = genreValue.value !== "";
  const authorIsValid = authorValue.value !== "";
  const publisherIsValid = publisherValue.value !== "";
  let formIsValid = false;
  if (
    nameIsValid &&
    genreIsValid &&
    categoryIsValid &&
    authorIsValid &&
    publisherIsValid &&
    yearIsValid &&
    quantityIsValid
  ) {
    formIsValid = true;
  }

  const submitHandler = () => {
    setNextLevel(true);
    const formData = {
      nazivKnjiga: nameValue,
      kratki_sadrzaj: richTextareaValue,
      categories: filterAndMap(data.categories, categoryValue),
      genres: filterAndMap(data.genres, genreValue),
      authors: filterAndMap(data.authors, authorValue.split(" ")[0]),
      izdavac: Number(filterAndMap(data.publishers, publisherValue)),
      godinaIzdavanja: yearValue,
      knjigaKolicina: quantityValue,
    };
    dispatch(updateFormData(formData));
    dispatch(
      updateCurrentData({
        nazivKnjiga: nameValue,
        kratki_sadrzaj: richTextareaValue,
        categories: categoryValue,
        genres: genreValue,
        authors: authorValue,
        izdavac: publisherValue,
        godinaIzdavanja: yearValue,
        knjigaKolicina: quantityValue,
      })
    );
    navigate("/books/new/specifikacija");
  };

  const nameClasses = getClasses(nameIsValid, clickedName);
  const quantityClasses = getClasses(quantityIsValid, clickedQuantity);
  const yearClasses = getClasses(yearIsValid, clickedYear);

  useEffect(() => {
    const fetchingAuthorData = async () => {
      const data = await fetchAuthors();
      setAuthors(data);
    };
    fetchingAuthorData();
    setData(fetchedData);
    setGenreValue(currentBookData.genres);
    setCategoryValue(currentBookData.categories);
    setPublisherValue(currentBookData.izdavac);
    setAuthorValue(currentBookData.authors);
    setNameIsValid(nameValue !== "");
    setYearIsValid(yearValue !== "");
    setQuantityIsValid(quantityValue !== "");
    setNextLevel(false);
  }, []);

  const resetHandler = () => {
    setRichTextareaValue("");
    setQuantityValue("");
    setYearValue("");
    setNameValue("");
  };

  return (
    <div className="new-book-position-handler">
      <SettingsForm
        input={[
          {
            label: "Naziv knjige",
            inputClasses: nameClasses,
            type: "text",
            name: "books",
            value: nameValue,
            onBlur: nameBlurHandler,
            onChange: nameChangeHandler,
          },
        ]}
        richTextarea={{
          label: "Kratki sadržaj",
          name: "description",
          value: currentBookData.kratki_sadrzaj || richTextareaValue,
          valueUpdate: richTextareaChangeHandler,
        }}
        select={[
          {
            options: data.categories,
            label: "Izaberite kategoriju",
            value: currentBookData.categories || categoryValue,
            onChange: categoryChangeHandler,
          },
          {
            options: data.genres,
            label: "Izaberite žanr",
            value: currentBookData.genres || genreValue,
            onChange: genreChangeHandler,
          },
        ]}
        title="Nova knjiga"
        firstLinkName="Knjige"
        path="/books"
        pathDashboard="/dashboard"
        formIsValid={formIsValid}
        reset={() => resetHandler()}
        submit={() => submitHandler()}
        className="new-book-wrapper-left"
        headers={true}
        nextLevel={nextLevel}
      />
      <SettingsForm
        select={[
          {
            options: data.publishers,
            label: "Izaberite izdavača",
            value: currentBookData.izdavac || publisherValue,
            onChange: publisherChangeHandler,
          },
          {
            options: authors,
            label: "Izaberite autore",
            value: currentBookData.authors || authorValue,
            onChange: authorChangeHandler,
          },
        ]}
        input={[
          {
            label: "Godina izdavanja",
            inputClasses: yearClasses,
            type: "text",
            name: "year",
            value: yearValue,
            onBlur: yearBlurHandler,
            onChange: yearChangeHandler,
          },
          {
            label: "Količina",
            inputClasses: quantityClasses,
            type: "text",
            name: "quantity",
            value: quantityValue,
            onBlur: quantityBlurHandler,
            onChange: quantityChangeHandler,
          },
        ]}
        reset={() => resetHandler()}
        submit={() => submitHandler()}
        formIsValid={formIsValid}
        className="new-book-wrapper-right"
        nextLevel={nextLevel}
      />
    </div>
  );
};
export default NewBook;

export async function LoaderCreateBook() {
  try {
    const response = await api.get(`/books/create`);
    const responseData = response.data.data;
    return responseData;
  } catch (error) {
    console.error("Loader function error:", error);
    throw error;
  }
}
